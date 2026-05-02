"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle, X, Send, Loader2, Bot, User, Minimize2, RotateCcw, Mic } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const WELCOME_MESSAGE: UIMessage = {
    id: "welcome",
    role: "assistant",
    parts: [{
        type: "text",
        text: "## Halo Sobat! 👋\n\nSaya **Bang Tutor**, asisten AI dari **TutorinBang** — siap bantu kamu mengatasi kendala teknologi sehari-hari.\n\n**Yang bisa saya bantu:**\n- 💻 Masalah laptop & PC (Windows, driver, error)\n- 📊 Microsoft Office (Word, Excel, PowerPoint)\n- 🖨️ Troubleshoot printer (tidak bisa print, paper jam)\n- 🌐 Koneksi internet & jaringan\n- 🔧 Tips produktivitas komputer\n\nCeritakan masalahmu, dan saya akan bantu selangkah demi selangkah! 🚀"
    }]
};

const AUTO_OPEN_KEY = "tutorinbang_chat_welcomed";

const CHIP_SUGGESTIONS = [
    "Kenapa printer saya not responding? 🖨️",
    "Cara mengatasi laptop lemot di Windows 11 💻",
    "Rumus VLOOKUP di Excel untuk pemula 📊",
    "WiFi konek tapi internet tidak jalan 🌐",
];

const MARKDOWN_PLUGINS = [remarkGfm];

const MARKDOWN_COMPONENTS: Components = {
    p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    ul: ({ children }) => <ul className="list-disc list-inside space-y-0.5 my-1.5 pl-1">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside space-y-0.5 my-1.5 pl-1">{children}</ol>,
    li: ({ children }) => <li className="text-sm">{children}</li>,
    h1: ({ children }) => <p className="font-extrabold text-base mt-2 mb-1">{children}</p>,
    h2: ({ children }) => <p className="font-extrabold text-sm mt-2 mb-1">{children}</p>,
    h3: ({ children }) => <p className="font-bold text-sm mt-1.5 mb-0.5">{children}</p>,
    code: ({ children }) => (
        <code className="bg-black/10 dark:bg-white/10 rounded px-1 py-0.5 font-mono text-xs">{children}</code>
    ),
    pre: ({ children }) => (
        <pre className="bg-black/10 dark:bg-white/10 rounded-lg px-3 py-2 font-mono text-xs my-1.5 overflow-x-auto whitespace-pre">{children}</pre>
    ),
    a: ({ href, children }) => (
        <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-80">{children}</a>
    ),
    hr: () => <hr className="border-slate-200 dark:border-slate-600 my-2" />,
    blockquote: ({ children }) => <blockquote className="border-l-2 border-blue-400 pl-2 my-1 opacity-80">{children}</blockquote>,
};

export default function AIChat() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    const { messages, sendMessage, status, setMessages } = useChat({
        transport: new DefaultChatTransport({ api: "/api/ai-chat" }),
        messages: [WELCOME_MESSAGE],
    });

    const [input, setInput] = useState("");
    const isLoading = status === "streaming" || status === "submitted";

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value);
    
    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;
        sendMessage({ text: input });
        setInput("");
    };

    const [isListening, setIsListening] = useState(false);
    const [hasNotification, setHasNotification] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const recognitionRef = useRef<any>(null);
    const isHomepage = pathname === "/";

    useEffect(() => {
        if (!isHomepage) return;
        const hasSeenWelcome = localStorage.getItem(AUTO_OPEN_KEY);
        if (!hasSeenWelcome) {
            const timer = setTimeout(() => {
                setIsOpen(true);
                localStorage.setItem(AUTO_OPEN_KEY, "1");
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isHomepage]);

    useEffect(() => {
        if (!isOpen && messages.length <= 1) {
            const timer = setTimeout(() => setHasNotification(true), 5000);
            return () => clearTimeout(timer);
        }
        setHasNotification(false);
    }, [isOpen, messages.length]);

    useEffect(() => {
        if (isOpen && !isMinimized) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen, isMinimized]);

    useEffect(() => {
        if (isOpen && !isMinimized) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, isMinimized]);

    const handleOpen = () => {
        setIsOpen(true);
        setIsMinimized(false);
        setHasNotification(false);
        localStorage.setItem(AUTO_OPEN_KEY, "1");
    };

    const handleClose = () => {
        setIsOpen(false);
        setIsMinimized(false);
    };

    const handleReset = () => {
        setMessages([WELCOME_MESSAGE]);
    };

    const startListening = useCallback(() => {
        if (isListening) return;

        if (!recognitionRef.current) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (!SpeechRecognition) {
                alert("Browser Anda tidak mendukung fitur input suara.");
                return;
            }

            const recognition = new SpeechRecognition();
            recognition.lang = "id-ID";
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onstart = () => setIsListening(true);
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
            };
            recognition.onerror = () => setIsListening(false);
            recognition.onend = () => setIsListening(false);

            recognitionRef.current = recognition;
        }

        try {
            recognitionRef.current.start();
        } catch (e) {
        }
    }, [isListening, setInput]);

    const handleChipClick = (chip: string) => {
        setInput(chip);
        setTimeout(() => {
            const event = { preventDefault: () => { } } as any;
            handleSubmit(event);
        }, 50);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as any);
        }
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={handleOpen}
                    aria-label="Buka AI Chat dengan Bang Tutor"
                    className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center transition-all duration-300 group"
                >
                    <MessageCircle className="w-5 h-5" />
                    {hasNotification && (
                        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                    )}
                    {/* Tooltip */}
                    <span className="absolute bottom-12 right-0 bg-slate-900 dark:bg-slate-700 text-white text-xs font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                        Bang Tutor AI 🤖
                    </span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div
                    className={`fixed right-4 md:right-6 z-50 flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 ${isMinimized
                        ? "bottom-6 w-64 h-14"
                        : "bottom-6 w-[calc(100vw-2rem)] md:w-[400px] h-[560px] max-h-[80vh]"
                        }`}
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex-shrink-0">
                        <div className="relative">
                            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                                <Bot className="w-5 h-5" />
                            </div>
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm leading-tight">Bang Tutor AI</p>
                            <p className="text-blue-100 text-xs">Asisten TutorinBang • Online</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleReset}
                                aria-label="Reset chat"
                                title="Mulai percakapan baru"
                                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setIsMinimized((p) => !p)}
                                aria-label={isMinimized ? "Perbesar" : "Perkecil"}
                                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <Minimize2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={handleClose}
                                aria-label="Tutup chat"
                                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                                {messages.map((msg: UIMessage) => {
                                    const textContent = msg.parts 
                                        ? msg.parts
                                            .filter((part) => part.type === 'text')
                                            .map((part) => 'text' in part ? part.text : "")
                                            .join("")
                                        : "";
                                    
                                    const reasoningContent = msg.parts
                                        ? msg.parts
                                            .filter((part) => part.type === 'reasoning')
                                            .map((part) => 'text' in part ? part.text : "")
                                            .join("")
                                        : "";

                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}
                                        >
                                            <div
                                                className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                                            >
                                                {/* Avatar */}
                                                <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold ${msg.role === "assistant"
                                                    ? "bg-gradient-to-br from-blue-600 to-indigo-600"
                                                    : "bg-slate-500 dark:bg-slate-600"
                                                    }`}>
                                                {msg.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                            </div>

                                            {/* Bubble */}
                                            <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${msg.role === "assistant"
                                                ? "bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm"
                                                : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm"
                                                }`}>
                                                {reasoningContent && (
                                                    <div className="mb-2 p-2 bg-blue-50/50 dark:bg-blue-900/20 border-l-2 border-blue-400 rounded text-xs text-slate-500 dark:text-slate-400 italic">
                                                        <p className="font-semibold not-italic mb-1 text-[10px] uppercase tracking-wider opacity-70">Berpikir...</p>
                                                        {reasoningContent}
                                                    </div>
                                                )}
                                                {msg.role === "user" ? (
                                                    <p className="whitespace-pre-wrap">{textContent}</p>
                                                ) : (
                                                    <ReactMarkdown
                                                        remarkPlugins={MARKDOWN_PLUGINS}
                                                        components={MARKDOWN_COMPONENTS}
                                                    >
                                                        {textContent || (isLoading && msg.id === messages[messages.length-1].id ? "..." : "")}
                                                    </ReactMarkdown>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Loading indicator */}
                                {isLoading && (
                                    <div className="flex gap-2.5">
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex-shrink-0 flex items-center justify-center">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                            <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                                            <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Quick suggestion chips */}
                            {messages.length <= 1 && (
                                <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                                    {CHIP_SUGGESTIONS.map((chip) => (
                                        <button
                                            key={chip}
                                            onClick={() => handleChipClick(chip)}
                                            className="px-3 py-1 text-xs bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-slate-700 rounded-full hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors font-medium"
                                        >
                                            {chip}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Input area */}
                            <form onSubmit={handleSubmit} className="px-3 py-3 border-t border-slate-100 dark:border-slate-800 flex gap-2 items-end bg-white dark:bg-slate-900 flex-shrink-0 w-full">
                                <button
                                    type="button"
                                    onClick={startListening}
                                    disabled={isLoading}
                                    aria-label="Input Suara"
                                    className={`p-2 rounded-xl border flex items-center justify-center transition-all h-10 w-10 flex-shrink-0 ${isListening ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    <Mic className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`} />
                                </button>
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ketik pertanyaanmu..."
                                    rows={1}
                                    disabled={isLoading}
                                    className="flex-1 resize-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all max-h-28 overflow-y-auto"
                                    style={{ scrollbarWidth: "none" }}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    aria-label="Kirim pesan"
                                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
