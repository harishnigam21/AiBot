import type { Chat, Message } from "../redux/slices/Chat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
export default function Message({
  msg,
  selectedChat,
}: {
  msg: Message;
  selectedChat: Chat;
}) {
  const [images, setImages] = useState<string[] | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [imageError, setImageError] = useState(false);
  useEffect(() => {
    if (msg.images && msg.images.length > 0) {
      setImages(msg.images);
    }
  }, [msg]);
  return (
    <div
      className={`p-2 max-w-full ${msg.role == "ai" ? "self-start rounded-tl-none rounded-xl" : "self-end rounded-full px-4 bg-pri text-txpri"}`}
    >
      {images && (
        <div className="flex flex-wrap gap-3 my-5">
          {images.map((item, i) => (
            <img
              src={item}
              key={`chat/${selectedChat._id}/image/${i}`}
              className="rounded-md size-30 cursor-pointer object-cover object-center"
              alt={`image/${i}`}
              onClick={() => {
                setImageError(false);
                setSelectedImage(i + 1);
              }}
            />
          ))}
        </div>
      )}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-txpri mt-6 mb-4 pb-2 border-b border-slate-800">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-txpri mt-5 mb-3 pb-1 border-b border-slate-800/60">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-txpri mt-4 mb-2">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-semibold text-txpri mt-3 mb-1">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-sm sm:text-base leading-relaxed text-txpri last:mb-0">
              {children}
            </p>
          ),
          hr: () => <hr className="border-borderhl my-4" />,
          strong: ({ children }) => (
            <strong className="font-semibold text-txpri">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-txpri">{children}</em>
          ),
          del: ({ children }) => (
            <del className="line-through text-txpri">{children}</del>
          ),
          ul: ({ children }) => (
            <ul className="my-3 ml-4 list-disc space-y-1.5 text-txpri text-sm sm:text-base">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3 ml-4 list-decimal space-y-1.5 text-txpri text-sm sm:text-base">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="pl-1 leading-relaxed">{children}</li>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 font-medium underline underline-offset-4 hover:text-blue-300 transition-colors"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="my-4 max-h-96 w-full object-cover rounded-xl border border-slate-800 shadow-md"
            />
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/50">
              <table className="w-full text-left text-sm text-txpri">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-800/80 text-xs uppercase text-txpri font-semibold border-b border-slate-700">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-800/60">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-slate-800/30 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 font-semibold">{children}</th>
          ),
          td: ({ children }) => <td className="px-4 py-3">{children}</td>,
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <div className="max-w-fit my-3 text-xs p-2 sm:p-4 sm:text-sm overflow-hidden rounded-lg border border-slate-800 bg-bgsec shadow-md">
                <SyntaxHighlighter
                  style={vscDarkPlus as any}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    padding: 0,
                    background: "transparent",
                    fontSize: "inherit",
                    maxWidth: "100%",
                  }}
                  codeTagProps={{
                    style: {
                      overflowWrap: "anywhere",
                    },
                  }}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code
                className={`rounded-md bg-slate-800/80 px-1.5 py-0.5 font-mono text-xs sm:text-sm font-medium text-blue-400 border border-slate-700/50 wrap-break-word whitespace-pre-wrap ${
                  className || ""
                }`}
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {msg.content}
      </ReactMarkdown>
      {images && selectedImage && (
        <div className="fixed top-0 left-0 w-full h-full bg-transparent backdrop-blur-xl p-4 overflow-hidden flex items-center justify-center z-100">
          <X
            className="fixed top-4 right-4 text-red-500 z-10 cursor-pointer"
            onClick={() => setSelectedImage(null)}
            size={30}
          />
          {imageError ? (
            <p className="font-medium tracking-wider text-red-500">Image is not avaialble !</p>
          ) : (
            <img
              src={images[selectedImage - 1]}
              alt="image"
              className="object-cover object-center cursor-pointer"
              onError={() => setImageError(true)}
            />
          )}
        </div>
      )}
    </div>
  );
}
