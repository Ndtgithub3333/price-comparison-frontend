import {
  Home,
  Monitor,
  Gamepad,
  Smartphone,
  Camera,
  Cpu,
  Laptop,
  Tablet,
  Headphones,
  Watch,
} from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import ScrollControls from "./ScrollControls";

const CategoryIconsRow = () => {
  const categories: [string, React.ReactNode][] = [
    ["Home", <Home key="home" className="h-5 w-5" />],
    ["Phones", <Smartphone key="phone" className="h-5 w-5" />],
    ["Laptops", <Laptop key="laptop" className="h-5 w-5" />],
    ["Tablets", <Tablet key="tablet" className="h-5 w-5" />],
    ["Headphones", <Headphones key="headphones" className="h-5 w-5" />],
    ["Watches", <Watch key="watch" className="h-5 w-5" />],
    ["Accessories", <Cpu key="cpu" className="h-5 w-5" />],
    ["Photography", <Camera key="camera" className="h-5 w-5" />],
    ["Gaming", <Gamepad key="gamepad" className="h-5 w-5" />],
    ["Monitors", <Monitor key="monitor" className="h-5 w-5" />],
  ];

  // mobile scroll container (no nav buttons)
  const desktopRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeftDesktop, setCanScrollLeftDesktop] = useState(false);
  const [canScrollRightDesktop, setCanScrollRightDesktop] = useState(false);
  const [hoverDesktop, setHoverDesktop] = useState(false);

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
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  // mobile: swipe only, no nav handlers

  // reusable scroll helpers for any ref
  function scrollRefBy(
    ref: React.RefObject<HTMLDivElement | null>,
    delta: number,
  ) {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  }

  const handlePrevDesktop = () =>
    scrollRefBy(
      desktopRef,
      -Math.max((desktopRef.current?.clientWidth ?? 0) * 0.7, 240),
    );
  const handleNextDesktop = () =>
    scrollRefBy(
      desktopRef,
      Math.max((desktopRef.current?.clientWidth ?? 0) * 0.7, 240),
    );

  return (
    <div className="relative z-20 mt-6">
      <div className="mx-auto w-full max-w-7xl px-4">
        {/* Mobile: horizontal scrollable pills with nav buttons inside a rounded container */}
        <div className="lg:hidden">
          <div className="group relative rounded-xl bg-white p-3 shadow-sm">
            <div
              className="hide-scrollbar flex gap-3 overflow-x-auto px-1 py-2"
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

            {/* mobile: no nav buttons (swipe) */}
          </div>
        </div>

        {/* Desktop: scrollable centered container with nav */}
        <div className="hidden lg:block">
          <div
            className="group relative rounded-xl bg-white p-3 shadow-sm"
            onMouseEnter={() => setHoverDesktop(true)}
            onMouseLeave={() => setHoverDesktop(false)}
          >
            <div
              className="hide-scrollbar flex items-center gap-4 overflow-x-auto px-2"
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

            <ScrollControls
              onPrev={handlePrevDesktop}
              onNext={handleNextDesktop}
              leftClass={`absolute top-1/2 left-3 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow transition-opacity duration-200 hover:bg-white lg:flex lg:opacity-0 lg:group-hover:opacity-100 ${canScrollLeftDesktop ? "" : "opacity-40"}`}
              rightClass={`absolute top-1/2 right-3 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow transition-opacity duration-200 hover:bg-white lg:flex lg:opacity-0 lg:group-hover:opacity-100 ${canScrollRightDesktop ? "" : "opacity-40"}`}
              leftDisabled={!canScrollLeftDesktop}
              rightDisabled={!canScrollRightDesktop}
              leftVisible={hoverDesktop}
              rightVisible={hoverDesktop}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryIconsRow;
