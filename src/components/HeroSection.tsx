import React, { useEffect, useState } from "react";
import CategoryIconsRow from "./CategoryIconsRow";
import { Search, ArrowRight } from "lucide-react";
import { getAllProducts } from "@/services/productService";
import type { Product } from "@/services/productService";
import { sponsorMocks } from "@/mocks/mockData";
import HorizontalCarousel from "./HorizontalCarousel";
import ProductCard from "./ProductCard";

// Hero kiểu PriceRunner: card bo góc, tiêu đề lớn, mô tả, search bar và hình ảnh bên phải
export default function HeroSection() {
  const [topProducts, setTopProducts] = useState<Product[] | null>(null);
  const [adventProducts, setAdventProducts] = useState<Product[] | null>(null);
  const [phoneSaleProducts, setPhoneSaleProducts] = useState<Product[] | null>(
    null,
  );
  const [sponsors, setSponsors] = useState<
    {
      id: string;
      name: string;
      imageUrl: string;
      logoUrl?: string;
      targetUrl?: string;
    }[]
  >(sponsorMocks);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // 1) Top products (bán chạy)
        const topRes = await getAllProducts({ sort: "bestseller", limit: 10 });
        const topList: Product[] = topRes?.products ?? [];
        if (mounted) setTopProducts(topList);
      } catch (e) {
        console.warn("Failed to load top products", e);
        if (mounted) setTopProducts([]);
      }

      try {
        // 2) Laptops on sale (giảm giá nhiều)
        const laptopRes = await getAllProducts({
          category: "laptop",
          sort: "discount",
          limit: 10,
        });
        const laptopList: Product[] = laptopRes?.products ?? [];
        if (mounted) setAdventProducts(laptopList);
      } catch (e) {
        console.warn("Failed to load laptop products", e);
        if (mounted) setAdventProducts([]);
      }

      try {
        // 3) Phones on sale (giảm giá nhiều)
        const phonesRes = await getAllProducts({
          category: "phone",
          sort: "discount",
          limit: 10,
        });
        const phonesList: Product[] = phonesRes?.products ?? [];
        if (mounted) setPhoneSaleProducts(phonesList);
      } catch (e) {
        console.warn("Failed to load phone products", e);
        if (mounted) setPhoneSaleProducts([]);
      }

      // Use mock sponsors for development (no network fetch)
      if (mounted) setSponsors(sponsorMocks);
    })();

    return () => {
      mounted = false;
    };
  }, []);
  return (
    <section className="mx-auto max-w-7xl py-12">
      <div
        className="relative overflow-hidden rounded-2xl text-white shadow-lg"
        style={{
          // show original image colors (no dark overlay)
          backgroundImage: "url('/Web_hero_desktop.avif')",
          backgroundSize: "cover",
          backgroundPosition: "right center",
        }}
      >
        <div className="grid grid-cols-1 items-center gap-6 p-8 md:grid-cols-12 md:p-12">
          {/* Left content */}
          <div className="z-10 md:col-span-7">
            <h1 className="text-3xl leading-tight font-extrabold sm:text-4xl md:text-5xl lg:text-6xl">
              Search, compare, save
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-200 sm:text-lg md:text-xl">
              Find your next deal today — compare prices on millions of products
              from thousands of shops
            </p>

            {/* Search bar */}
            <div className="mt-8 max-w-xl">
              <div className="flex items-center rounded-full bg-white p-1 shadow-sm">
                <div className="pr-2 pl-3 text-slate-700">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  aria-label="Search products"
                  placeholder="What are you looking for today?"
                  className="flex-1 rounded-full border-0 bg-transparent px-2 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                <button className="mr-1 ml-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-900 p-3 text-white hover:bg-slate-800">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right spacer (image is background) */}
          <div
            className="z-10 flex justify-center md:col-span-5 md:justify-end"
            aria-hidden
          >
            {/* decorative empty div to keep layout — actual image is background */}
            <div className="h-[320px] w-[320px] rounded-xl" />
          </div>
        </div>

        {/* subtle overlay to darken edges (decorative) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
      </div>
      {/* Category icons row (simple) */}
      <CategoryIconsRow />
      {/* ----------------------------- */}
      {/* Below-category content: banners + carousels */}
      {/* ----------------------------- */}
      <div className="mt-8 space-y-10">
        {/* Sponsored banners row */}
        <div>
          <h3 className="mb-3 text-lg font-semibold">Sponsored</h3>
          <HorizontalCarousel items={sponsors.length}>
            {(i: number) => {
              const s = sponsors[i];
              return (
                <div
                  key={s?.id ?? i}
                  className="relative mr-4 h-[258px] w-[360px] flex-shrink-0 overflow-visible rounded-lg border border-slate-100 bg-white shadow-sm"
                >
                  {/* banner area */}
                  <div className="relative h-[170px] w-full overflow-hidden rounded-t-lg bg-slate-200">
                    {s?.targetUrl ? (
                      <a
                        href={s.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-full w-full"
                      >
                        <img
                          loading="lazy"
                          decoding="async"
                          alt={s?.name ?? `sponsor-${i}`}
                          src={s?.imageUrl ?? `iphone.png`}
                          className="h-full w-full object-contain transition-transform duration-200 ease-out hover:scale-105"
                          onError={(e) => (e.currentTarget.src = "iphone.png")}
                        />
                      </a>
                    ) : (
                      <img
                        loading="lazy"
                        decoding="async"
                        alt={s?.name ?? `sponsor-${i}`}
                        src={s?.imageUrl ?? `iphone.png`}
                        className="h-full w-full object-cover transition-transform duration-200 ease-out hover:scale-105"
                        onError={(e) => (e.currentTarget.src = "iphone.png")}
                      />
                    )}
                  </div>

                  {/* logo + name (inside same parent, below the image) */}
                  <div className="justify-space flex items-center gap-2 px-3 py-4 text-center">
                    <div className="h-12 w-12 flex-shrink-0">
                      <img
                        loading="lazy"
                        decoding="async"
                        src={
                          s?.logoUrl ??
                          s?.imageUrl ??
                          "/assets/sponsor-logo-placeholder.png"
                        }
                        alt={`${s?.name ?? "logo"}`}
                        className="h-12 w-12 rounded-full border object-contain"
                        onError={(e) =>
                          (e.currentTarget.src =
                            "/assets/sponsor-logo-placeholder.png")
                        }
                      />
                    </div>
                    <div className="text-base font-semibold text-slate-800">
                      {s?.name ?? `Sponsor ${i}`}
                    </div>
                  </div>
                </div>
              );
            }}
          </HorizontalCarousel>
        </div>

        {/* Generic horizontal product carousel sections */}
        {[
          { title: "Top products", data: topProducts },
          { title: "Laptops on sale", data: adventProducts },
          { title: "Mobile phones on sale", data: phoneSaleProducts },
        ].map((section) => (
          <section key={section.title}>
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <a
                className="text-sm text-slate-500 underline hover:no-underline"
                href="#"
              >
                See all
              </a>
            </div>

            <HorizontalCarousel items={section.data?.length || 0}>
              {(idx: number) => {
                const data = section.data;
                const product = data && data[idx] ? data[idx] : null;
                return <ProductCard key={idx} product={product} index={idx} />;
              }}
            </HorizontalCarousel>
          </section>
        ))}
      </div>
    </section>
  );
}
