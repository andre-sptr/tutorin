import { useCallback, useRef, useSyncExternalStore } from 'react';

const LOCAL_STORAGE_CHANGE_EVENT = "local-storage-change";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const initialValueRef = useRef(initialValue);
  const lastRawValueRef = useRef<string | null | undefined>(undefined);
  const lastParsedValueRef = useRef<T>(initialValue);

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return initialValueRef.current;

    try {
      const item = window.localStorage.getItem(key);

      if (item === lastRawValueRef.current) {
        return lastParsedValueRef.current;
      }

      lastRawValueRef.current = item;
      lastParsedValueRef.current = item ? JSON.parse(item) : initialValueRef.current;
      return lastParsedValueRef.current;
    } catch (error) {
      console.log(error);
      return initialValueRef.current;
    }
  }, [key]);

  const getServerSnapshot = useCallback(() => initialValueRef.current, []);

  const subscribe = useCallback((onStoreChange: () => void) => {
    if (typeof window === "undefined") return () => undefined;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) onStoreChange();
    };

    const handleLocalStorageChange = (event: Event) => {
      if (event instanceof CustomEvent && event.detail?.key === key) onStoreChange();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleLocalStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleLocalStorageChange);
    };
  }, [key]);

  const storedValue = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      if (typeof window !== "undefined") {
        const rawValue = JSON.stringify(valueToStore);
        window.localStorage.setItem(key, rawValue);
        lastRawValueRef.current = rawValue;
        lastParsedValueRef.current = valueToStore;
        window.dispatchEvent(new CustomEvent(LOCAL_STORAGE_CHANGE_EVENT, { detail: { key } }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}
