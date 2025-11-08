import React from "react";
import type { Product } from "@/services/productService";
import { Heart, Star } from "lucide-react";

export default function ProductCard({
  product,
  index,
}: {
  product?: Product | null;
  index: number;
}) {
  const name = product?.name ?? `Example Product`;
  const price = product?.price ?? 1000;

  const imageSrc =
    product?.imageUrl ?? 'logo.png';

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
          <div className="absolute top-2 left-2 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700">
            -{product.discount}%
          </div>
        ) : null}

        <button className="absolute top-2 right-2 cursor-pointer rounded-full bg-white p-1 text-xs shadow-sm">
          <Heart className="h-4 w-4 text-rose-400" />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between p-2 text-xs">
        <div>
          <div className="line-clamp-2 font-medium">{name}</div>
          <div className="mt-1 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">
              ₫ {price.toLocaleString()}
            </div>
            {product?.rating ? (
              <div className="text-xs text-slate-600 flex items-center ">
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
                ? `${product.soldCount.toLocaleString()} sold`
                : ""}
            </div>
            <div
              className={`rounded-full px-2 py-0.5 ${product?.inStock ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}
            >
              {product?.inStock ? "In stock" : "Out of stock"}
            </div>
          </div>

          {product?.promotion ? (
            <div className="mt-1 text-xs text-slate-500">
              {product.promotion}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
