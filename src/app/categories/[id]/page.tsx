"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronLeft, SlidersHorizontal, PackageX } from "lucide-react";
import { useCategories } from "@/services/useCategories";
import { useProducts } from "@/services/useProducts";
import { useFavorites } from "@/services/useFavorites";
import { ProductCard } from "@/components/shared/ProductsCard";
import { Category, Product } from "@/types/api";

// تابع کمکی برای پیدا کردن یک دسته خاص در ساختار درختی
const findCategoryById = (categories: Category[], id: number): Category | null => {
    for (const cat of categories) {
        if (cat.id === id) return cat;
        if (cat.children && cat.children.length > 0) {
            const found = findCategoryById(cat.children, id);
            if (found) return found;
        }
    }
    return null;
};

export default function SingleCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    // باز کردن params در Next.js 15+ (اگر نسخه قدیمی‌تر است Promise نیاز نیست)
    const resolvedParams = use(params);
    const categoryId = parseInt(resolvedParams.id);

    const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;

    // دریافت کل دسته‌ها برای پیدا کردن دسته فعلی
    const { data: categoriesData, isLoading: isCatLoading } = useCategories();
    const { data: favoritesData } = useFavorites(!!user);

    // دریافت محصولات مختص این دسته
    const { data: productsData, isLoading: isProdLoading } = useProducts({
        category_id: categoryId,
        per_page: 20,
    });

    const currentCategory = categoriesData?.categories ? findCategoryById(categoriesData.categories, categoryId) : null;

    if (isCatLoading) {
        return <div className="container py-20 text-center text-salona-500 animate-pulse">در حال بارگذاری...</div>;
    }

    if (!currentCategory && !isCatLoading) {
        return <div className="container py-20 text-center text-gray-500">دسته‌بندی مورد نظر یافت نشد.</div>;
    }

    // جدا کردن مسیرها برای Breadcrumb (مثلا "محصولات مراقبتی > پوست" تبدیل به آرایه می‌شود)
    const breadcrumbs = currentCategory?.full_path.split(" > ") || [];

    return (
        <main className="min-h-screen bg-background font-vazir pb-20" dir="rtl">
            {/* بخش هدر دسته‌بندی */}
            <div className="bg-salona-50/50 border-b border-salona-100 py-8 mb-10">
                <div className="container">
                    {/* مسیر راهنما (Breadcrumbs) */}
                    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
                        <Link href="/" className="hover:text-salona-500 transition-colors">
                            خانه
                        </Link>
                        <ChevronLeft className="w-3 h-3" />
                        <Link href="/categories" className="hover:text-salona-500 transition-colors">
                            دسته‌بندی‌ها
                        </Link>
                        {breadcrumbs.map((crumb, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <ChevronLeft className="w-3 h-3" />
                                <span className={index === breadcrumbs.length - 1 ? "text-salona-600 font-bold" : ""}>
                                    {crumb}
                                </span>
                            </div>
                        ))}
                    </nav>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-iransans mb-6">
                        {currentCategory?.name}
                    </h1>

                    {/* نمایش زیردسته‌ها در صورت وجود */}
                    {currentCategory?.children && currentCategory.children.length > 0 && (
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {currentCategory.children.map((child: Category) => (
                                <Link
                                    key={child.id}
                                    href={`/categories/${child.id}`}
                                    className="flex-shrink-0 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-full text-sm font-medium hover:border-salona-400 hover:text-salona-600 hover:shadow-md transition-all"
                                >
                                    {child.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* بخش محصولات */}
            <div className="container">
                <div className="flex items-center justify-between mb-8">
                    <p className="text-gray-600">
                        {isProdLoading ? "در حال جستجو..." : `${productsData?.products?.length || 0} کالا یافت شد`}
                    </p>
                    <button className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors">
                        <SlidersHorizontal className="w-4 h-4" />
                        <span className="text-sm font-medium">مرتب‌سازی</span>
                    </button>
                </div>

                {isProdLoading ? (
                    // اسکلتون لودینگ محصولات
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl border border-gray-100 h-80 animate-pulse"
                            ></div>
                        ))}
                    </div>
                ) : productsData?.products?.length > 0 ? (
                    // گرید محصولات
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                        {productsData.products.map((product: Product) => {
                            const favoriteRecord = favoritesData?.favorites?.find(
                                (fav) => fav.product_id === product.id,
                            );
                            return (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    isFavorited={!!favoriteRecord}
                                    favoriteId={favoriteRecord?.id}
                                />
                            );
                        })}
                    </div>
                ) : (
                    // حالت خالی (Empty State)
                    <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-salona-100 text-salona-400 rounded-full flex items-center justify-center mb-4">
                            <PackageX className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">محصولی یافت نشد!</h3>
                        <p className="text-gray-500">در حال حاضر محصولی در این دسته‌بندی وجود ندارد.</p>
                        <Link
                            href="/categories"
                            className="mt-6 text-salona-500 font-medium hover:text-salona-600 underline underline-offset-4"
                        >
                            بازگشت به همه دسته‌بندی‌ها
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
