"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, Heart, Star, AlertCircle, Plus, Minus, Loader2 } from "lucide-react";
import type { Product } from "@/types/api";
import { addToCart, removeFromCart } from "@/store/slices/cartSlice";
// فقط متدهای اکشن (Mutation) ایمپورت می‌شوند
import { useAddFavorite, useDeleteFavorite } from "@/services/useFavorites";

interface ProductCardProps {
    product: Product;
    // پراپ‌های جدید برای مدیریت علاقه‌مندی از سمت والد
    isFavorited?: boolean;
    favoriteId?: number;
}

export const ProductCard = ({ product, isFavorited = false, favoriteId }: ProductCardProps) => {
    const dispatch = useDispatch();

    const { mutate: addFavorite, isPending: isAdding } = useAddFavorite();
    const { mutate: removeFavorite, isPending: isRemoving } = useDeleteFavorite();

    const isFavoriteLoading = isAdding || isRemoving;
    const brandName = product.attributes?.["برند"];
    const mainImage = product.images && product.images.length > 0 ? product.images[0] : "/placeholder.png";
    const isOutOfStock = product.stock === 0;

    const cartItem = useSelector((state: any) => state.cart.items.find((item: any) => item.id === String(product.id)));
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOutOfStock) return;

        dispatch(
            addToCart({
                id: String(product.id),
                name: product.name,
                price: product.final_price || 0,
                quantity: 1,
                image: mainImage,
            }),
        );
    };

    const handleRemoveFromCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(removeFromCart(String(product.id)));
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isFavoriteLoading) return;

        if (isFavorited && favoriteId) {
            // حذف از علاقه‌مندی‌ها با استفاده از شناسه رکورد پاس داده شده
            removeFavorite(favoriteId);
        } else {
            // افزودن محصول به علاقه‌مندی‌ها
            addFavorite(product.id);
        }
    };

    return (
        <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-salona-100/40 transition-all duration-300 flex flex-col h-full relative">
            <div className="relative aspect-square overflow-hidden bg-gray-50/50 p-6 flex items-center justify-center">
                <Link href={`/products/${product.id}`} className="w-full h-full relative block">
                    <img
                        src={mainImage}
                        alt={product.name}
                        className={`w-full h-full object-contain transition-transform duration-700 ${
                            !isOutOfStock ? "group-hover:scale-110" : "grayscale opacity-70"
                        }`}
                    />
                </Link>

                <button
                    onClick={handleToggleFavorite}
                    disabled={isFavoriteLoading}
                    className={`absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur rounded-full shadow-sm transition-all z-10 
                        ${isFavorited ? "opacity-100 text-red-500" : "opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 text-gray-400 hover:text-red-500 hover:bg-white"} 
                        ${isFavoriteLoading ? "cursor-not-allowed opacity-100" : "cursor-pointer"}`}
                    aria-label={isFavorited ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
                >
                    {isFavoriteLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    ) : (
                        // استفاده از کلاس fill-current برای توپر شدن قلب در صورت علاقه‌مندی
                        <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
                    )}
                </button>

                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    {isOutOfStock ? (
                        <span className="bg-gray-800/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                            ناموجود
                        </span>
                    ) : product.is_low_stock ? (
                        <span className="bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            موجودی محدود
                        </span>
                    ) : null}
                </div>
            </div>

            <div className="p-5 flex flex-col grow justify-between gap-4">
                <div className="space-y-2">
                    {brandName && <span className="text-xs font-medium text-gray-400 block mb-1">{brandName}</span>}

                    <h3 className="text-gray-800 font-semibold text-sm leading-relaxed line-clamp-2 hover:text-salona-500 transition-colors">
                        <Link href={`/products/${product.id}`}>{product.name}</Link>
                    </h3>

                    <div className="flex items-center gap-1.5 pt-1">
                        <Star
                            className={`w-4 h-4 ${
                                product.total_ratings > 0 ? "text-amber-400 fill-current" : "text-gray-300"
                            }`}
                        />
                        <span className="text-xs font-medium mt-0.5 text-gray-600">
                            {product.total_ratings > 0 ? product.average_rating : "بدون امتیاز"}
                        </span>
                        {product.total_ratings > 0 && (
                            <span className="text-xs text-gray-400 mt-0.5">({product.total_ratings})</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                        {isOutOfStock ? (
                            <span className="text-gray-400 font-medium text-sm pb-1">در حال حاضر موجود نیست</span>
                        ) : (
                            <div className="flex items-center gap-1">
                                <span className="text-salona-600 font-black text-lg tracking-tight">
                                    {product.final_price?.toLocaleString()}
                                </span>
                                <span className="text-gray-500 text-xs font-medium mb-1">تومان</span>
                            </div>
                        )}
                    </div>

                    <div className="relative z-20">
                        {isOutOfStock ? (
                            <button
                                disabled
                                className="w-11 h-11 rounded-full flex items-center justify-center bg-gray-100 text-gray-400 cursor-not-allowed"
                            >
                                <ShoppingCart className="w-5 h-5" />
                            </button>
                        ) : quantityInCart > 0 ? (
                            <div className="flex items-center justify-between bg-salona-50 border border-salona-200 rounded-full px-1 shadow-sm h-11 gap-2 transition-all duration-300">
                                <button
                                    onClick={handleAddToCart}
                                    className="w-8 h-8 cursor-pointer shrink-0 flex items-center justify-center rounded-full bg-white text-salona-600 shadow-sm hover:bg-salona-500 hover:text-white transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                                <span className="font-bold text-sm text-salona-700 text-center w-full">
                                    {quantityInCart}
                                </span>
                                <button
                                    onClick={handleRemoveFromCart}
                                    className="w-8 h-8 cursor-pointer shrink-0 flex items-center justify-center rounded-full bg-white text-salona-600 shadow-sm hover:bg-red-500 hover:text-white transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleAddToCart}
                                className="w-11 h-11 cursor-pointer rounded-full flex items-center justify-center transition-all duration-300 bg-salona-50 text-salona-600 hover:bg-salona-500 hover:text-white hover:shadow-lg hover:shadow-salona-200 active:scale-95"
                            >
                                <ShoppingCart className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
