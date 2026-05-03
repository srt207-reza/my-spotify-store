import type { Plan, PlanType } from "./orderTypes";

export const PRICING: Record<PlanType, Plan[]> = {
    individual: [
        {
            id: "ind-1m",
            durationMonths: 1,
            title: "اشتراک ۱ ماهه",
            price: 555000,
            desc: "تجربه موسیقی بدون مرز (تحویل سریع)",
        },
        {
            id: "ind-3m",
            durationMonths: 3,
            title: "اشتراک ۳ ماهه",
            price: 1555000,
            desc: "پکیج سه ماهه شخصی",
        },
        {
            id: "ind-6m",
            durationMonths: 6,
            title: "اشتراک ۶ ماهه",
            price: 2999000,
            desc: "پکیج شش ماهه شخصی",
        },
        {
            id: "ind-12m",
            durationMonths: 12,
            title: "اشتراک ۱۲ ماهه",
            price: 4999000,
            desc: "بهترین انتخاب برای مصرف مداوم",
        },
    ],
    family: [
        {
            id: "fam-6m",
            durationMonths: 6,
            title: "اشتراک ۶ ماهه",
            price: 1660000,
            desc: "اقتصادی‌ترین انتخاب (عضویت در فمیلی)",
        },
        {
            id: "fam-12m",
            durationMonths: 12,
            title: "اشتراک ۱۲ ماهه",
            price: 2660000,
            desc: "اقتصادی‌ترین انتخاب (عضویت در فمیلی)",
        },
    ],
};

export const PRODUCT_META: Record<
    PlanType,
    {
        title: string;
        subtitle: string;
        description: string;
        features: string[];
        color: string;
        bgHover: string;
        buttonColor: string;
    }
> = {
    individual: {
        title: "طرح شخصی (Individual)",
        subtitle: "تجربه موسیقی بدون مرز و محدودیت",
        description:
            "اکانت قانونی اسپاتیفای با فعال‌سازی روی ایمیل شخصی شما. حفظ کامل پلی‌لیست‌ها با تحویل سریع در کمتر از ۲۴ ساعت.",
        features: [
            "فعال‌سازی روی ایمیل شخصی شما",
            "حفظ پلی‌لیست‌ها و دیتای قبلی اکانت",
            "امکان دانلود و پخش آفلاین موسیقی",
            "قابل استفاده در تمامی دستگاه‌ها",
            "تحویل سریع در کمتر از ۲۴ ساعت",
        ],
        color: "from-green-500 to-emerald-400",
        bgHover: "hover:shadow-green-500/20",
        buttonColor: "bg-green-500 hover:bg-green-400",
    },
    family: {
        title: "طرح فمیلی (Family)",
        subtitle: "اقتصادی‌ترین انتخاب برای شما",
        description:
            "طرحی بسیار مقرون‌به‌صرفه در بسته‌های ۶ و ۱۲ ماهه. مناسب برای کاربرانی که در سال جاری محدودیت عضویت فمیلی (دو بار در سال) ندارند.",
        features: [
            "قیمت بسیار اقتصادی و مقرون‌به‌صرفه",
            "ارائه در پلن‌های طولانی ۶ و ۱۲ ماهه",
            "بدون قطعی و تضمین پایداری اشتراک",
            "پرداخت قانونی روی ریجن‌های معتبر",
            "پشتیبانی تا آخرین روز اشتراک",
        ],
        color: "from-emerald-500 to-green-400",
        bgHover: "hover:shadow-emerald-500/20",
        buttonColor: "bg-emerald-500 hover:bg-emerald-400",
    },
};

export const GENDER_OPTIONS = [
    { value: "man" as const, label: "Man" },
    { value: "woman" as const, label: "Woman" },
    { value: "non-binary" as const, label: "Non-binary" },
    { value: "something-else" as const, label: "Something else" },
    { value: "prefer-not-to-say" as const, label: "Prefer not to say" },
];