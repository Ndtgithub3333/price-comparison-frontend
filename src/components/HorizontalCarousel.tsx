import React, { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

export default function HorizontalCarousel({
  items,
  children,
}: {
  items: number;
  children: (idx: number) => React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState(false);

  const scroll = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    const offset = Math.max(el.clientWidth * 0.9, 180);
    el.scrollBy({ left: dir * offset, behavior: "smooth" });
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        ref={ref}
        tabIndex={0}
        className="hide-scrollbar flex gap-3 pr-2 pb-4 pl-2"
        style={{ overflowX: "auto" }}
      >
        {Array.from({ length: items }).map((_, i) => children(i))}
      </div>

      <button
        aria-label="prev"
        onClick={() => scroll(-1)}
        className={`absolute top-1/2 left-2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow ${hover ? "opacity-100" : "opacity-0"}`}
      >
        <ArrowRight className="h-4 w-4 rotate-180 text-slate-700" />
      </button>

      <button
        aria-label="next"
        onClick={() => scroll(1)}
        className={`absolute top-1/2 right-2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow ${hover ? "opacity-100" : "opacity-0"}`}
      >
        <ArrowRight className="h-4 w-4 text-slate-700" />
      </button>
    </div>
  );
}
