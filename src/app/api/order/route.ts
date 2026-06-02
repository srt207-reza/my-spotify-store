import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "orders.json");
const discountFilePath = path.join(process.cwd(), "discount-codes.json");

type OrderStatus = "pending_payment" | "awaiting_verification" | "processing" | "completed";
type PlanType = "individual" | "family";
type DiscountType = "percent" | "fixed";

interface SpotifyOrderReceipt {
    payerName: string;
    trackingCode: string;
    sourceBank: string;
    submittedAt: string;
}

interface DiscountCode {
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
}

interface SpotifyOrder {
    id: string;
    spotifyEmail: string;
    password?: string;
    fullNameEn: string;
    dateOfBirth: string;
    gender?: string;
    planType: PlanType;
    durationMonths: number;
    price: number;
    status: OrderStatus;
    receipt?: SpotifyOrderReceipt;
    createdAt: string;

    // فیلدهای اختیاری برای import / export
    planId?: string;
    planTitle?: string;
    importedFromExcel?: boolean;

    // فیلدهای تخفیف
    originalPrice?: number;
    discountAmount?: number;
    couponCode?: string;
    finalPrice?: number;
}

type CreateOrderPayload = {
    planType?: PlanType;
    durationMonths?: number;
    spotifyEmail?: string;
    password?: string;
    fullNameEn?: string;
    dateOfBirth?: string;
    gender?: string;
    price?: number;
    planId?: string;
    planTitle?: string;
    couponCode?: string;
    receipt?: {
        payerName?: string;
        trackingCode?: string;
        sourceBank?: string;
        submittedAt?: string;
    };
};

type ImportPayloadRow = Partial<SpotifyOrder> & {
    receipt?: Partial<SpotifyOrderReceipt>;
};

const VALID_STATUSES: OrderStatus[] = [
    "pending_payment",
    "awaiting_verification",
    "processing",
    "completed",
];

function normalizeText(value: unknown): string {
    if (typeof value === "string") return value.trim();
    if (value === null || value === undefined) return "";
    return String(value).trim();
}

function normalizePlanType(value: unknown): PlanType | null {
    const v = normalizeText(value).toLowerCase();

    if (
        v === "family" ||
        v === "f" ||
        v === "فمیلی" ||
        v === "خانوادگی" ||
        v.includes("family") ||
        v.includes("فمیلی")
    ) {
        return "family";
    }

    if (
        v === "individual" ||
        v === "i" ||
        v === "شخصی" ||
        v.includes("individual") ||
        v.includes("شخصی")
    ) {
        return "individual";
    }

    return null;
}

function normalizeStatus(value: unknown): OrderStatus {
    const v = normalizeText(value).toLowerCase();

    if (v === "completed" || v.includes("تکمیل")) {
        return "completed";
    }

    if (v === "processing" || v.includes("پردازش")) {
        return "processing";
    }

    if (
        v === "awaiting_verification" ||
        v.includes("تأیید") ||
        v.includes("تایید") ||
        v.includes("بررسی")
    ) {
        return "awaiting_verification";
    }

    return "pending_payment";
}

function normalizeSourceBank(value: unknown): string {
    return normalizeText(value).replace(/^بانک\s+/g, "").trim();
}

function normalizeCouponCode(value: unknown): string {
    return normalizeText(value).replace(/\s+/g, "").toUpperCase();
}

function generateOrderId(): string {
    const ts = Date.now().toString(36).slice(-4).toUpperCase();
    const rnd = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SP-${ts}${rnd}`; // مثال: M8K4X7P2
}

function isExpired(expiresAt?: string): boolean {
    if (!expiresAt) return false;
    const d = new Date(expiresAt);
    if (Number.isNaN(d.getTime())) return false;
    return d.getTime() < Date.now();
}

async function readOrders(): Promise<SpotifyOrder[]> {
    try {
        const fileData = await fs.readFile(dataFilePath, "utf-8");
        const parsed = JSON.parse(fileData);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

async function writeOrders(orders: SpotifyOrder[]): Promise<void> {
    await fs.writeFile(dataFilePath, JSON.stringify(orders, null, 2), "utf-8");
}

async function readDiscountCodes(): Promise<DiscountCode[]> {
    try {
        const fileData = await fs.readFile(discountFilePath, "utf-8");
        const parsed = JSON.parse(fileData);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

async function writeDiscountCodes(codes: DiscountCode[]): Promise<void> {
    await fs.writeFile(discountFilePath, JSON.stringify(codes, null, 2), "utf-8");
}

function hasCreateOrderFields(data: CreateOrderPayload): boolean {
    return Boolean(data.planType && data.spotifyEmail && data.fullNameEn && data.dateOfBirth);
}

function buildReceipt(receipt?: CreateOrderPayload["receipt"]): SpotifyOrderReceipt | undefined {
    if (!receipt) return undefined;

    const payerName = normalizeText(receipt.payerName);
    const trackingCode = normalizeText(receipt.trackingCode);
    const sourceBank = normalizeSourceBank(receipt.sourceBank);

    if (!payerName || !trackingCode || !sourceBank) return undefined;

    return {
        payerName,
        trackingCode,
        sourceBank,
        submittedAt: normalizeText(receipt.submittedAt) || new Date().toISOString(),
    };
}

function sanitizeNewOrderPayload(data: CreateOrderPayload) {
    const planType = normalizePlanType(data.planType);
    if (!planType) return null;

    const receipt = buildReceipt(data.receipt);

    return {
        planType,
        durationMonths: Number(data.durationMonths ?? 0) || 0,
        spotifyEmail: normalizeText(data.spotifyEmail),
        password: normalizeText(data.password),
        fullNameEn: normalizeText(data.fullNameEn),
        dateOfBirth: normalizeText(data.dateOfBirth),
        gender: normalizeText(data.gender),
        price: Number(data.price ?? 0) || 0,
        planId: normalizeText(data.planId),
        planTitle: normalizeText(data.planTitle),
        couponCode: normalizeCouponCode(data.couponCode),
        receipt,
    };
}

function upsertById(orders: SpotifyOrder[], nextOrder: SpotifyOrder): SpotifyOrder[] {
    const idx = orders.findIndex((o) => o.id === nextOrder.id);
    if (idx === -1) return [...orders, nextOrder];
    const cloned = [...orders];
    cloned[idx] = nextOrder;
    return cloned;
}

function applyDiscount(price: number, code: DiscountCode) {
    if (!code.active) {
        return { ok: false as const, message: "این کد تخفیف غیرفعال است." };
    }

    if (isExpired(code.expiresAt)) {
        return { ok: false as const, message: "این کد تخفیف منقضی شده است." };
    }

    if (typeof code.maxUses === "number" && code.usedCount >= code.maxUses) {
        return { ok: false as const, message: "این کد تخفیف دیگر قابل استفاده نیست." };
    }

    if (typeof code.minOrderAmount === "number" && price < code.minOrderAmount) {
        return { ok: false as const, message: "مبلغ سفارش برای این کد تخفیف کافی نیست." };
    }

    let discountAmount = 0;

    if (code.type === "percent") {
        discountAmount = Math.floor((price * code.value) / 100);
    } else {
        discountAmount = Math.floor(code.value);
    }

    discountAmount = Math.max(0, Math.min(discountAmount, price));

    return {
        ok: true as const,
        discountAmount,
        finalPrice: price - discountAmount,
    };
}

function normalizeImportedOrder(raw: ImportPayloadRow): SpotifyOrder | null {
    const id = normalizeText(raw.id) || generateOrderId();
    const planType = normalizePlanType(raw.planType);
    const email = normalizeText(raw.spotifyEmail);
    const fullNameEn = normalizeText(raw.fullNameEn);
    const dateOfBirth = normalizeText(raw.dateOfBirth);

    if (!planType || !email || !fullNameEn || !dateOfBirth) {
        return null;
    }

    const status = normalizeStatus(raw.status);
    const receiptRaw = (raw.receipt ?? {}) as Partial<SpotifyOrderReceipt>;

    const receipt =
        normalizeText(receiptRaw.payerName) &&
        normalizeText(receiptRaw.trackingCode) &&
        normalizeSourceBank(receiptRaw.sourceBank)
            ? {
                  payerName: normalizeText(receiptRaw.payerName),
                  trackingCode: normalizeText(receiptRaw.trackingCode),
                  sourceBank: normalizeSourceBank(receiptRaw.sourceBank),
                  submittedAt: normalizeText(receiptRaw.submittedAt) || new Date().toISOString(),
              }
            : undefined;

    const originalPrice =
        Number(raw.originalPrice ?? 0) ||
        Number(raw.price ?? 0) ||
        0;

    const discountAmount = Number(raw.discountAmount ?? 0) || 0;
    const finalPrice =
        Number(raw.finalPrice ?? 0) ||
        (discountAmount > 0 ? Math.max(0, originalPrice - discountAmount) : originalPrice);

    return {
        id,
        spotifyEmail: email,
        password: normalizeText(raw.password),
        fullNameEn,
        dateOfBirth,
        gender: normalizeText(raw.gender),
        planType,
        durationMonths: Number(raw.durationMonths ?? 0) || 0,
        price: finalPrice,
        originalPrice: originalPrice || finalPrice,
        discountAmount,
        couponCode: normalizeCouponCode(raw.couponCode),
        finalPrice,
        status,
        receipt,
        createdAt: normalizeText(raw.createdAt) || new Date().toISOString(),
        planId: normalizeText(raw.planId),
        planTitle: normalizeText(raw.planTitle),
        importedFromExcel: true,
    };
}

// ─────────────────────────────────────────────────────────────
// POST
// 1) ثبت سفارش جدید همراه رسید
// 2) آپلود/Import اکسل
// 3) آپدیت رسید سفارش قدیمی با orderId (برای سازگاری)
// ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
    try {
        const data = await req.json();
        const orders = await readOrders();

        // ── حالت Import اکسل ──
        if (data?.action === "import") {
            const rows: ImportPayloadRow[] = Array.isArray(data.orders) ? data.orders : [];

            if (rows.length === 0) {
                return NextResponse.json(
                    { success: false, message: "هیچ ردیفی برای وارد کردن ارسال نشده است." },
                    { status: 400 },
                );
            }

            const imported: SpotifyOrder[] = [];
            let skippedCount = 0;

            for (const row of rows) {
                const normalized = normalizeImportedOrder(row);
                if (!normalized) {
                    skippedCount += 1;
                    continue;
                }

                imported.push(normalized);
            }

            if (imported.length === 0) {
                return NextResponse.json(
                    { success: false, message: "هیچ ردیف معتبری برای ورود پیدا نشد." },
                    { status: 400 },
                );
            }

            let nextOrders = [...orders];
            for (const item of imported) {
                nextOrders = upsertById(nextOrders, item);
            }

            await writeOrders(nextOrders);

            return NextResponse.json(
                {
                    success: true,
                    message: "فایل اکسل با موفقیت وارد شد.",
                    importedCount: imported.length,
                    skippedCount,
                },
                { status: 200 },
            );
        }

        // ── حالت سازگاری: آپدیت رسید یک سفارش موجود ──
        if (data?.orderId && (data?.receipt || (data?.payerName && data?.trackingCode && data?.sourceBank))) {
            const idx = orders.findIndex((o) => o.id === data.orderId);

            if (idx === -1) {
                return NextResponse.json(
                    { success: false, message: "سفارشی با این شناسه یافت نشد." },
                    { status: 404 },
                );
            }

            const receipt = buildReceipt(
                data.receipt || {
                    payerName: data.payerName,
                    trackingCode: data.trackingCode,
                    sourceBank: data.sourceBank,
                    submittedAt: data.submittedAt,
                },
            );

            if (!receipt) {
                return NextResponse.json(
                    { success: false, message: "اطلاعات رسید معتبر نیست." },
                    { status: 400 },
                );
            }

            orders[idx] = {
                ...orders[idx],
                receipt,
                status: "processing",
            };

            await writeOrders(orders);

            return NextResponse.json(
                { success: true, message: "رسید پرداخت با موفقیت ثبت شد." },
                { status: 200 },
            );
        }

        // ── حالت ثبت سفارش جدید ──
        if (!hasCreateOrderFields(data)) {
            return NextResponse.json(
                { success: false, message: "اطلاعات ضروری ناقص است." },
                { status: 400 },
            );
        }

        const normalized = sanitizeNewOrderPayload(data);
        if (!normalized) {
            return NextResponse.json(
                { success: false, message: "نوع پلن نامعتبر است." },
                { status: 400 },
            );
        }

        const originalPrice = normalized.price || 0;
        let discountAmount = 0;
        let finalPrice = originalPrice;
        let appliedCouponCode: string | undefined;

        const couponCode = normalizeCouponCode(data.couponCode);

        if (couponCode) {
            const discountCodes = await readDiscountCodes();
            const matched = discountCodes.find((item) => item.code.toUpperCase() === couponCode);

            if (!matched) {
                return NextResponse.json(
                    { success: false, message: "کد تخفیف معتبر نیست." },
                    { status: 400 },
                );
            }

            const result = applyDiscount(originalPrice, matched);

            if (!result.ok) {
                return NextResponse.json(
                    { success: false, message: result.message },
                    { status: 400 },
                );
            }

            discountAmount = result.discountAmount;
            finalPrice = result.finalPrice;
            appliedCouponCode = matched.code;

            matched.usedCount += 1;
            matched.updatedAt = new Date().toISOString();
            await writeDiscountCodes(discountCodes);
        }

        const newOrder: SpotifyOrder = {
            id: generateOrderId(),
            spotifyEmail: normalized.spotifyEmail,
            password: normalized.password || "",
            fullNameEn: normalized.fullNameEn,
            dateOfBirth: normalized.dateOfBirth,
            gender: normalized.gender || "",
            planType: normalized.planType,
            durationMonths: normalized.durationMonths || 1,
            price: finalPrice,
            originalPrice,
            discountAmount,
            couponCode: appliedCouponCode,
            finalPrice,
            status: normalized.receipt ? "processing" : "pending_payment",
            receipt: normalized.receipt
                ? {
                      ...normalized.receipt,
                      submittedAt: normalized.receipt.submittedAt || new Date().toISOString(),
                  }
                : undefined,
            createdAt: new Date().toISOString(),
            planId: normalized.planId || undefined,
            planTitle: normalized.planTitle || undefined,
        };

        orders.push(newOrder);
        await writeOrders(orders);

        return NextResponse.json(
            {
                success: true,
                orderId: newOrder.id,
                message: couponCode
                    ? "سفارش با موفقیت ثبت شد و تخفیف اعمال شد."
                    : "سفارش با موفقیت ثبت شد.",
                supportLink: "https://t.me/getSpotify_Support",
                originalPrice,
                discountAmount,
                finalPrice,
                couponCode: appliedCouponCode,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Order API error:", error);
        return NextResponse.json(
            { success: false, message: "خطا در سرور" },
            { status: 500 },
        );
    }
}

// ─── PATCH: تغییر وضعیت سفارش توسط ادمین ───
export async function PATCH(req: Request) {
    try {
        const { id, status } = await req.json();

        if (!id || !status || !VALID_STATUSES.includes(status)) {
            return NextResponse.json(
                { success: false, message: "اطلاعات نامعتبر است." },
                { status: 400 },
            );
        }

        const orders = await readOrders();
        const idx = orders.findIndex((o) => o.id === id);

        if (idx === -1) {
            return NextResponse.json(
                { success: false, message: "سفارشی با این شناسه یافت نشد." },
                { status: 404 },
            );
        }

        orders[idx].status = status;
        await writeOrders(orders);

        return NextResponse.json({ success: true, message: "وضعیت سفارش بروزرسانی شد." });
    } catch (error) {
        console.error("PATCH error:", error);
        return NextResponse.json(
            { success: false, message: "خطا در سرور" },
            { status: 500 },
        );
    }
}

// ─── DELETE: حذف سفارش ───
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, message: "شناسه سفارش ارسال نشده است." },
                { status: 400 },
            );
        }

        const orders = await readOrders();
        const filtered = orders.filter((o) => o.id !== id);

        if (filtered.length === orders.length) {
            return NextResponse.json(
                { success: false, message: "سفارشی با این شناسه یافت نشد." },
                { status: 404 },
            );
        }

        await writeOrders(filtered);
        return NextResponse.json({ success: true, message: "سفارش با موفقیت حذف شد." });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json(
            { success: false, message: "خطا در حذف سفارش" },
            { status: 500 },
        );
    }
}