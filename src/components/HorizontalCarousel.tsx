import React, { useRef, useState, useEffect } from "react";
import ScrollControls from "./ScrollControls";

export default function HorizontalCarousel({
  items,
  children,
}: {
  items: number;
  children: (idx: number) => React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scroll = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    const offset = Math.max(el.clientWidth * 0.9, 180);
    el.scrollBy({ left: dir * offset, behavior: "smooth" });
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };
    check();
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [items]);

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

      <ScrollControls
        onPrev={() => scroll(-1)}
        onNext={() => scroll(1)}
        leftClass={`absolute top-1/2 left-2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow ${hover ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        rightClass={`absolute top-1/2 right-2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow ${hover ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        leftDisabled={!canScrollLeft}
        rightDisabled={!canScrollRight}
        leftVisible={hover}
        rightVisible={hover}
      />
    </div>
  );
}
