"use client";

import Image from "next/image";
import { getStrapiMediaUrl, type StrapiBlockNode, type StrapiTextNode, type StrapiLinkNode } from "@/lib/api";

// Renders inline text with formatting modifiers
function InlineText({ node }: { node: StrapiTextNode | StrapiLinkNode }) {
    if (node.type === "link") {
        return (
            <a href={node.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                {node.children.map((child, i) => (
                    <InlineText key={i} node={child} />
                ))}
            </a>
        );
    }

    let content: React.ReactNode = node.text;
    if (node.bold) content = <strong>{content}</strong>;
    if (node.italic) content = <em>{content}</em>;
    if (node.underline) content = <u>{content}</u>;
    if (node.strikethrough) content = <s>{content}</s>;
    if (node.code) content = <code className="bg-slate-100 text-rose-600 px-1.5 py-0.5 rounded font-mono text-[0.875em]">{content}</code>;

    return <>{content}</>;
}

// Renders a single block node
function Block({ node }: { node: StrapiBlockNode }) {
    switch (node.type) {
        case "paragraph": {
            const isEmpty = node.children.length === 1 && node.children[0].type === "text" && node.children[0].text === "";
            if (isEmpty) return <div className="h-3" />;
            return (
                <p>
                    {node.children.map((child, i) => (
                        <InlineText key={i} node={child as StrapiTextNode | StrapiLinkNode} />
                    ))}
                </p>
            );
        }

        case "heading": {
            const Tag = `h${node.level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
            const idText = node.children.map(c => c.text).join("").toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return (
                <Tag id={idText}>
                    {node.children.map((child, i) => (
                        <InlineText key={i} node={child} />
                    ))}
                </Tag>
            );
        }

        case "list": {
            const ListTag = node.format === "ordered" ? "ol" : "ul";
            return (
                <ListTag>
                    {node.children.map((item, i) => (
                        <li key={i}>
                            {item.children.map((child, j) => (
                                <InlineText key={j} node={child as StrapiTextNode | StrapiLinkNode} />
                            ))}
                        </li>
                    ))}
                </ListTag>
            );
        }

        case "quote":
            return (
                <blockquote>
                    {node.children.map((child, i) => (
                        <InlineText key={i} node={child} />
                    ))}
                </blockquote>
            );

        case "code":
            return (
                <pre className="overflow-x-auto">
                    <code>
                        {node.children.map((child, i) => (
                            <InlineText key={i} node={child} />
                        ))}
                    </code>
                </pre>
            );

        case "image": {
            const imgUrl = getStrapiMediaUrl(node.image?.url);
            const altText = node.image?.alternativeText || "";
            return (
                <figure className="my-4 md:my-8">
                    <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: `${node.image?.width || 16} / ${node.image?.height || 9}` }}>
                        <Image
                            src={imgUrl}
                            alt={altText}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 700px"
                        />
                    </div>
                    {altText && (
                        <figcaption className="text-center text-sm text-slate-500 mt-2">{altText}</figcaption>
                    )}
                </figure>
            );
        }

        default:
            return null;
    }
}

type Props = {
    content: StrapiBlockNode[];
};

export default function StrapiBlocksRenderer({ content }: Props) {
    if (!content || !Array.isArray(content)) return null;

    return (
        <>
            {content.map((block, i) => (
                <Block key={i} node={block} />
            ))}
        </>
    );
}
