"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown, MapPin } from "lucide-react";
import { useUserProfile } from "@/services/useUser";

// تعریف اینترفیس برای آدرس کاربر
interface UserAddress {
    id: number;
    address: string;
    is_default: boolean;
    latitude: number;
    longitude: number;
    postal_code: string;
}

// تعریف اینترفیس برای ساختار دیتای کاربر بر اساس API
interface UserProfile {
    id: number;
    user_id: string;
    name: string | null;
    phone_number: string;
    active: boolean;
    confirmed: boolean;
    default_address: UserAddress | null;
    favorites_count: number;
    orders_count: number;
    wallet_balance: number;
}

export const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // استیت برای دراپ‌دون پروفایل
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    // استیت برای حل مشکل Hydration سبد خرید
    const [isMounted, setIsMounted] = useState(false);

    // دریافت اطلاعات کاربر از هوک اختصاصی
    // فرض بر این است که هوک شما مقادیر دیتا و وضعیت لودینگ را برمی‌گرداند
    const { data, isLoading: isUserLoading } = useUserProfile();
    
    //@ts-ignore
    const userData: UserProfile | null = data?.user || null;

    // دریافت لیست محصولات سبد خرید از Redux
    const cartItems = useSelector((state: any) => state.cart.items);
    const uniqueProductCount = cartItems?.length || 0;

    useEffect(() => {
        setIsMounted(true);

        // منطق اسکرول هدر
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // مدیریت کلیک خارج از دراپ‌دون پروفایل
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        };

        if (isProfileDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isProfileDropdownOpen]);

    // تعیین عبارتی که باید به کاربر نمایش داده شود (نام یا شماره تلفن)
    const displayName = userData?.name || userData?.phone_number;

    // متغیری برای بررسی وضعیت کلی بارگذاری بخش کاربری
    const isProfileSectionLoading = !isMounted || isUserLoading;

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled ? "bg-white shadow-md py-3" : "bg-white/80 backdrop-blur-md py-4 border-b border-gray-100"
            }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* لوگو و دکمه منوی موبایل */}
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden text-gray-700 hover:text-primary transition"
                            onClick={() => setIsMobileMenuOpen(true)}
                            aria-label="باز کردن منو"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <Link href="/" className="text-2xl font-black text-primary tracking-tighter">
                            SALONA<span className="text-gray-900">.</span>
                        </Link>
                    </div>

                    {/* نوار جستجو (فقط در دسکتاپ) */}
                    <div className="hidden lg:flex flex-1 max-w-xl mx-8 relative">
                        <input
                            type="text"
                            placeholder="جستجو در محصولات سالونا..."
                            className="w-full bg-gray-100 text-gray-800 text-sm rounded-full py-3 px-6 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
                    </div>

                    {/* آیکون‌های اکشن */}
                    <div className="flex items-center gap-3 sm:gap-5">
                        <Link
                            href="/profile/favorites"
                            className="text-gray-600 hover:text-primary transition hidden sm:block"
                        >
                            <Heart className="w-6 h-6" />
                        </Link>
                        
                        {/* آیکون سبد خرید */}
                        <Link href="/cart" className="relative text-gray-600 hover:text-primary transition">
                            <ShoppingCart className="w-6 h-6" />
                            {isMounted && uniqueProductCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {uniqueProductCount}
                                </span>
                            )}
                        </Link>
                        
                        {/* بخش ورود / پروفایل کاربر */}
                        <div className="relative" ref={dropdownRef}>
                            {isProfileSectionLoading ? (
                                // حالت لودینگ اولیه (اسکلتون)
                                <div className="hidden sm:flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                                    <div className="w-24 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                                </div>
                            ) : userData ? (
                                // حالت لاگین شده: نمایش بج پروفایل و دراپ‌دون
                                <div>
                                    <button 
                                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                        className="hidden cursor-pointer sm:flex items-center gap-2 py-1.5 pl-2 pr-3 border border-gray-200 rounded-full hover:border-primary hover:bg-primary/5 transition-all focus:outline-none"
                                    >
                                        <div className="bg-primary/10 py-1.5 rounded-full text-primary">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <span className="font-medium text-sm text-gray-700 dir-ltr tracking-wide">
                                            {displayName}
                                        </span>
                                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileDropdownOpen ? "rotate-180 text-primary" : ""}`} />
                                    </button>
                                    
                                    {/* دکمه موبایل (فقط آیکون) */}
                                    <button 
                                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                        className="sm:hidden flex items-center justify-center bg-primary/10 text-primary p-2 rounded-full"
                                    >
                                        <User className="w-5 h-5" />
                                    </button>

                                    {/* دراپ‌دون */}
                                    <div 
                                        className={`absolute top-full left-0 mt-3 w-56 rounded-xl bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-200 overflow-hidden transition-all duration-200 origin-top-left ${
                                            isProfileDropdownOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
                                        }`}
                                    >
                                        {/* هدر دراپ‌دون */}
                                        <div className="sm:hidden px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                                            <span className="block text-xs text-gray-500 mb-1">کاربر سالونا</span>
                                            <span className="block font-semibold text-gray-800 text-sm dir-ltr text-left">{displayName}</span>
                                        </div>
                                        
                                        <div className="py-2">
                                            <Link 
                                                href="/checkout" 
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-slate-100 hover:text-primary transition-colors"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                            >
                                                <MapPin className="w-4 h-4" />
                                                <span className="font-medium">ثبت آدرس</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // حالت لاگین نشده: دکمه ورود/ثبت‌نام
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 text-gray-600 hover:text-primary transition"
                                >
                                    <User className="w-6 h-6" />
                                    <span className="hidden sm:block text-sm font-medium">ورود | ثبت‌نام</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* منوی موبایل (Mobile Drawer) */}
            <div
                className={`fixed inset-0 bg-black/50 z-50 lg:hidden transition-opacity duration-300 ${
                    isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
            >
                <div
                    className={`fixed top-0 right-0 h-full w-3/4 max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-in-out transform ${
                        isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        <span className="text-xl font-black text-primary">SALONA</span>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 text-gray-500 hover:text-red-500 bg-gray-50 rounded-full transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-5 overflow-y-auto max-h-[calc(100vh-80px)]">
                        {/* نمایش اطلاعات کاربر در بالای منوی موبایل */}
                        {isProfileSectionLoading ? (
                            <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 animate-pulse">
                                <div className="w-11 h-11 bg-gray-200 rounded-full"></div>
                                <div className="flex flex-col gap-2">
                                    <div className="w-16 h-3 bg-gray-200 rounded"></div>
                                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ) : userData ? (
                            <div className="flex items-center gap-3 mb-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                <div className="bg-white p-2.5 rounded-full shadow-sm text-primary">
                                    <User className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 mb-1">خوش آمدید،</span>
                                    <span className="font-bold text-gray-800 dir-ltr text-left tracking-wider">{displayName}</span>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center justify-center gap-2 mb-6 p-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition shadow-lg shadow-primary/20"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <User className="w-5 h-5" />
                                ورود به حساب کاربری
                            </Link>
                        )}

                        <div className="relative mb-6">
                            <input
                                type="text"
                                placeholder="جستجو..."
                                className="w-full bg-gray-100 rounded-lg py-3 px-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                        </div>

                        <nav className="flex flex-col gap-4">
                            <Link href="/" className="text-gray-700 font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                صفحه اصلی
                            </Link>
                            <Link href="/products" className="text-gray-700 font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                محصولات
                            </Link>
                            <Link href="/categories" className="text-gray-700 font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                دسته‌بندی‌ها
                            </Link>
                            
                            <div className="h-px bg-gray-100 my-2"></div>
                            
                            {/* لینک ثبت آدرس در منوی موبایل */}
                            {userData && (
                                <Link href="/checkout" className="flex items-center gap-3 text-gray-700 font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                    ثبت آدرس
                                </Link>
                            )}
                            
                            <Link href="/profile/favorites" className="flex items-center gap-3 text-gray-700 font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                                <Heart className="w-5 h-5 text-gray-400" />
                                علاقه‌مندی‌ها
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
};
