import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/lib/image";
import type { PortableTextBlock } from "@portabletext/react";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const url = urlFor(value).width(1200).fit("max").url();
      return (
        <Image
          src={url}
          alt={value.alt || ""}
          width={1200}
          height={800}
          className="my-6 rounded-2xl"
          sizes="(min-width: 1024px) 720px, 100vw"
        />
      );
    },
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={value?.href}
        rel="noopener noreferrer"
        className="text-brand-600 underline hover:text-brand-800"
      >
        {children}
      </a>
    ),
  },
};

export function QAArticle({ blocks }: { blocks: PortableTextBlock[] }) {
  return (
    <article className="prose prose-slate mt-10 max-w-none">
      <PortableText value={blocks} components={components} />
    </article>
  );
}
