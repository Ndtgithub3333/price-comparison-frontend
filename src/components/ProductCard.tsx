import React, { useState } from "react";
import type { Product } from "@/services/productService";
import { Heart, Star } from "lucide-react";
export default function ProductCard({
  product,
  index,
}: {
  product?: Product | null;
  index?: number;
}) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [popping, setPopping] = useState(false);
  const [particles, setParticles] = useState<
    Array<{ id: number; left: number; delay: number }>
  >([]);

  const name = product?.name ?? `Example Product`;
  const price = product?.price ?? 1000;

  const imageSrc = product?.imageUrl ?? "logo.png";

  return (
    <article className="group mr-2 flex h-[320px] w-[226px] flex-shrink-0 flex-col rounded-lg border border-slate-100 bg-white shadow-sm">
      <div className="relative">
        <div className="flex h-[220px] w-full items-center justify-center overflow-hidden rounded-t-md bg-slate-100">
          <img
            loading="lazy"
            src={imageSrc}
            alt={name}
            className="h-full w-full object-contain p-2 transition-transform duration-200 ease-out group-hover:scale-105"
            onError={(e) =>
              (e.currentTarget.src = "/assets/product-fallback.png")
            }
          />
        </div>

        {product?.discount ? (
          <div className="absolute top-2 left-2 rounded-full bg-rose-50 px-3 py-0.5 text-xs font-semibold text-rose-700">
            -{product.discount}%
          </div>
        ) : null}

        <button
          className={`absolute top-2 right-2 cursor-pointer rounded-full bg-white p-1 text-xs shadow-sm transition-transform duration-200 ${popping ? "scale-110" : ""}`}
          onClick={() => {
            setIsFavorited(!isFavorited);
            // trigger pop animation and particles
            setPopping(true);
            setTimeout(() => setPopping(false), 220);

            const spawn: Array<{ id: number; left: number; delay: number }> =
              [];
            const count = 6;
            for (let i = 0; i < count; i++) {
              const id = Date.now() + Math.floor(Math.random() * 10000) + i;
              const left = 8 + Math.random() * 180;
              const delay = Math.random() * 120;
              spawn.push({ id, left, delay });
            }
            setParticles((p) => [...p, ...spawn]);
            setTimeout(() => {
              setParticles((p) => p.slice(spawn.length));
            }, 1200);
          }}
          aria-label="like"
        >
          <Heart
            className={`h-4 w-4 ${isFavorited ? "fill-red-500 text-red-500" : "text-rose-400"}`}
          />
        </button>

        {/* floating heart particles */}
        {particles.map((pt) => (
          <div
            key={pt.id}
            className="animate-floatUp pointer-events-none absolute bottom-8"
            style={{
              left: pt.left,
              width: 16,
              height: 16,
              animationDuration: `${800 + Math.random() * 300}ms`,
              animationDelay: `${pt.delay}ms`,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 text-rose-500"
            >
              <path d="M12 21s-7-4.35-9-6.5C-0.5 9.5 5 4 8 6c1.5 1 2 2 4 2s2.5-1 4-2c3-2 8.5 3.5 5 8.5C19 16.65 12 21 12 21z" />
            </svg>
          </div>
        ))}
      </div>

      <div className="flex flex-1 flex-col justify-between p-2 text-xs">
        <div>
          <div className="line-clamp-2 font-medium">{name}</div>
          <div className="mt-1 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">
              {price.toLocaleString()}₫
            </div>
            {product?.rating ? (
              <div className="flex items-center text-xs text-slate-600">
                {product.rating.toFixed(1)}{" "}
                <Star className="ml-0.5 inline-block h-3 w-3 text-yellow-400" />
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <div>
              {product?.soldCount
                ? `${product.soldCount.toLocaleString()} đã bán`
                : ""}
            </div>
            <div
              className={`rounded-full px-2 py-0.5 ${product?.inStock ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}
            >
              {product?.inStock ? "Còn hàng" : "Hết hàng"}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
