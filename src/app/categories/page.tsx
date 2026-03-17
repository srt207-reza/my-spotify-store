"use client";

import Link from "next/link";
import { Layers, ChevronLeft, Sparkles } from "lucide-react";
import { useCategories } from "@/services/useCategories";
import { Category } from "@/types/api";

export default function AllCategoriesPage() {
    const { data, isLoading } = useCategories();

    if (isLoading) {
        return (
            <div className="container py-12 space-y-4 animate-pulse" dir="rtl">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-gray-100 rounded-2xl w-full"></div>
                ))}
            </div>
        );
    }

    // جدا کردن دسته‌های سطح صفر (اصلی)
    const rootCategories = data?.categories?.filter((cat: Category) => cat.level === 0) || [];

    return (
        <main className="container py-12 font-vazir min-h-screen" dir="rtl">
            <div className="flex items-center gap-3 mb-10">
                <div className="p-3 bg-salona-100 text-salona-500 rounded-2xl">
                    <Layers className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 font-iransans">دسته‌بندی محصولات</h1>
                    <p className="text-gray-500 mt-1">
                        کشف زیبایی در میان {data?.total_categories} دسته‌بندی متنوع سالونا
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {rootCategories.map((rootCategory: Category) => (
                    <div
                        key={rootCategory.id}
                        className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-salona-50/50 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-salona-400" />
                                {rootCategory.name}
                            </h2>
                            <Link
                                href={`/categories/${rootCategory.id}`}
                                className="text-sm bg-salona-50 text-salona-600 px-4 py-1.5 rounded-full font-medium hover:bg-salona-500 hover:text-white transition-colors"
                            >
                                مشاهده همه
                            </Link>
                        </div>

                        {/* نمایش زیردسته‌ها (فرزندان) */}
                        {rootCategory.children && rootCategory.children.length > 0 ? (
                            <ul className="space-y-3">
                                {rootCategory.children.map((child: Category) => (
                                    <li key={child.id}>
                                        <Link
                                            href={`/categories/${child.id}`}
                                            className="group flex items-center justify-between p-3 rounded-xl hover:bg-salona-50 transition-colors"
                                        >
                                            <span className="text-gray-600 group-hover:text-salona-700 font-medium">
                                                {child.name}
                                            </span>
                                            <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-salona-500 transition-transform group-hover:-translate-x-1" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-gray-400 text-sm text-center py-4 bg-gray-50 rounded-xl">
                                بدون زیردسته
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
}
