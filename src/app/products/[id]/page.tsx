"use client";

import { useProductDetail } from "@/services/useProducts";
import { useFavorites, useAddFavorite, useDeleteFavorite } from "@/services/useFavorites"; // اضافه شدن هوک‌های علاقه‌مندی
import {
    ShoppingCart,
    Heart,
    Star,
    ShieldCheck,
    Truck,
    ChevronRight,
    AlertCircle,
    Info,
    Plus,
    Minus,
    Loader2, // اضافه شدن لودر برای دکمه قلب
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { Product } from "@/types/api";
import { addToCart, removeFromCart } from "@/store/slices/cartSlice";
// پیشنهاد: برای پرفورمنس بهتر در Next.js از next/image استفاده کنید
import Image from "next/image";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = Number(params.id);

    // راه‌اندازی Redux
    const dispatch = useDispatch();

    // دریافت اطلاعات محصول در سبد خرید از استیت گلوبال
    const cartItem = useSelector((state: any) => state.cart.items.find((item: any) => item.id === String(productId)));
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    // واکشی اطلاعات محصول از API
    const { data: response, isLoading, isError } = useProductDetail(productId);

    //@ts-ignore
    const product: Product | undefined = response?.product;

    // --- بخش مربوط به علاقه‌مندی‌ها (Favorites) ---
    const { data: favoritesData } = useFavorites();
    const { mutate: addFavorite, isPending: isAddingFavorite } = useAddFavorite();
    const { mutate: deleteFavorite, isPending: isDeletingFavorite } = useDeleteFavorite();

    // بررسی اینکه آیا این محصول در لیست علاقه‌مندی‌های کاربر وجود دارد یا خیر
    const favoriteRecord = favoritesData?.favorites?.find(
        (fav: any) => fav.product_id === product?.id || (fav.product && fav.product.id === product?.id),
    );
    const isFavorited = !!favoriteRecord;
    const favoriteId = favoriteRecord?.id;
    const isFavoriteLoading = isAddingFavorite || isDeletingFavorite;

    // تابع هندل کردن کلیک روی دکمه قلب
    const handleToggleFavorite = () => {
        if (!product) return;

        if (isFavorited && favoriteId) {
            deleteFavorite(favoriteId);
        } else {
            addFavorite(product.id);
        }
    };
    // ----------------------------------------------

    // استیت برای مدیریت تصویری که کاربر در گالری انتخاب کرده است
    const [selectedImage, setSelectedImage] = useState<number>(0);

    // توابع مدیریت سبد خرید
    const handleAddToCart = () => {
        if (!product) return;
        dispatch(
            addToCart({
                id: String(product.id),
                name: product.name,
                price: product.final_price || 0,
                quantity: 1,
                image: product.images && product.images.length > 0 ? product.images[0] : "",
            }),
        );
    };

    const handleRemoveFromCart = () => {
        dispatch(removeFromCart(String(productId)));
    };

    // کامپوننت اسکلتون برای حالت لودینگ
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 animate-pulse pb-16">
                <div className="lg:col-span-5 space-y-4">
                    <div className="bg-gray-100 rounded-3xl aspect-square w-full"></div>
                    <div className="flex gap-4">
                        <div className="bg-gray-100 rounded-xl aspect-square w-20"></div>
                        <div className="bg-gray-100 rounded-xl aspect-square w-20"></div>
                    </div>
                </div>
                <div className="lg:col-span-7 space-y-6 py-4">
                    <div className="h-4 bg-gray-100 rounded-md w-1/3 mb-8"></div>
                    <div className="h-10 bg-gray-100 rounded-md w-3/4"></div>
                    <div className="h-6 bg-gray-100 rounded-md w-1/4"></div>
                    <div className="space-y-3 pt-6">
                        <div className="h-4 bg-gray-100 rounded-md w-full"></div>
                        <div className="h-4 bg-gray-100 rounded-md w-full"></div>
                        <div className="h-4 bg-gray-100 rounded-md w-2/3"></div>
                    </div>
                    <div className="h-24 bg-gray-100 rounded-xl w-full mt-10"></div>
                </div>
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-gray-50 rounded-3xl border border-gray-100">
                <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">محصول مورد نظر یافت نشد!</h2>
                <button
                    onClick={() => router.back()}
                    className="text-salona-500 hover:text-salona-600 font-medium flex items-center gap-2 bg-salona-50 px-6 py-3 rounded-xl transition-colors"
                >
                    <ChevronRight className="w-5 h-5" />
                    بازگشت به صفحه محصولات
                </button>
            </div>
        );
    }

    const isOutOfStock = product.stock === 0;
    const brandName = product.attributes?.["برند"];

    return (
        <div className="space-y-8 pb-20">
            {/* مسیر راهنما */}
            <nav className="flex items-center text-sm text-gray-500 gap-2 overflow-x-auto whitespace-nowrap pb-2">
                <button onClick={() => router.push("/")} className="hover:text-salona-500 transition-colors">
                    سالونا
                </button>
                <ChevronRight className="w-4 h-4 text-gray-300" />
                {product.category?.full_path ? (
                    <span className="text-gray-600">{product.category.full_path.split(" > ").join(" / ")}</span>
                ) : (
                    <span className="text-gray-600">{product.category?.name}</span>
                )}
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
                {/* بخش گالری تصاویر محصول */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden aspect-square relative p-8 shadow-sm flex items-center justify-center">
                        <Image
                            src={
                                product.images && product.images.length > 0
                                    ? product.images[selectedImage]
                                    : "/placeholder.png"
                            }
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className={`object-contain p-8 transition-all duration-500 ${isOutOfStock ? "grayscale opacity-80" : ""}`}
                        />
                    </div>

                    {product.images && product.images.length > 1 && (
                        <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`relative cursor-pointer shrink-0 w-20 h-20 rounded-2xl border-2 overflow-hidden p-2 transition-all ${
                                        selectedImage === index
                                            ? "border-salona-500 shadow-md"
                                            : "border-gray-100 hover:border-salona-300 opacity-70 hover:opacity-100"
                                    }`}
                                >
                                    <Image
                                        src={img}
                                        alt={`${product.name} - تصویر ${index + 1}`}
                                        fill
                                        sizes="80px"
                                        className="object-contain p-1"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* بخش اطلاعات محصول */}
                <div className="lg:col-span-7 flex flex-col">
                    <div className="grow">
                        {brandName && <div className="text-salona-500 font-bold text-sm mb-2">{brandName}</div>}
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-5">
                            {product.name}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 mb-8 border-b border-gray-100 pb-6">
                            <div className="flex items-center gap-1.5 text-amber-400">
                                <Star
                                    className={`w-5 h-5 ${product.total_ratings > 0 ? "fill-current" : "text-gray-300"}`}
                                />
                                <span className="text-sm font-medium text-gray-700 mt-1 ml-1">
                                    {product.total_ratings > 0 ? product.average_rating : "بدون امتیاز"}
                                    {product.total_ratings > 0 && (
                                        <span className="text-gray-400 font-normal mr-1">
                                            ({product.total_ratings} دیدگاه)
                                        </span>
                                    )}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                {isOutOfStock ? (
                                    <>
                                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                                        <span className="text-red-600 font-medium">ناموجود</span>
                                    </>
                                ) : product.is_low_stock ? (
                                    <>
                                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
                                        <span className="text-orange-600 font-medium">
                                            تنها {product.stock} عدد در انبار باقیست
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                        <span className="text-emerald-600 font-medium">موجود در انبار سالونا</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-salona-50/50 border border-salona-100/50 text-salona-700">
                                <ShieldCheck className="w-6 h-6 shrink-0 text-salona-500" />
                                <span className="text-sm font-medium">ضمانت اصالت کالا</span>
                            </div>
                            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-salona-50/50 border border-salona-100/50 text-salona-700">
                                <Truck className="w-6 h-6 shrink-0 text-salona-500" />
                                <span className="text-sm font-medium">ارسال سریع و مطمئن</span>
                            </div>
                        </div>

                        {product.description && (
                            <div className="mb-10">
                                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <Info className="w-5 h-5 text-gray-400" />
                                    درباره محصول
                                </h3>
                                <p className="text-gray-600 leading-loose text-sm text-justify">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {product.specifications && Object.keys(product.specifications).length > 0 && (
                            <div className="mb-10">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">ویژگی‌های اصلی</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                                    {Object.entries(product.specifications).map(([key, value], idx) => (
                                        <div key={idx} className="flex items-start gap-2 text-sm">
                                            <span className="text-gray-500 min-w-25">{key}:</span>
                                            <span className="text-gray-900 font-medium">{String(value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* بخش قیمت و عملیات سبد خرید */}
                    <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] sticky bottom-4 flex flex-col sm:flex-row items-center justify-between gap-6 z-20 mt-4">
                        <div className="flex flex-col w-full sm:w-auto">
                            {isOutOfStock ? (
                                <span className="text-gray-400 font-medium">در حال حاضر موجود نیست</span>
                            ) : (
                                <>
                                    <span className="text-gray-500 text-xs mb-1">قیمت نهایی:</span>
                                    <span className="text-salona-600 font-black text-2xl tracking-tight">
                                        {product.final_price?.toLocaleString()}{" "}
                                        <span className="text-sm font-normal text-gray-500 tracking-normal">تومان</span>
                                    </span>
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            {/* دکمه علاقه‌مندی (اصلاح شده) */}
                            <button
                                onClick={handleToggleFavorite}
                                disabled={isFavoriteLoading}
                                className={`flex-1 sm:flex-none w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border 
                                    ${isFavoriteLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                    ${
                                        isFavorited
                                            ? "bg-red-50 text-red-500 border-red-100 hover:bg-red-100"
                                            : "bg-gray-50 text-gray-500 hover:bg-salona-50 hover:text-salona-500 border-gray-100 hover:border-salona-100"
                                    }`}
                            >
                                {isFavoriteLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <Heart className={`w-6 h-6 ${isFavorited ? "fill-current" : ""}`} />
                                )}
                            </button>

                            {/* مدیریت وضعیت‌های مختلف دکمه سبد خرید */}
                            {isOutOfStock ? (
                                <button
                                    disabled
                                    className="grow sm:grow-0 sm:min-w-55 h-14 rounded-2xl font-bold flex items-center justify-center gap-2 bg-gray-100 text-gray-400 cursor-not-allowed"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    ناموجود
                                </button>
                            ) : quantityInCart > 0 ? (
                                // حالت نمایش شمارنده (زمانی که حداقل 1 عدد در سبد خرید وجود دارد)
                                <div className="grow sm:grow-0 sm:min-w-55 h-14 flex items-center justify-between bg-salona-50 border border-salona-200 rounded-2xl px-2 shadow-sm">
                                    <button
                                        onClick={handleAddToCart}
                                        className="w-10 h-10 cursor-pointer flex items-center justify-center rounded-xl bg-white text-salona-600 shadow-sm hover:bg-salona-500 hover:text-white transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>

                                    <span className="font-bold text-lg text-salona-700 w-10 text-center">
                                        {quantityInCart}
                                    </span>

                                    <button
                                        onClick={handleRemoveFromCart}
                                        className="w-10 h-10 cursor-pointer flex items-center justify-center rounded-xl bg-white text-salona-600 shadow-sm hover:bg-red-500 hover:text-white transition-colors"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                // حالت پیش‌فرض افزودن به سبد خرید
                                <button
                                    onClick={handleAddToCart}
                                    className="grow sm:grow-0 sm:min-w-55 h-14 cursor-pointer rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 bg-salona-500 hover:bg-salona-600 text-white shadow-lg shadow-salona-500/30 hover:shadow-salona-500/50 active:scale-95"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    افزودن به سبد خرید
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
