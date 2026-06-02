import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const discountFilePath = path.join(process.cwd(), "discount-codes.json");

type DiscountType = "percent" | "fixed";

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

type DiscountPayload = {
    code?: string;
    type?: DiscountType;
    value?: number;
    active?: boolean;
    maxUses?: number | string;
    minOrderAmount?: number | string;
    expiresAt?: string;
};

function normalizeText(value: unknown): string {
    if (typeof value === "string") return value.trim();
    if (value === null || value === undefined) return "";
    return String(value).trim();
}

function normalizeCode(value: unknown): string {
    return normalizeText(value).replace(/\s+/g, "").toUpperCase();
}

function parseNumber(value: unknown): number {
    const n = Number(normalizeText(value));
    return Number.isFinite(n) ? n : 0;
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

function normalizeDiscountType(value: unknown): DiscountType | null {
    const v = normalizeText(value).toLowerCase();
    if (v === "percent" || v === "percentage" || v === "درصدی") return "percent";
    if (v === "fixed" || v === "amount" || v === "مبلغی") return "fixed";
    return null;
}

function isExpired(expiresAt?: string): boolean {
    if (!expiresAt) return false;
    const d = new Date(expiresAt);
    return Number.isNaN(d.getTime()) ? false : d.getTime() < Date.now();
}

export async function GET() {
    try {
        const codes = await readDiscountCodes();
        return NextResponse.json({ success: true, codes });
    } catch {
        return NextResponse.json(
            { success: false, message: "خطا در خواندن کدهای تخفیف" },
            { status: 500 },
        );
    }
}

export async function POST(req: Request) {
    try {
        const data = (await req.json()) as DiscountPayload;

        const code = normalizeCode(data.code);
        const type = normalizeDiscountType(data.type);
        const value = parseNumber(data.value);

        if (!code || !type || value <= 0) {
            return NextResponse.json(
                { success: false, message: "اطلاعات کد تخفیف نامعتبر است." },
                { status: 400 },
            );
        }

        if (type === "percent" && (value < 1 || value > 100)) {
            return NextResponse.json(
                { success: false, message: "درصد تخفیف باید بین ۱ تا ۱۰۰ باشد." },
                { status: 400 },
            );
        }

        const codes = await readDiscountCodes();
        const exists = codes.find((item) => item.code === code);

        if (exists) {
            return NextResponse.json(
                { success: false, message: "این کد قبلاً ثبت شده است." },
                { status: 409 },
            );
        }

        const nextCode: DiscountCode = {
            code,
            type,
            value,
            active: data.active ?? true,
            maxUses:
                data.maxUses === undefined || data.maxUses === null || normalizeText(data.maxUses) === ""
                    ? undefined
                    : parseNumber(data.maxUses),
            minOrderAmount:
                data.minOrderAmount === undefined || data.minOrderAmount === null || normalizeText(data.minOrderAmount) === ""
                    ? undefined
                    : parseNumber(data.minOrderAmount),
            expiresAt: normalizeText(data.expiresAt) || undefined,
            usedCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        codes.unshift(nextCode);
        await writeDiscountCodes(codes);

        return NextResponse.json(
            { success: true, message: "کد تخفیف ثبت شد.", code: nextCode },
            { status: 201 },
        );
    } catch (error) {
        console.error("Discount POST error:", error);
        return NextResponse.json(
            { success: false, message: "خطا در ثبت کد تخفیف" },
            { status: 500 },
        );
    }
}

export async function PATCH(req: Request) {
    try {
        const data = (await req.json()) as { code?: string; active?: boolean };

        const code = normalizeCode(data.code);
        if (!code || typeof data.active !== "boolean") {
            return NextResponse.json(
                { success: false, message: "اطلاعات نامعتبر است." },
                { status: 400 },
            );
        }

        const codes = await readDiscountCodes();
        const idx = codes.findIndex((item) => item.code === code);

        if (idx === -1) {
            return NextResponse.json(
                { success: false, message: "کد تخفیف یافت نشد." },
                { status: 404 },
            );
        }

        codes[idx].active = data.active;
        codes[idx].updatedAt = new Date().toISOString();

        await writeDiscountCodes(codes);

        return NextResponse.json({ success: true, message: "وضعیت کد بروزرسانی شد." });
    } catch (error) {
        console.error("Discount PATCH error:", error);
        return NextResponse.json(
            { success: false, message: "خطا در بروزرسانی کد تخفیف" },
            { status: 500 },
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const code = normalizeCode(searchParams.get("code"));

        if (!code) {
            return NextResponse.json(
                { success: false, message: "کد ارسال نشده است." },
                { status: 400 },
            );
        }

        const codes = await readDiscountCodes();
        const filtered = codes.filter((item) => item.code !== code);

        if (filtered.length === codes.length) {
            return NextResponse.json(
                { success: false, message: "کد تخفیف یافت نشد." },
                { status: 404 },
            );
        }

        await writeDiscountCodes(filtered);
        return NextResponse.json({ success: true, message: "کد تخفیف حذف شد." });
    } catch (error) {
        console.error("Discount DELETE error:", error);
        return NextResponse.json(
            { success: false, message: "خطا در حذف کد تخفیف" },
            { status: 500 },
        );
    }
}