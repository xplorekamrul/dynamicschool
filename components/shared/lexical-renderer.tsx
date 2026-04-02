/**
 * Renders Lexical JSON format to HTML
 * Handles basic text, paragraphs, and formatting
 */

interface LexicalNode {
   type?: string;
   tag?: number;
   key?: string;
   text?: string;
   format?: number;
   listType?: string;
   root?: {
      children: LexicalNode[];
   };
   children?: LexicalNode[];
}

export function LexicalRenderer({ content }: { content: string | null }) {
   if (!content) {
      return null;
   }

   try {
      const parsed = JSON.parse(content);
      return renderLexicalNode(parsed);
   } catch {
      // If JSON parsing fails, treat it as plain text
      return <div className="text-gray-700 whitespace-pre-wrap break-words">{content}</div>;
   }
}

function renderLexicalNode(node: LexicalNode, key?: number): React.ReactNode {
   if (!node) return null;

   // Handle root node with children
   if (node.root && node.root.children) {
      return (
         <div className="space-y-4 text-lg leading-relaxed">
            {node.root.children.map((child: LexicalNode, idx: number) =>
               renderLexicalNode(child, idx)
            )}
         </div>
      );
   }

   // Handle paragraph nodes
   if (node.type === "paragraph") {
      return (
         <p key={node.key || key} className="space-y-4 text-lg leading-relaxed">
            {node.children?.map((child: LexicalNode, idx: number) =>
               renderLexicalNode(child, idx)
            )}
         </p>
      );
   }

   // Handle text nodes with formatting
   if (node.type === "text") {
      let element: React.ReactNode = node.text;

      if (node.format) {
         if (node.format & 1) element = <strong>{element}</strong>; // Bold
         if (node.format & 2) element = <em>{element}</em>; // Italic
         if (node.format & 4) element = <u>{element}</u>; // Underline
         if (node.format & 8) element = <s>{element}</s>; // Strikethrough
      }

      return <span key={node.key || key}>{element}</span>;
   }

   // Handle heading nodes
   if (node.type === "heading") {
      let level: number = node.tag || 2;
      // If level is already a string like "h2", extract the number
      if (typeof level === "string") {
         level = parseInt((level as string).replace(/\D/g, "")) || 2;
      }
      // Ensure level is between 1-6
      level = Math.max(1, Math.min(6, level));
      const HeadingTag = `h${level}` as React.ElementType;
      return (
         <HeadingTag key={node.key || key} className="font-semibold mt-4 mb-2">
            {node.children?.map((child: LexicalNode, idx: number) =>
               renderLexicalNode(child, idx)
            )}
         </HeadingTag>
      );
   }

   // Handle list nodes
   if (node.type === "list") {
      const ListTag = node.listType === "number" ? "ol" : "ul";
      return (
         <ListTag key={node.key || key} className="list-inside space-y-2 ml-4">
            {node.children?.map((child: LexicalNode, idx: number) =>
               renderLexicalNode(child, idx)
            )}
         </ListTag>
      );
   }

   // Handle list item nodes
   if (node.type === "listitem") {
      return (
         <li key={node.key || key}>
            {node.children?.map((child: LexicalNode, idx: number) =>
               renderLexicalNode(child, idx)
            )}
         </li>
      );
   }

   // Handle line break
   if (node.type === "linebreak") {
      return <br key={node.key || key} />;
   }

   // Fallback for unknown types
   return null;
}
