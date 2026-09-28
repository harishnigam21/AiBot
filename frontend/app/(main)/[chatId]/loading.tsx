export default function Loading() {
  return <ChatSkeleton />;
}

export function ChatSkeleton() {
  return (
    <div className="w-full lg:w-3/4 px-4 sm:px-6 md:px-8 lg:px-10 h-full overflow-hidden">
      <div className="mx-auto w-full max-w-300 space-y-8">
        {/* User message */}
        <div className="flex justify-end">
          <div className="w-[70%] max-w-[320px] space-y-2 rounded-3xl bg-white/10 p-4">
            <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-44 animate-pulse rounded bg-white/10" />
          </div>
        </div>

        {/* Assistant greeting */}
        <div className="flex items-start">
          <div className="h-4 w-[55%] max-w-125 animate-pulse rounded bg-white/10" />
        </div>

        {/* User message */}
        <div className="flex justify-end">
          <div className="w-[75%] max-w-85 space-y-2 rounded-3xl bg-white/10 p-4">
            <div className="h-4 w-full animate-pulse rounded bg-white/10" />
            <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
          </div>
        </div>

        {/* Images */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[1.45/1] animate-pulse rounded-lg bg-white/10"
            />
          ))}
        </div>

        {/* Response text */}
        <div className="space-y-3">
          <div className="h-4 w-[90%] animate-pulse rounded bg-white/10" />
          <div className="h-4 w-[75%] animate-pulse rounded bg-white/10" />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-white/10">
          {/* Table header */}
          <div className="grid grid-cols-3 gap-4 bg-white/10 px-4 py-4">
            <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
          </div>

          {/* Table rows */}
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-4 border-t border-white/10 px-4 py-5"
            >
              <div className="h-4 w-20 animate-pulse rounded bg-white/10" />

              <div className="space-y-2">
                <div className="h-4 w-[90%] animate-pulse rounded bg-white/10" />
                <div className="h-4 w-[65%] animate-pulse rounded bg-white/10" />
              </div>

              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-white/10" />
                <div className="h-4 w-[90%] animate-pulse rounded bg-white/10" />
                <div className="h-4 w-[70%] animate-pulse rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
