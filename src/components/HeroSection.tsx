
import CategoryIconsRow from "./CategoryIconsRow";
import { Search, ArrowRight } from "lucide-react";

// Hero kiểu PriceRunner: card bo góc, tiêu đề lớn, mô tả, search bar và hình ảnh bên phải
export default function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl  py-12">
      <div
        className="relative rounded-2xl overflow-hidden text-white shadow-lg"
        style={{
          // show original image colors (no dark overlay)
          backgroundImage: "url('/Web_hero_desktop.avif')",
          backgroundSize: "cover",
          backgroundPosition: "right center",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-8 md:p-12">
          {/* Left content */}
          <div className="md:col-span-7 z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Search, compare, save
            </h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl">
              Find your next deal today — compare prices on millions of products from thousands of shops
            </p>

            {/* Search bar */}
            <div className="mt-8 max-w-xl">
              <div className="flex items-center rounded-full bg-white p-1 shadow-sm">
                <div className="pl-3 pr-2 text-slate-700">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  aria-label="Search products"
                  placeholder="What are you looking for today?"
                  className="flex-1 rounded-full border-0 bg-transparent px-2 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                <button className="ml-2 mr-1 rounded-full bg-slate-900 p-3 h-10 w-10 flex items-center justify-center text-white hover:bg-slate-800 cursor-pointer">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

           
          </div>

          {/* Right spacer (image is background) */}
          <div className="md:col-span-5 flex justify-center md:justify-end z-10" aria-hidden>
            {/* decorative empty div to keep layout — actual image is background */}
            <div className="w-[320px] h-[320px] rounded-xl" />
          </div>
        </div>

        {/* subtle overlay to darken edges (decorative) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
        
      </div>
       {/* Category icons row (simple) */}
            <CategoryIconsRow />
    </section>
    
  );
}