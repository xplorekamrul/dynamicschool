"use client";


/**
 * LexicalContent Component
 * Renders Lexical HTML with proper styling for headings and text
 */

interface LexicalContentProps {
   html: string;
   subtitle?: string | null;
   className?: string;
}

export function LexicalContent({ html, subtitle, className }: LexicalContentProps) {
   const classNameString =
      "text-base sm:text-lg text-gray-700 leading-relaxed md:leading-8 max-w-none " +
      "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-green-700 [&_h1]:mt-6 [&_h1]:mb-4 " +
      "[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-green-600 [&_h2]:mt-5 [&_h2]:mb-3 " +
      "[&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-green-500 [&_h3]:mt-4 [&_h3]:mb-2 " +
      "[&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-gray-800 [&_h4]:mt-3 [&_h4]:mb-2 " +
      "[&_h5]:text-base [&_h5]:font-bold [&_h5]:text-gray-700 [&_h5]:mt-2 [&_h5]:mb-1 " +
      "[&_h6]:text-sm [&_h6]:font-bold [&_h6]:text-gray-600 [&_h6]:mt-2 [&_h6]:mb-1 " +
      "[&_p]:mb-4 [&_p]:text-justify " +
      "[&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 " +
      "[&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 " +
      "[&_li]:mb-2 " +
      "[&_blockquote]:border-l-4 [&_blockquote]:border-green-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 " +
      "[&_code]:bg-gray-100 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-red-600 " +
      "[&_pre]:bg-gray-900 [&_pre]:text-white [&_pre]:p-4 [&_pre]:rounded [&_pre]:overflow-x-auto [&_pre]:mb-4 " +
      "[&_strong]:font-bold [&_strong]:text-gray-900 " +
      "[&_em]:italic [&_em]:text-gray-800 " +
      "[&_a]:text-green-600 [&_a]:underline [&_a]:hover:text-green-700 " +
      "[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded [&_img]:my-4 " +
      "[&_table]:w-full [&_table]:border-collapse [&_table]:my-4 " +
      "[&_th]:bg-green-100 [&_th]:border [&_th]:border-gray-300 [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:font-bold " +
      "[&_td]:border [&_td]:border-gray-300 [&_td]:px-4 [&_td]:py-2 " +
      "[&_hr]:my-6 [&_hr]:border-gray-300";

   return (
      <div className={`w-full max-w-3xl ${className || ''}`}>
         {subtitle && (
            <p className="text-base sm:text-lg text-gray-600 mb-4 md:mb-6 font-semibold text-center">
               {subtitle}
            </p>
         )}

         {html && (
            <div
               className={classNameString}
               dangerouslySetInnerHTML={{ __html: html }}
            />
         )}
      </div>
   );
}
