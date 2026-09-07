"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import {
    User,
    Users,
    Mail,
    Clock,
    CreditCard,
    AlertCircle,
    LayoutDashboard,
    Search,
    Filter,
    Lock,
    Calendar,
    Trash2,
    CheckCircle2,
    Hourglass,
    Banknote,
    Hash,
    Building2,
    ChevronDown,
    ChevronUp,
    FileSpreadsheet,
    RotateCcw,
    ShoppingBag,
    Tags,
    CircleDollarSign,
    TrendingUp,
} from "lucide-react";
import * as XLSX from "xlsx";
import jalaliMoment from "jalali-moment";
import toast from "react-hot-toast";
import type { PlanPricing } from "@/components/order/orderData";
import PlanPricingManager from "./PlanPricingManager";

type Receipt = {
    payerName: string;
    trackingCode: string;
    sourceBank: string;
    submittedAt: string;
};

type OrderStatus = "pending_payment" | "awaiting_verification" | "processing" | "completed";
type DiscountType = "percent" | "fixed";

type DiscountCode = {
    code: string;
    type: DiscountType;
    value: number;
    active: boolean;
    maxUses?: number;
    usedCount: number;
    minOrderAmount?: number;
    expiresAt?: string;
    createdAt: string;
    updatedAt: string;
};

type Order = {
    id: string;
    planType: "individual" | "family";
    planId?: string;
    planTitle?: string;
    price: number;
    originalPrice?: number;
    discountAmount?: number;
    couponCode?: string;
    finalPrice?: number;
    durationMonths: number;
    fullNameEn: string;
    password?: string;
    dateOfBirth: string;
    gender?: string;
    spotifyEmail: string;
    status: OrderStatus;
    receipt?: Receipt;
    createdAt: string;
    importedFromExcel?: boolean;
};

type StatusFilter = "all" | "legacy" | "processing" | "completed";
type AdminSection = "orders" | "pricing" | "discounts";

const STATUS_META: Record<OrderStatus, { label: string; color: string; bg: string; border: string; icon: ReactNode }> =
    {
        pending_payment: {
            label: "قدیمی: در انتظار پرداخت",
            color: "text-amber-400",
            bg: "bg-amber-500/10",
            border: "border-amber-500/25",
            icon: <AlertCircle className="w-3.5 h-3.5" />,
        },
        awaiting_verification: {
            label: "قدیمی: در انتظار بررسی",
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/25",
            icon: <Hourglass className="w-3.5 h-3.5" />,
        },
        processing: {
            label: "در حال پردازش",
            color: "text-violet-400",
            bg: "bg-violet-500/10",
            border: "border-violet-500/25",
            icon: <Clock className="w-3.5 h-3.5" />,
        },
        completed: {
            label: "تکمیل شده",
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/25",
            icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        },
    };

function getStatusGroup(status: string): Exclude<StatusFilter, "all"> {
    if (status === "processing" || status === "completed") return status;
    return "legacy";
}

function getStatusMeta(status: string) {
    return STATUS_META[(status as OrderStatus) || "processing"] ?? STATUS_META.processing;
}

function toLatinDigits(input: string) {
    const map: Record<string, string> = {
        "۰": "0",
        "۱": "1",
        "۲": "2",
        "۳": "3",
        "۴": "4",
        "۵": "5",
        "۶": "6",
        "۷": "7",
        "۸": "8",
        "۹": "9",
        "٠": "0",
        "١": "1",
        "٢": "2",
        "٣": "3",
        "٤": "4",
        "٥": "5",
        "٦": "6",
        "٧": "7",
        "٨": "8",
        "٩": "9",
    };

    return input.replace(/[۰-۹٠-٩]/g, (d) => map[d] ?? d);
}

function getOrderTimestamp(dateString?: string) {
    const normalized = toLatinDigits(normalizeText(dateString));
    if (!normalized) return 0;

    const jalaliMatch = normalized.match(
        /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})(?:\D+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/,
    );

    if (jalaliMatch && Number(jalaliMatch[1]) < 1700) {
        const [, year, month, day, hour = "0", minute = "0", second = "0"] = jalaliMatch;
        const parsed = jalaliMoment.from(
            `${year}/${month}/${day} ${hour}:${minute}:${second}`,
            "fa",
            "YYYY/M/D HH:mm:ss",
        );

        if (parsed.isValid()) return parsed.valueOf();
    }

    const timestamp = Date.parse(normalized);
    return Number.isNaN(timestamp) ? 0 : timestamp;
}

function normalizeText(value: unknown): string {
    if (typeof value === "string") return value.trim();
    if (value === null || value === undefined) return "";
    return String(value).trim();
}

function parseNumber(value: unknown): number {
    const cleaned = toLatinDigits(normalizeText(value)).replace(/[^\d.-]/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
}

function parsePlanType(value: unknown): "individual" | "family" | null {
    const v = normalizeText(value).toLowerCase();
    if (v === "family" || v === "فمیلی" || v === "خانوادگی" || v.includes("family") || v.includes("فمیلی")) {
        return "family";
    }
    if (v === "individual" || v === "شخصی" || v.includes("individual") || v.includes("شخصی")) {
        return "individual";
    }
    return null;
}

function parseStatus(value: unknown): OrderStatus {
    const v = normalizeText(value).toLowerCase();

    if (v.includes("تکمیل") || v === "completed") return "completed";
    if (v.includes("پردازش") || v === "processing") return "processing";
    if (v.includes("بررسی") || v.includes("تأیید") || v.includes("تایید") || v === "awaiting_verification") {
        return "awaiting_verification";
    }
    return "pending_payment";
}

function cleanSourceBank(value: unknown): string {
    return normalizeText(value)
        .replace(/^بانک\s+/g, "")
        .trim();
}

function parseDateSafe(dateString?: string) {
    if (!dateString) return "نامشخص";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function parseDateForExcel(dateString?: string) {
    if (!dateString) return "نامشخص";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function getCell(row: Record<string, unknown>, keys: string[]) {
    for (const key of keys) {
        const value = row[key];
        if (value !== undefined && value !== null && normalizeText(value) !== "") {
            return value;
        }
    }
    return "";
}

function normalizeImportedRow(row: Record<string, unknown>): Order | null {
    const id = normalizeText(getCell(row, ["شناسه سفارش", "ID", "id", "orderId", "کد سفارش"]));

    const planType = parsePlanType(getCell(row, ["نوع پلن", "planType", "plan type", "پلن"]));

    const fullNameEn = normalizeText(getCell(row, ["نام و نام خانوادگی", "fullNameEn", "fullName", "name"]));

    const spotifyEmail = normalizeText(getCell(row, ["ایمیل اسپاتیفای", "spotifyEmail", "email"]));

    const dateOfBirth = normalizeText(getCell(row, ["تاریخ تولد", "dateOfBirth", "birthDate"]));

    if (!planType || !fullNameEn || !spotifyEmail || !dateOfBirth) {
        return null;
    }

    const receiptPayerName = normalizeText(getCell(row, ["نام واریزکننده", "payerName"]));
    const receiptTrackingCode = normalizeText(getCell(row, ["کد رهگیری", "trackingCode"]));
    const receiptSourceBank = cleanSourceBank(getCell(row, ["بانک مبدأ", "sourceBank"]));
    const receiptSubmittedAt = normalizeText(getCell(row, ["زمان ثبت رسید", "submittedAt"]));

    const hasReceipt = receiptPayerName.length > 0 && receiptTrackingCode.length > 0 && receiptSourceBank.length > 0;

    const originalPriceCell = getCell(row, ["مبلغ اصلی", "originalPrice"]);
    const discountAmountCell = getCell(row, ["مبلغ تخفیف", "discountAmount"]);
    const finalPriceCell = getCell(row, ["مبلغ نهایی", "finalPrice"]);
    const couponCodeCell = normalizeText(getCell(row, ["کد تخفیف", "couponCode"]));

    const importedPrice = parseNumber(getCell(row, ["مبلغ (تومان)", "price", "مبلغ"]));
    const originalPrice = normalizeText(originalPriceCell) ? parseNumber(originalPriceCell) : importedPrice;
    const discountAmount = normalizeText(discountAmountCell) ? parseNumber(discountAmountCell) : 0;
    const finalPrice = normalizeText(finalPriceCell)
        ? parseNumber(finalPriceCell)
        : discountAmount > 0
          ? Math.max(0, originalPrice - discountAmount)
          : importedPrice;

    return {
        id: id || `SP-IMP-${Date.now().toString(36).slice(-4).toUpperCase()}`,
        planType,
        durationMonths: parseNumber(getCell(row, ["مدت (ماه)", "durationMonths", "مدت"])),
        price: finalPrice || importedPrice,
        originalPrice: originalPrice || finalPrice || importedPrice,
        discountAmount,
        couponCode: couponCodeCell || undefined,
        finalPrice: finalPrice || importedPrice,
        fullNameEn,
        password: normalizeText(getCell(row, ["رمز عبور", "password"])) || undefined,
        dateOfBirth,
        gender: normalizeText(getCell(row, ["جنسیت", "gender"])) || undefined,
        spotifyEmail,
        status: parseStatus(getCell(row, ["وضعیت", "status"])) || "processing",
        receipt: hasReceipt
            ? {
                  payerName: receiptPayerName,
                  trackingCode: receiptTrackingCode,
                  sourceBank: receiptSourceBank,
                  submittedAt: receiptSubmittedAt || new Date().toISOString(),
              }
            : undefined,
        createdAt: normalizeText(getCell(row, ["زمان ایجاد سفارش", "createdAt"])) || new Date().toISOString(),
        importedFromExcel: true,
    };
}

export default function ClientOrders({
    orders,
    initialPricing,
    adminSecret,
}: {
    orders: Order[];
    initialPricing: PlanPricing;
    adminSecret: string;
}) {
    const [orderList, setOrderList] = useState<Order[]>(orders);
    const [activeSection, setActiveSection] = useState<AdminSection>("orders");
    const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
    const [discountForm, setDiscountForm] = useState({
        code: "",
        type: "percent" as DiscountType,
        value: "",
        maxUses: "",
        minOrderAmount: "",
        expiresAt: "",
    });
    const [creatingDiscount, setCreatingDiscount] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState<"all" | "individual" | "family">("all");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [expandedReceipt, setExpandedReceipt] = useState<string | null>(null);
    const [importing, setImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const loadDiscountCodes = async () => {
            try {
                const res = await fetch("/api/discount-code");
                const data = await res.json();

                if (data.success) {
                    setDiscountCodes(Array.isArray(data.codes) ? data.codes : []);
                } else {
                    toast.error(data.message || "خطا در دریافت کدهای تخفیف");
                }
            } catch {
                toast.error("خطا در دریافت کدهای تخفیف");
            }
        };

        loadDiscountCodes();
    }, []);

    const totalOrders = orderList.length;
    const totalIncome = orderList.reduce((acc, o) => acc + ((o.finalPrice ?? o.price) || 0), 0);
    const processingCount = orderList.filter((o) => o.status === "processing").length;
    const completedCount = orderList.filter((o) => o.status === "completed").length;
    const legacyCount = orderList.filter((o) => getStatusGroup(o.status) === "legacy").length;
    const totalDiscount = orderList.reduce((acc, o) => acc + (o.discountAmount || 0), 0);

    const filteredOrders = useMemo(() => {
        const filtered = orderList.filter((order) => {
            const matchPlan = activeFilter === "all" || order.planType === activeFilter;
            const matchStatus = statusFilter === "all" || getStatusGroup(order.status) === statusFilter;

            if (!searchTerm.trim()) return matchPlan && matchStatus;

            const q = searchTerm.toLowerCase().trim();

            const matchSearch =
                (order.id || "").toLowerCase().includes(q) ||
                (order.fullNameEn || "").toLowerCase().includes(q) ||
                (order.spotifyEmail || "").toLowerCase().includes(q) ||
                (order.receipt?.payerName || "").toLowerCase().includes(q) ||
                (order.receipt?.trackingCode || "").toLowerCase().includes(q) ||
                (order.planTitle || "").toLowerCase().includes(q) ||
                (order.couponCode || "").toLowerCase().includes(q);

            return matchPlan && matchStatus && matchSearch;
        });

        return filtered.sort((a, b) => getOrderTimestamp(b.createdAt) - getOrderTimestamp(a.createdAt));
    }, [orderList, searchTerm, activeFilter, statusFilter]);

    const handleCreateDiscountCode = async () => {
        const code = discountForm.code.trim();
        const value = Number(discountForm.value);

        if (!code || !discountForm.value.trim()) {
            toast.error("کد و مقدار تخفیف الزامی است.");
            return;
        }

        if (!Number.isFinite(value) || value <= 0) {
            toast.error("مقدار تخفیف معتبر نیست.");
            return;
        }

        setCreatingDiscount(true);
        try {
            const res = await fetch("/api/discount-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code,
                    type: discountForm.type,
                    value,
                    maxUses: discountForm.maxUses ? Number(discountForm.maxUses) : undefined,
                    minOrderAmount: discountForm.minOrderAmount ? Number(discountForm.minOrderAmount) : undefined,
                    expiresAt: discountForm.expiresAt || undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                toast.error(data.message || "خطا در ثبت کد");
                return;
            }

            setDiscountCodes((prev) => [data.code, ...prev]);
            setDiscountForm({
                code: "",
                type: "percent",
                value: "",
                maxUses: "",
                minOrderAmount: "",
                expiresAt: "",
            });
            toast.success("کد تخفیف ثبت شد.");
        } catch {
            toast.error("خطا در ارتباط با سرور");
        } finally {
            setCreatingDiscount(false);
        }
    };

    const handleToggleDiscount = async (code: string, active: boolean) => {
        try {
            const res = await fetch("/api/discount-code", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, active }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                toast.error(data.message || "خطا در بروزرسانی کد");
                return;
            }

            setDiscountCodes((prev) => prev.map((item) => (item.code === code ? { ...item, active } : item)));
            toast.success("وضعیت کد بروزرسانی شد.");
        } catch {
            toast.error("خطا در ارتباط با سرور");
        }
    };

    const handleDeleteDiscount = async (code: string) => {
        if (!window.confirm("کد تخفیف حذف شود؟")) return;

        try {
            const res = await fetch(`/api/discount-code?code=${encodeURIComponent(code)}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                toast.error(data.message || "خطا در حذف کد");
                return;
            }

            setDiscountCodes((prev) => prev.filter((item) => item.code !== code));
            toast.success("کد تخفیف حذف شد.");
        } catch {
            toast.error("خطا در ارتباط با سرور");
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: OrderStatus) => {
        setIsUpdating(id);
        try {
            const res = await fetch("/api/order", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus }),
            });

            const data = await res.json();

            if (data.success) {
                setOrderList((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
                toast.success("وضعیت سفارش بروزرسانی شد.");
            } else {
                toast.error(data.message || "خطا در بروزرسانی وضعیت");
            }
        } catch {
            toast.error("خطا در برقراری ارتباط با سرور");
        } finally {
            setIsUpdating(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("آیا از حذف این سفارش اطمینان دارید؟")) return;

        setIsDeleting(id);
        try {
            const res = await fetch(`/api/order?id=${encodeURIComponent(id)}`, { method: "DELETE" });
            const data = await res.json();

            if (data.success) {
                setOrderList((prev) => prev.filter((o) => o.id !== id));
                toast.success("سفارش حذف شد.");
            } else {
                toast.error(data.message || "خطا در حذف سفارش");
            }
        } catch {
            toast.error("خطا در برقراری ارتباط با سرور");
        } finally {
            setIsDeleting(null);
        }
    };

    const handleExportExcel = () => {
        const rows = [...orderList]
            .sort((a, b) => getOrderTimestamp(b.createdAt) - getOrderTimestamp(a.createdAt))
            .map((order) => ({
            "شناسه سفارش": order.id,
            "نوع پلن": order.planType === "family" ? "فمیلی" : "شخصی",
            "مدت (ماه)": order.durationMonths || 0,
            "نام و نام خانوادگی": order.fullNameEn || "ثبت نشده",
            جنسیت: order.gender || "ثبت نشده",
            "تاریخ تولد": order.dateOfBirth || "ثبت نشده",
            "ایمیل اسپاتیفای": order.spotifyEmail || "ثبت نشده",
            "رمز عبور": order.password || "بدون رمز",
            "کد تخفیف": order.couponCode || "ندارد",
            "مبلغ اصلی": order.originalPrice ?? order.price ?? 0,
            "مبلغ تخفیف": order.discountAmount ?? 0,
            "مبلغ نهایی": order.finalPrice ?? order.price ?? 0,
            "مبلغ (تومان)": order.finalPrice ?? order.price ?? 0,
            وضعیت: getStatusMeta(order.status).label,
            "نام واریزکننده": order.receipt?.payerName || "ندارد",
            "کد رهگیری": order.receipt?.trackingCode || "ندارد",
            "بانک مبدأ": order.receipt?.sourceBank ? `بانک ${order.receipt.sourceBank}` : "ندارد",
            "زمان ثبت رسید": parseDateForExcel(order.receipt?.submittedAt),
            "زمان ایجاد سفارش": parseDateForExcel(order.createdAt),
            }));

        const worksheet = XLSX.utils.json_to_sheet(rows);

        worksheet["!cols"] = [
            { wch: 14 },
            { wch: 14 },
            { wch: 12 },
            { wch: 18 },
            { wch: 12 },
            { wch: 20 },
            { wch: 30 },
            { wch: 16 },
            { wch: 16 },
            { wch: 14 },
            { wch: 14 },
            { wch: 14 },
            { wch: 16 },
            { wch: 14 },
            { wch: 18 },
            { wch: 18 },
            { wch: 18 },
            { wch: 18 },
            { wch: 18 },
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Spotify Orders");

        const fileName = `spotify-orders-${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(workbook, fileName);
        toast.success("فایل اکسل خروجی گرفته شد.");
    };

    const handleImportExcel = async (file: File) => {
        setImporting(true);
        try {
            const buffer = await file.arrayBuffer();
            const workbook = XLSX.read(buffer, { type: "array" });

            const firstSheetName = workbook.SheetNames[0];
            if (!firstSheetName) {
                toast.error("فایل اکسل معتبر نیست.");
                return;
            }

            const sheet = workbook.Sheets[firstSheetName];
            const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
                defval: "",
                blankrows: false,
            });

            if (rawRows.length === 0) {
                toast.error("هیچ ردیفی در فایل پیدا نشد.");
                return;
            }

            const normalizedOrders = rawRows.map(normalizeImportedRow).filter((row): row is Order => Boolean(row));

            if (normalizedOrders.length === 0) {
                toast.error("هیچ ردیف معتبری برای وارد کردن پیدا نشد.");
                return;
            }

            const res = await fetch("/api/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "import",
                    orders: normalizedOrders,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                toast.error(data.message || "خطا در ورود فایل اکسل");
                return;
            }

            const importedOrders: Order[] = Array.isArray(data.importedOrders) ? data.importedOrders : [];

            if (importedOrders.length > 0) {
                setOrderList((prev) => {
                    const knownOrderIds = new Set(prev.map((order) => normalizeText(order.id).toUpperCase()));
                    const nextOrders = [...prev];

                    for (const order of importedOrders) {
                        const normalizedId = normalizeText(order.id).toUpperCase();
                        if (knownOrderIds.has(normalizedId)) continue;

                        knownOrderIds.add(normalizedId);
                        nextOrders.push(order);
                    }

                    return nextOrders;
                });
            }

            toast.success(`فایل وارد شد. ${data.importedCount ?? importedOrders.length} ردیف ذخیره شد.`);
        } catch (err) {
            console.error(err);
            toast.error("خطا در خواندن یا ارسال فایل اکسل");
        } finally {
            setImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div className="min-h-screen overflow-x-clip bg-store-base px-3 py-4 font-sans text-white sm:px-5 md:py-8 lg:px-8" dir="rtl">
            <div className="relative z-10 mx-auto max-w-[1500px] space-y-5">
                <motion.header
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden rounded-[28px] border border-white/10 bg-[#101311]"
                >
                    <div className="flex flex-col gap-5 border-b border-white/8 bg-gradient-to-l from-emerald-500/[0.09] via-transparent to-sky-500/[0.04] p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                                <LayoutDashboard className="h-7 w-7" />
                            </div>
                            <div>
                                <div className="mb-1.5 flex items-center gap-2 text-xs font-bold text-emerald-400">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
                                    پنل مدیریت فعال است
                                </div>
                                <h1 className="text-2xl font-black text-white sm:text-3xl">
                                    داشبورد سفارشات اسپاتیفای
                                </h1>
                                <p className="mt-1.5 text-sm font-medium text-slate-400">
                                    مدیریت، پیگیری و گزارش‌گیری یکپارچه
                                </p>
                            </div>
                        </div>

                        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
                            <button
                                type="button"
                                onClick={handleExportExcel}
                                className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 text-sm font-bold text-emerald-300 transition-colors hover:bg-emerald-400/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                            >
                                <FileSpreadsheet className="h-4 w-4" />
                                خروجی اکسل
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImportExcel(file);
                                }}
                            />

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={importing}
                                className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-sky-400/20 bg-sky-400/10 px-4 text-sm font-bold text-sky-300 transition-colors hover:bg-sky-400/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {importing ? <RotateCcw className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
                                {importing ? "در حال ورود" : "آپلود اکسل"}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-px bg-white/8 sm:grid-cols-3 xl:grid-cols-6">
                        {[
                            {
                                label: "کل درآمد (تومان)",
                                value: totalIncome.toLocaleString("fa-IR"),
                                color: "text-emerald-400",
                                icon: <TrendingUp className="h-4 w-4" />,
                            },
                            {
                                label: "تخفیف کل",
                                value: totalDiscount.toLocaleString("fa-IR"),
                                color: "text-cyan-300",
                                icon: <CircleDollarSign className="h-4 w-4" />,
                            },
                            {
                                label: "کل سفارشات",
                                value: totalOrders.toLocaleString("fa-IR"),
                                color: "text-white",
                                icon: <ShoppingBag className="h-4 w-4" />,
                            },
                            {
                                label: "در حال پردازش",
                                value: processingCount.toLocaleString("fa-IR"),
                                color: "text-violet-300",
                                icon: <Clock className="h-4 w-4" />,
                            },
                            {
                                label: "تکمیل شده",
                                value: completedCount.toLocaleString("fa-IR"),
                                color: "text-emerald-400",
                                icon: <CheckCircle2 className="h-4 w-4" />,
                            },
                            {
                                label: "قدیمی",
                                value: legacyCount.toLocaleString("fa-IR"),
                                color: "text-amber-300",
                                icon: <AlertCircle className="h-4 w-4" />,
                            },
                        ].map(({ label, value, color, icon }) => (
                            <div key={label} className="min-w-0 bg-[#101311] p-4 sm:p-5">
                                <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-500">
                                    {icon}
                                    <span className="truncate">{label}</span>
                                </div>
                                <p className={`truncate text-lg font-black sm:text-xl ${color}`}>{value}</p>
                            </div>
                        ))}
                    </div>
                </motion.header>

                <nav
                    className="grid grid-cols-3 gap-1 rounded-2xl border border-white/10 bg-[#101311] p-1.5"
                    aria-label="بخش‌های پنل مدیریت"
                >
                    {[
                        { key: "orders" as const, label: "سفارش‌ها", icon: ShoppingBag },
                        { key: "pricing" as const, label: "قیمت پلن‌ها", icon: CircleDollarSign },
                        { key: "discounts" as const, label: "کدهای تخفیف", icon: Tags },
                    ].map(({ key, label, icon: SectionIcon }) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setActiveSection(key)}
                            aria-pressed={activeSection === key}
                            className={`inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl px-2 text-xs font-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 sm:text-sm ${
                                activeSection === key
                                    ? "bg-emerald-400 text-black"
                                    : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                            }`}
                        >
                            <SectionIcon className="h-4 w-4 shrink-0" />
                            <span>{label}</span>
                        </button>
                    ))}
                </nav>

                {activeSection === "pricing" && (
                    <PlanPricingManager initialPricing={initialPricing} adminSecret={adminSecret} />
                )}

                {activeSection === "discounts" && (
                    <motion.section
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden rounded-[28px] border border-white/10 bg-[#101311]"
                        aria-labelledby="discount-title"
                    >
                        <div className="flex items-start gap-3.5 border-b border-white/8 bg-gradient-to-l from-sky-500/[0.07] via-transparent to-transparent p-5 sm:p-6">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-300">
                                <Tags className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 id="discount-title" className="text-lg font-black text-white sm:text-xl">
                                    کدهای تخفیف
                                </h2>
                                <p className="mt-1 text-sm text-slate-400">ساخت، فعال/غیرفعال‌سازی و حذف کدها</p>
                            </div>
                        </div>

                        <div className="space-y-5 p-4 sm:p-6">
                            <div className="rounded-2xl border border-white/8 bg-black/20 p-4 sm:p-5">
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
                                    <label className="block">
                                        <span className="mb-2 block text-xs font-bold text-slate-400">کد تخفیف</span>
                                        <input
                                            value={discountForm.code}
                                            onChange={(e) =>
                                                setDiscountForm((p) => ({
                                                    ...p,
                                                    code: e.target.value.replace(/[^A-Za-z0-9]/g, ""),
                                                }))
                                            }
                                            placeholder="مثلا NEW20"
                                            dir="ltr"
                                            autoComplete="off"
                                            className="h-12 w-full rounded-xl border border-white/10 bg-[#151816] px-3 text-left text-sm font-bold text-white outline-none transition-colors placeholder:text-slate-600 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="mb-2 block text-xs font-bold text-slate-400">نوع تخفیف</span>
                                        <select
                                            value={discountForm.type}
                                            onChange={(e) =>
                                                setDiscountForm((p) => ({
                                                    ...p,
                                                    type: e.target.value as DiscountType,
                                                }))
                                            }
                                            className="h-12 w-full rounded-xl border border-white/10 bg-[#151816] px-3 text-sm text-white outline-none transition-colors focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10"
                                        >
                                            <option value="percent">درصدی</option>
                                            <option value="fixed">مبلغی</option>
                                        </select>
                                    </label>
                                    <label className="block">
                                        <span className="mb-2 block text-xs font-bold text-slate-400">مقدار</span>
                                        <input
                                            value={discountForm.value}
                                            onChange={(e) => setDiscountForm((p) => ({ ...p, value: e.target.value }))}
                                            type="number"
                                            inputMode="numeric"
                                            min="1"
                                            className="h-12 w-full rounded-xl border border-white/10 bg-[#151816] px-3 text-sm text-white outline-none transition-colors focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="mb-2 block text-xs font-bold text-slate-400">حداکثر استفاده</span>
                                        <input
                                            value={discountForm.maxUses}
                                            onChange={(e) => setDiscountForm((p) => ({ ...p, maxUses: e.target.value }))}
                                            type="number"
                                            inputMode="numeric"
                                            min="1"
                                            className="h-12 w-full rounded-xl border border-white/10 bg-[#151816] px-3 text-sm text-white outline-none transition-colors focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="mb-2 block text-xs font-bold text-slate-400">حداقل سفارش</span>
                                        <input
                                            value={discountForm.minOrderAmount}
                                            onChange={(e) => setDiscountForm((p) => ({ ...p, minOrderAmount: e.target.value }))}
                                            type="number"
                                            inputMode="numeric"
                                            min="0"
                                            className="h-12 w-full rounded-xl border border-white/10 bg-[#151816] px-3 text-sm text-white outline-none transition-colors focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10"
                                        />
                                    </label>
                                </div>

                                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
                                    <label className="block">
                                        <span className="mb-2 block text-xs font-bold text-slate-400">تاریخ انقضا</span>
                                        <input
                                            value={discountForm.expiresAt}
                                            onChange={(e) => setDiscountForm((p) => ({ ...p, expiresAt: e.target.value }))}
                                            type="datetime-local"
                                            className="h-12 w-full rounded-xl border border-white/10 bg-[#151816] px-3 text-sm text-white outline-none transition-colors focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10"
                                        />
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleCreateDiscountCode}
                                        disabled={creatingDiscount}
                                        className="mt-auto inline-flex h-12 min-w-40 cursor-pointer items-center justify-center rounded-xl bg-sky-400 px-5 text-sm font-black text-black transition-colors hover:bg-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {creatingDiscount ? "در حال ثبت..." : "ثبت کد تخفیف"}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {discountCodes.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-4 py-10 text-center text-sm text-slate-500">
                                        هنوز کد تخفیفی ثبت نشده است.
                                    </div>
                                ) : (
                                    discountCodes.map((item) => (
                                        <article
                                            key={item.code}
                                            className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-[#151816] p-4 transition-colors hover:border-white/15 md:flex-row md:items-center md:justify-between"
                                        >
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="font-black text-white" dir="ltr">{item.code}</span>
                                                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                                                        item.active
                                                            ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                                                            : "border-slate-500/20 bg-slate-500/10 text-slate-400"
                                                    }`}>
                                                        {item.active ? "فعال" : "غیرفعال"}
                                                    </span>
                                                </div>
                                                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs leading-6 text-slate-400">
                                                    <span>{item.type === "percent" ? `${item.value}%` : `${item.value.toLocaleString("fa-IR")} تومان`}</span>
                                                    <span>استفاده: {item.usedCount.toLocaleString("fa-IR")}{item.maxUses ? ` / ${item.maxUses.toLocaleString("fa-IR")}` : ""}</span>
                                                    {item.minOrderAmount ? <span>حداقل {item.minOrderAmount.toLocaleString("fa-IR")} تومان</span> : null}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 md:flex">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleDiscount(item.code, !item.active)}
                                                    className="min-h-11 cursor-pointer rounded-xl border border-sky-400/20 bg-sky-400/10 px-4 text-xs font-bold text-sky-300 transition-colors hover:bg-sky-400/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
                                                >
                                                    {item.active ? "غیرفعال کن" : "فعال کن"}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteDiscount(item.code)}
                                                    className="min-h-11 cursor-pointer rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 text-xs font-bold text-rose-300 transition-colors hover:bg-rose-400/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60"
                                                >
                                                    حذف
                                                </button>
                                            </div>
                                        </article>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.section>
                )}

                {activeSection === "orders" && (
                    <>
                        <motion.section
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                            className="rounded-[24px] border border-white/10 bg-[#101311] p-4 sm:p-5"
                            aria-labelledby="orders-title"
                        >
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <div>
                                    <h2 id="orders-title" className="text-lg font-black text-white">سفارش‌ها</h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {filteredOrders.length.toLocaleString("fa-IR")} سفارش نمایش داده می‌شود
                                    </p>
                                </div>
                                <Filter className="h-5 w-5 text-slate-500" />
                            </div>

                            <div className="grid gap-3 xl:grid-cols-[minmax(280px,1fr)_auto_auto] xl:items-end">
                                <label className="block">
                                    <span className="mb-2 block text-xs font-bold text-slate-400">جستجو در سفارش‌ها</span>
                                    <div className="group relative">
                                        <Search className="pointer-events-none absolute inset-y-0 right-4 my-auto h-5 w-5 text-slate-500 transition-colors group-focus-within:text-emerald-400" />
                                        <input
                                            type="search"
                                            placeholder="جستجو نام، ایمیل، کد رهگیری..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="h-12 w-full rounded-xl border border-white/10 bg-[#151816] pr-12 pl-4 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                                        />
                                    </div>
                                </label>

                                <div>
                                    <span className="mb-2 block text-xs font-bold text-slate-400">پلن</span>
                                    <div className="grid grid-cols-3 gap-1 rounded-xl border border-white/10 bg-[#151816] p-1">
                                        {(["all", "individual", "family"] as const).map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setActiveFilter(type)}
                                                aria-pressed={activeFilter === type}
                                                className={`min-h-10 cursor-pointer whitespace-nowrap rounded-lg px-4 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 ${
                                                    activeFilter === type
                                                        ? "bg-white/10 text-white"
                                                        : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-300"
                                                }`}
                                            >
                                                {type === "all" ? "همه" : type === "individual" ? "شخصی" : "فمیلی"}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <span className="mb-2 block text-xs font-bold text-slate-400">وضعیت</span>
                                    <div className="grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-[#151816] p-1 sm:grid-cols-4">
                                        {[
                                            { key: "all" as const, label: "همه" },
                                            { key: "legacy" as const, label: "قدیمی" },
                                            { key: "processing" as const, label: "در حال پردازش" },
                                            { key: "completed" as const, label: "تکمیل شده" },
                                        ].map(({ key, label }) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setStatusFilter(key)}
                                                aria-pressed={statusFilter === key}
                                                className={`min-h-10 cursor-pointer whitespace-nowrap rounded-lg px-3 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 ${
                                                    statusFilter === key
                                                        ? "bg-white/10 text-white"
                                                        : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-300"
                                                }`}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                {/* ─── لیست سفارشات ─── */}
                {filteredOrders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="rounded-[28px] border border-dashed border-white/10 bg-[#101311] py-24 text-center"
                    >
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                            <Search className="h-7 w-7 text-slate-500" />
                        </div>
                        <h3 className="mb-2 text-lg font-bold text-slate-300">نتیجه‌ای یافت نشد!</h3>
                        <p className="text-sm text-slate-500">سفارشی با این مشخصات در سیستم ثبت نشده است.</p>
                    </motion.div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
                        <AnimatePresence mode="popLayout">
                            {filteredOrders.map((order) => {
                                const isFamily = order.planType === "family";
                                const themeColor = isFamily ? "text-emerald-400" : "text-spotify-light";
                                const bgGradient = isFamily
                                    ? "from-emerald-500/10 to-transparent"
                                    : "from-spotify/10 to-transparent";
                                const borderTheme = isFamily ? "border-emerald-500/20" : "border-spotify/20";
                                const ProductIcon = isFamily ? Users : User;
                                const status = getStatusMeta(order.status);
                                const receiptOpen = expandedReceipt === order.id;
                                const hasDiscount = (order.discountAmount || 0) > 0;

                                return (
                                    <motion.div
                                        key={order.id}
                                        layout
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        transition={{ duration: 0.24 }}
                                        className="group flex self-start flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#101311] transition-colors duration-200 hover:border-white/20"
                                    >
                                        <div
                                            className={`relative flex flex-col gap-3 border-b bg-gradient-to-l p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 ${bgGradient} ${borderTheme}`}
                                        >
                                            <div className="relative z-10 flex min-w-0 items-center gap-3">
                                                <div
                                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/25 ${themeColor}`}
                                                >
                                                    <ProductIcon className="w-5 h-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="block truncate text-[11px] font-bold tracking-wider text-slate-400 mb-0.5" dir="ltr">
                                                        ID: {(order.id || "").toUpperCase()}
                                                    </span>
                                                    <span className={`text-sm font-black ${themeColor}`}>
                                                        {isFamily ? "اسپاتیفای فمیلی" : "اسپاتیفای شخصی"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div
                                                className={`flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${status.color} ${status.bg} ${status.border}`}
                                            >
                                                {status.icon}
                                                {status.label}
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-4 p-4 sm:p-5">
                                            <div className="flex min-h-[104px] flex-col justify-center gap-4 rounded-2xl border border-white/8 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex min-w-0 items-center gap-2.5 text-sm font-medium text-slate-300">
                                                    <CreditCard className="h-4 w-4 shrink-0 text-slate-500" />
                                                    <span className="break-words font-bold">
                                                        {order.planTitle || `${order.durationMonths || "?"} ماه`}
                                                    </span>
                                                </div>

                                                <div className="flex min-h-[62px] flex-col items-end justify-center gap-1">
                                                    {hasDiscount ? (
                                                        <>
                                                            <div className="text-[11px] text-slate-400 line-through">
                                                                {(
                                                                    (order.originalPrice ?? order.price) ||
                                                                    0
                                                                ).toLocaleString("fa-IR")}{" "}
                                                                تومان
                                                            </div>
                                                            <div className="font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 text-sm">
                                                                {(
                                                                    (order.finalPrice ?? order.price) ||
                                                                    0
                                                                ).toLocaleString("fa-IR")}
                                                                <span className="text-[10px] text-slate-400 font-normal">
                                                                    {" "}
                                                                    تومان
                                                                </span>
                                                            </div>
                                                            <div className="text-[10px] text-emerald-400">
                                                                تخفیف {order.discountAmount?.toLocaleString("fa-IR")}{" "}
                                                                تومان
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="font-black text-white bg-store-card px-3 py-1 rounded-lg border border-store-border text-sm">
                                                            {(order.price || 0).toLocaleString("fa-IR")}
                                                            <span className="text-[10px] text-slate-400 font-normal">
                                                                {" "}
                                                                تومان
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                                {[
                                                    {
                                                        icon: <Clock className="h-4 w-4 text-slate-400" />,
                                                        label: "مدت زمان سفارش",
                                                        value: order.durationMonths
                                                            ? `${order.durationMonths.toLocaleString("fa-IR")} ماه`
                                                            : "ثبت نشده",
                                                        dir: "rtl",
                                                    },
                                                    {
                                                        icon: <User className="h-4 w-4 text-slate-400" />,
                                                        label: "نام و نام خانوادگی",
                                                        value: order.fullNameEn,
                                                        dir: "ltr",
                                                    },
                                                    {
                                                        icon: <Mail className="h-4 w-4 text-spotify-light" />,
                                                        label: "ایمیل اسپاتیفای",
                                                        value: order.spotifyEmail,
                                                        dir: "ltr",
                                                    },
                                                    {
                                                        icon: <Calendar className="h-4 w-4 text-slate-400" />,
                                                        label: "تاریخ تولد",
                                                        value: order.dateOfBirth,
                                                        dir: "ltr",
                                                    },
                                                    {
                                                        icon: <Lock className="h-4 w-4 text-slate-400" />,
                                                        label: "رمز عبور",
                                                        value: order.password || "بدون رمز",
                                                        dir: "ltr",
                                                    },
                                                    {
                                                        icon: <Hash className="h-4 w-4 text-slate-400" />,
                                                        label: "کد تخفیف",
                                                        value: order.couponCode || "بدون کد تخفیف",
                                                        dir: "rtl",
                                                    },
                                                    {
                                                        icon: <Users className="h-4 w-4 text-slate-400" />,
                                                        label: "جنسیت",
                                                        value: order.gender === "man" ? "آقا" : order.gender === "woman" ? "خانم" : order.gender,
                                                        dir: "rtl",
                                                    },
                                                ].map(({ icon, label, value, dir }) => (
                                                    <div key={label} className="flex min-w-0 items-center gap-3 rounded-xl border border-white/5 bg-white/[0.025] p-3">
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-black/20">
                                                            {icon}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="mb-1 text-[10px] font-medium text-slate-500">{label}</p>
                                                            <p className="break-all text-[13px] font-medium text-slate-200" dir={dir as "rtl" | "ltr"}>
                                                                {value || "ثبت نشده"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {order.receipt ? (
                                                <div className="rounded-2xl border border-blue-500/20 overflow-hidden">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setExpandedReceipt(receiptOpen ? null : order.id)
                                                        }
                                                        aria-expanded={receiptOpen}
                                                        className="flex min-h-11 w-full cursor-pointer items-center justify-between bg-blue-500/10 px-4 py-3 text-xs font-bold text-blue-300 transition-colors hover:bg-blue-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400/60"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Banknote className="w-4 h-4" />
                                                            رسید پرداخت ثبت شده
                                                        </div>
                                                        {receiptOpen ? (
                                                            <ChevronUp className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4" />
                                                        )}
                                                    </button>

                                                    <AnimatePresence>
                                                        {receiptOpen && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.25 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="px-4 py-3 space-y-2.5 bg-store-base border-t border-blue-500/10">
                                                                    {[
                                                                        {
                                                                            icon: (
                                                                                <User className="w-3.5 h-3.5 text-blue-400" />
                                                                            ),
                                                                            label: "نام واریزکننده",
                                                                            value: order.receipt.payerName,
                                                                        },
                                                                        {
                                                                            icon: (
                                                                                <Hash className="w-3.5 h-3.5 text-blue-400" />
                                                                            ),
                                                                            label: "کد رهگیری",
                                                                            value: order.receipt.trackingCode,
                                                                        },
                                                                        {
                                                                            icon: (
                                                                                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                                                                            ),
                                                                            label: "بانک مبدأ",
                                                                            value: `بانک ${order.receipt.sourceBank}`,
                                                                        },
                                                                        {
                                                                            icon: (
                                                                                <Clock className="w-3.5 h-3.5 text-slate-500" />
                                                                            ),
                                                                            label: "زمان ثبت",
                                                                            value: parseDateSafe(
                                                                                order.receipt.submittedAt,
                                                                            ),
                                                                        },
                                                                    ].map(({ icon, label, value }) => (
                                                                        <div
                                                                            key={label}
                                                                            className="flex items-start gap-2.5 text-xs"
                                                                        >
                                                                            <div className="w-6 h-6 rounded-lg bg-store-card flex items-center justify-center border border-store-border shrink-0 mt-0.5">
                                                                                {icon}
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-slate-500 text-[10px]">
                                                                                    {label}
                                                                                </p>
                                                                                <p className="text-slate-200 font-medium">
                                                                                    {value}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-store-border bg-store-base text-slate-500 text-xs">
                                                    <Banknote className="w-4 h-4" />
                                                    هنوز رسید پرداخت ثبت نشده
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-3 border-t border-white/8 bg-black/20 px-4 py-4">
                                            <div className="flex gap-1.5 flex-wrap">
                                                {order.status !== "processing" && order.status !== "completed" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusUpdate(order.id, "processing")}
                                                        disabled={isUpdating === order.id}
                                                        className="flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 text-xs font-bold text-violet-300 transition-colors hover:bg-violet-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 disabled:opacity-50"
                                                    >
                                                        {isUpdating === order.id ? (
                                                            <span className="w-3.5 h-3.5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <Clock className="w-3.5 h-3.5" />
                                                        )}
                                                        در حال پردازش
                                                    </button>
                                                )}

                                                {order.status !== "completed" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusUpdate(order.id, "completed")}
                                                        disabled={isUpdating === order.id}
                                                        className="flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 disabled:opacity-50"
                                                    >
                                                        {isUpdating === order.id ? (
                                                            <span className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                        )}
                                                        تأیید پرداخت
                                                    </button>
                                                )}

                                                {order.status === "completed" && (
                                                    <div className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-3 text-xs font-bold text-emerald-500/60">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        پرداخت تأیید شده
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{parseDateSafe(order.createdAt)}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(order.id)}
                                                    disabled={isDeleting === order.id}
                                                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-rose-400 transition-colors hover:bg-rose-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60 disabled:opacity-50"
                                                    title="حذف سفارش"
                                                    aria-label={`حذف سفارش ${order.id}`}
                                                >
                                                    {isDeleting === order.id ? (
                                                        <span className="w-3.5 h-3.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}
                    </>
                )}
            </div>
        </div>
    );
}
