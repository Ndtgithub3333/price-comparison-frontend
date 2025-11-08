import {
  Home,
  Monitor,
  Gamepad,
  Smartphone,
  Camera,
  Cpu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useRef, useState, useEffect } from "react";

const CategoryIconsRow = () => {
  const categories: [string, React.ReactNode][] = [
    ["Home", <Home key="home" className="h-5 w-5" />],
    ["Computers", <Monitor key="monitor" className="h-5 w-5" />],
    ["Gaming", <Gamepad key="gamepad" className="h-5 w-5" />],
    ["Phones", <Smartphone key="phone" className="h-5 w-5" />],
    ["Components", <Cpu key="cpu" className="h-5 w-5" />],
    ["Photography", <Camera key="camera" className="h-5 w-5" />],
    ["Phones", <Smartphone key="phone" className="h-5 w-5" />],
    ["Components", <Cpu key="cpu" className="h-5 w-5" />],
    ["Photography", <Camera key="camera" className="h-5 w-5" />],
    ["Phones", <Smartphone key="phone" className="h-5 w-5" />],
    ["Components", <Cpu key="cpu" className="h-5 w-5" />],
    ["Photography", <Camera key="camera" className="h-5 w-5" />],
  ];

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const desktopRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeftDesktop, setCanScrollLeftDesktop] = useState(false);
  const [canScrollRightDesktop, setCanScrollRightDesktop] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };
    check();
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      el.removeEventListener("scroll", check as any);
      window.removeEventListener("resize", check);
    };
  }, []);

  useEffect(() => {
    const el = desktopRef.current;
    if (!el) return;
    const check = () => {
      setCanScrollLeftDesktop(el.scrollLeft > 0);
      setCanScrollRightDesktop(
        el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
      );
    };
    check();
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      el.removeEventListener("scroll", check as any);
      window.removeEventListener("resize", check);
    };
  }, []);

  function scrollByDistance(delta: number) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  }

  const handlePrev = () => {
    const el = scrollRef.current;
    if (!el) return;
    scrollByDistance(-Math.max(el.clientWidth * 0.7, 160));
  };

  const handleNext = () => {
    const el = scrollRef.current;
    if (!el) return;
    scrollByDistance(Math.max(el.clientWidth * 0.7, 160));
  };

  return (
    <div className="relative z-20 mt-6">
      <div className="mx-auto w-full max-w-7xl px-4">
        {/* Mobile: horizontal scrollable pills with nav buttons inside a rounded container */}
        <div className="lg:hidden">
          <div className="group relative rounded-xl bg-white p-3 shadow-sm">
            <div
              className="flex gap-3 overflow-x-auto px-1 py-2"
              ref={scrollRef}
              role="list"
            >
              {categories.map(([name, icon], idx) => (
                <button
                  key={idx}
                  className="flex flex-shrink-0 items-center gap-2 rounded-md border border-gray-100 bg-white px-3 py-2 text-sm text-slate-800 hover:bg-gray-100"
                  role="listitem"
                >
                  <span className="text-lg text-slate-800">{icon}</span>
                  <span className="text-slate-800">{name}</span>
                </button>
              ))}
            </div>

            {/* left/right buttons */}
            <button
              aria-label="Previous categories"
              onClick={handlePrev}
              className={`absolute top-1/2 left-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow transition-opacity duration-200 group-hover:opacity-100 hover:bg-white ${canScrollLeft ? "" : "opacity-40"}`}
            >
              <ChevronLeft className="h-5 w-5 text-slate-700" />
            </button>

            <button
              aria-label="Next categories"
              onClick={handleNext}
              className={`absolute top-1/2 right-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow transition-opacity duration-200 group-hover:opacity-100 hover:bg-white ${canScrollRight ? "" : "opacity-40"}`}
            >
              <ChevronRight className="h-5 w-5 text-slate-700" />
            </button>
          </div>
        </div>

        {/* Desktop: scrollable centered container with nav */}
        <div className="hidden lg:block">
          <div className="group relative rounded-xl bg-white p-3 shadow-sm">
            <div
              className="flex items-center gap-4 overflow-x-auto px-2"
              ref={desktopRef}
            >
              {categories.map(([name, icon], idx) => (
                <button
                  key={idx}
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-100 bg-white px-3 py-2 text-sm text-slate-800 hover:bg-gray-100"
                >
                  <span className="text-lg text-slate-800">{icon}</span>
                  <span className="text-slate-800">{name}</span>
                </button>
              ))}
            </div>

            <button
              aria-label="Previous categories"
              onClick={() => {
                const el = desktopRef.current;
                if (!el) return;
                el.scrollBy({
                  left: -Math.max(el.clientWidth * 0.7, 240),
                  behavior: "smooth",
                });
              }}
              className={`absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow transition-opacity duration-200 hover:bg-white lg:flex lg:opacity-0 lg:group-hover:opacity-100 ${canScrollLeftDesktop ? "" : "opacity-40"}`}
            >
              <ChevronLeft className="h-5 w-5 text-slate-700" />
            </button>

            <button
              aria-label="Next categories"
              onClick={() => {
                const el = desktopRef.current;
                if (!el) return;
                el.scrollBy({
                  left: Math.max(el.clientWidth * 0.7, 240),
                  behavior: "smooth",
                });
              }}
              className={`absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow transition-opacity duration-200 hover:bg-white lg:flex lg:opacity-0 lg:group-hover:opacity-100 ${canScrollRightDesktop ? "" : "opacity-40"}`}
            >
              <ChevronRight className="h-5 w-5 text-slate-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryIconsRow;
