type JsonLdValue = string | number | boolean | null | JsonLdValue[] | { [key: string]: JsonLdValue | undefined };

export default function JsonLd({ data }: { data: Record<string, JsonLdValue | undefined> }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
