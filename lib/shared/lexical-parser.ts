/**
 * Lexical JSON Parser (Server-side utilities)
 * Converts Lexical editor JSON state to plain text or HTML
 * Handles both standard Lexical format and custom section-based format
 */

interface LexicalNode {
   type: string;
   version: number;
   children?: LexicalNode[];
   text?: string;
   format?: number;
   style?: string;
   tag?: string;
   [key: string]: any;
}

interface LexicalState {
   root: {
      children: LexicalNode[];
      direction: string;
      format: string;
      indent: number;
      type: string;
      version: number;
   };
}

/**
 * Parse Lexical JSON and convert to HTML
 */
export function lexicalToHtml(lexicalJson: string | object | null): string {
   if (!lexicalJson) return "";

   try {
      let parsed: any;

      if (typeof lexicalJson === "string") {
         parsed = JSON.parse(lexicalJson);
      } else {
         parsed = lexicalJson;
      }

      // Handle array of sections (custom format)
      if (Array.isArray(parsed)) {
         return parsed
            .map((section) => {
               if (section.body && section.body.root) {
                  return nodesToHtml(section.body.root.children || []);
               }
               return "";
            })
            .join("");
      }

      // Handle standard Lexical format
      const state: LexicalState = parsed;
      if (!state.root || !state.root.children) {
         return "";
      }

      return nodesToHtml(state.root.children);
   } catch (error) {
      console.error("Error parsing Lexical JSON:", error);
      return "";
   }
}

/**
 * Convert Lexical nodes to HTML
 */
function nodesToHtml(nodes: LexicalNode[]): string {
   return nodes.map((node) => nodeToHtml(node)).join("");
}

/**
 * Convert a single Lexical node to HTML
 */
function nodeToHtml(node: LexicalNode): string {
   switch (node.type) {
      case "root":
         return nodesToHtml(node.children || []);

      case "paragraph":
         return `<p>${nodesToHtml(node.children || [])}</p>`;

      case "heading":
         let headingTag = "h1";
         if (node.tag) {
            headingTag = node.tag;
         } else if (node.level) {
            headingTag = `h${node.level}`;
         }
         return `<${headingTag}>${nodesToHtml(node.children || [])}</${headingTag}>`;

      case "h1":
         return `<h1>${nodesToHtml(node.children || [])}</h1>`;

      case "h2":
         return `<h2>${nodesToHtml(node.children || [])}</h2>`;

      case "h3":
         return `<h3>${nodesToHtml(node.children || [])}</h3>`;

      case "h4":
         return `<h4>${nodesToHtml(node.children || [])}</h4>`;

      case "h5":
         return `<h5>${nodesToHtml(node.children || [])}</h5>`;

      case "h6":
         return `<h6>${nodesToHtml(node.children || [])}</h6>`;

      case "list":
         const listTag = node.listType === "number" ? "ol" : "ul";
         return `<${listTag}>${nodesToHtml(node.children || [])}</${listTag}>`;

      case "listitem":
         return `<li>${nodesToHtml(node.children || [])}</li>`;

      case "quote":
         return `<blockquote>${nodesToHtml(node.children || [])}</blockquote>`;

      case "code":
         return `<pre><code>${escapeHtml(nodesToHtml(node.children || []))}</code></pre>`;

      case "codeblock":
         return `<pre><code class="language-${node.language || "text"}">${escapeHtml(
            nodesToHtml(node.children || [])
         )}</code></pre>`;

      case "text":
         let text = node.text || "";
         text = escapeHtml(text);

         if (node.format) {
            if (node.format & 1) text = `<strong>${text}</strong>`;
            if (node.format & 2) text = `<em>${text}</em>`;
            if (node.format & 4) text = `<u>${text}</u>`;
            if (node.format & 8) text = `<s>${text}</s>`;
            if (node.format & 16) text = `<code>${text}</code>`;
         }

         return text;

      case "link":
         return `<a href="${escapeHtml(node.url || "#")}">${nodesToHtml(
            node.children || []
         )}</a>`;

      case "image":
         return `<img src="${escapeHtml(node.src || "")}" alt="${escapeHtml(
            node.altText || ""
         )}" />`;

      case "horizontalrule":
         return "<hr />";

      case "table":
         return `<table>${nodesToHtml(node.children || [])}</table>`;

      case "tablerow":
         return `<tr>${nodesToHtml(node.children || [])}</tr>`;

      case "tablecell":
         const cellTag = node.headerCell ? "th" : "td";
         return `<${cellTag}>${nodesToHtml(node.children || [])}</${cellTag}>`;

      default:
         if (node.children) {
            return nodesToHtml(node.children);
         }
         return "";
   }
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
   const map: { [key: string]: string } = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
   };
   return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Parse Lexical JSON and extract plain text
 */
export function lexicalToPlainText(lexicalJson: string | object | null): string {
   if (!lexicalJson) return "";

   try {
      let parsed: any;

      if (typeof lexicalJson === "string") {
         parsed = JSON.parse(lexicalJson);
      } else {
         parsed = lexicalJson;
      }

      if (Array.isArray(parsed)) {
         return parsed
            .map((section) => {
               if (section.body && section.body.root) {
                  return extractText(section.body.root.children || []);
               }
               return "";
            })
            .join(" ");
      }

      const state: LexicalState = parsed;
      if (!state.root || !state.root.children) {
         return "";
      }

      return extractText(state.root.children);
   } catch (error) {
      console.error("Error parsing Lexical JSON:", error);
      return "";
   }
}

/**
 * Extract plain text from Lexical nodes
 */
function extractText(nodes: LexicalNode[]): string {
   return nodes
      .map((node) => {
         if (node.type === "text") {
            return node.text || "";
         }
         if (node.children) {
            return extractText(node.children);
         }
         return "";
      })
      .join("");
}

/**
 * Get first N characters of Lexical content as plain text
 */
export function lexicalToPreview(
   lexicalJson: string | object | null,
   maxLength: number = 150
): string {
   const text = lexicalToPlainText(lexicalJson);
   if (text.length <= maxLength) return text;
   return text.substring(0, maxLength).trim() + "...";
}

/**
 * Debug function to inspect Lexical JSON structure
 */
export function debugLexicalStructure(lexicalJson: string | object | null): void {
   if (!lexicalJson) return;

   try {
      let parsed: any;

      if (typeof lexicalJson === "string") {
         parsed = JSON.parse(lexicalJson);
      } else {
         parsed = lexicalJson;
      }

      const nodeTypes = new Set<string>();
      const nodeDetails: any[] = [];

      function collectNodeTypes(nodes: LexicalNode[]) {
         nodes.forEach((node) => {
            nodeTypes.add(node.type);
            nodeDetails.push({
               type: node.type,
               tag: node.tag,
               level: node.level,
               hasChildren: !!node.children,
               childrenCount: node.children?.length || 0,
            });
            if (node.children) {
               collectNodeTypes(node.children);
            }
         });
      }

      if (Array.isArray(parsed)) {
         parsed.forEach((section, idx) => {
            if (section.body && section.body.root) {
               console.log(`[Section ${idx}] Node types:`, nodeTypes);
               collectNodeTypes(section.body.root.children || []);
            }
         });
      } else if (parsed.root && parsed.root.children) {
         collectNodeTypes(parsed.root.children);
      }

      console.log("All node types found:", Array.from(nodeTypes));
      console.log("Node details:", nodeDetails);
   } catch (error) {
      console.error("Error debugging Lexical structure:", error);
   }
}
