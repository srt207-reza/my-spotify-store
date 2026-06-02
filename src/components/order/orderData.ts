import type { Plan, PlanType } from "./orderTypes";

const planPrefix: Record<PlanType, string> = {
    individual: "طرح شخصی",
    family: "طرح گروهی",
};

const makeTitle = (type: PlanType, months: number) =>
    `${planPrefix[type]} ${months.toLocaleString("fa-IR")} ماهه پرمیوم`;

export const PRICING: Record<PlanType, Plan[]> = {
    individual: [
        {
            id: "ind-1m",
            durationMonths: 1,
            title: makeTitle("individual", 1),
            price: 555000,
            disabled: false,
        },
        {
            id: "ind-3m",
            durationMonths: 3,
            title: makeTitle("individual", 3),
            price: 1555000,
            originalPrice: 1665000,
            disabled: false,
        },
        {
            id: "ind-6m",
            durationMonths: 6,
            title: makeTitle("individual", 6),
            price: 2999000,
            originalPrice: 3330000,
            disabled: true,
        },
        {
            id: "ind-12m",
            durationMonths: 12,
            title: makeTitle("individual", 12),
            price: 5555000,
            originalPrice: 6660000,
            disabled: false,
        },
    ],
    family: [
        {
            id: "fam-6m",
            durationMonths: 6,
            title: makeTitle("family", 6),
            price: 1990000,
            disabled: false,
        },
        {
            id: "fam-12m",
            durationMonths: 12,
            title: makeTitle("family", 12),
            price: 2990000,
            originalPrice: 3980000,
            disabled: false,
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
            "در فعال‌سازی طرح شخصی (Individual)، پرداخت به‌صورت مستقل روی حساب کاربری اسپاتیفای انجام می‌شود. بنابراین بدون محدودیت‌های طرح گروهی، فعال‌سازی این طرح روی تمامی حساب‌های کاربری اسپاتیفای امکان‌پذیر است.",
        features: [
            "حفظ کامل اطلاعات ذخیره‌شده در حساب کاربری",
            "پرداخت قانونی با استفاده از حساب‌های ارزی معتبر",
            "پرداخت قطعی و غیرقابل بازگشت",
            "محدودیت استفاده در آدرس اتصال اینترنتی (IP Address)",
            "فعال‌سازی در کمتر از ۲۴ ساعت",
        ],
        color: "from-green-500 to-emerald-400",
        bgHover: "hover:shadow-green-500/20",
        buttonColor: "bg-green-500 hover:bg-green-400",
    },
    family: {
        title: "طرح گروهی (Family)",
        subtitle: "اقتصادی‌ترین انتخاب برای شما",
        description:
            "در فعال‌سازی طرح گروهی (Family)، حساب کاربری اسپاتیفای به‌عنوان زیرمجموعه یک پرداخت گروهی عضو می‌شود و پرداخت کل اعضای گروه به‌صورت اشتراکی انجام می‌گیرد. مطابق محدودیت‌های اعمال‌شده از سوی اسپاتیفای، فعال‌سازی طرح گروهی بر روی هر حساب کاربری اسپاتیفای تنها دو مرتبه در طول یک سال امکان‌پذیر است. بنابراین این طرح با قیمت اقتصادی‌تر و در بسته‌های زمانی بلندمدت ارائه می‌شود.",
        features: [
            "قیمت اقتصادی",
            "بسته‌های بلندمدت اشتراک",
            "ضمانت جبران زمان باقی‌مانده از اعتبار اشتراک پرمیوم",
            "امکان انتقال اشتراک پرمیوم",
            "محدودیت استفاده در آدرس اتصال اینترنتی (IP Address)",
            "فعال‌سازی در کمتر از ۲۴ ساعت",
        ],
        color: "from-emerald-500 to-green-400",
        bgHover: "hover:shadow-emerald-500/20",
        buttonColor: "bg-emerald-500 hover:bg-emerald-400",
    },
};

export const GENDER_OPTIONS = [
    { value: "woman" as const, label: "خانم" },
    { value: "man" as const, label: "آقا" },
];