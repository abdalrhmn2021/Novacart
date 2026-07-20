import Link from "next/link";
import { getTopProducts } from "@/services/productService";

export default async function TopProducts() {
  const products = await getTopProducts();

  return (
    <section className="container mx-auto px-6 py-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/products/${product._id}`}
            className="
              group relative overflow-hidden rounded-2xl
              border border-white/10 bg-white/[0.03]
              transition-all duration-300
              hover:-translate-y-1 hover:border-[#c69749]/50
              hover:shadow-[0_20px_40px_-15px_rgba(198,151,73,0.25)]
            "
          >
            {/* الصورة */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={"/a.png"}
                alt={product.name}
                className="
                  h-full w-full object-cover
                  transition-transform duration-500
                  group-hover:scale-110
                "
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <span
                className="
                  absolute bottom-3 right-3
                  rounded-full bg-[#c69749] px-3 py-1
                  text-xs font-bold text-[#1a1a1a]
                  shadow-md
                "
              >
                ${product.price}
              </span>
            </div>

            {/* المحتوى */}
            <div className="p-4">
              <h3
                className="
                  truncate font-semibold text-white
                  transition-colors duration-300
                  group-hover:text-[#c69749]
                "
              >
                {product.name}
              </h3>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-bold text-[#c69749]">
                  ${product.price}
                </span>

                <span
                  className="
                    flex h-8 w-8 items-center justify-center
                    rounded-full border border-[#c69749]/30
                    bg-[#c69749]/10 text-[#c69749]
                    transition-all duration-300
                    group-hover:bg-[#c69749] group-hover:text-[#1a1a1a]
                  "
                >
                  →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}