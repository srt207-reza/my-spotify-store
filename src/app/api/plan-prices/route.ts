import { NextResponse } from "next/server";
import {
    readPlanPricing,
    validatePlanPricing,
    writePlanPricing,
} from "@/lib/planPricingStore";
import { hasValidAdminSecret } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const pricing = await readPlanPricing();

        return NextResponse.json(
            { success: true, pricing },
            { headers: { "Cache-Control": "no-store" } },
        );
    } catch (error) {
        console.error("Plan pricing GET error:", error);
        return NextResponse.json(
            { success: false, message: "خطا در دریافت قیمت پلن‌ها." },
            { status: 500 },
        );
    }
}

export async function PUT(req: Request) {
    try {
        if (!hasValidAdminSecret(req)) {
            return NextResponse.json(
                { success: false, message: "دسترسی غیرمجاز است." },
                { status: 401 },
            );
        }

        const data = await req.json();
        const pricing = validatePlanPricing(data?.pricing);

        if (!pricing) {
            return NextResponse.json(
                {
                    success: false,
                    message: "قیمت‌ها معتبر نیستند. قیمت قبل تخفیف باید مساوی یا بیشتر از قیمت نهایی باشد.",
                },
                { status: 400 },
            );
        }

        await writePlanPricing(pricing);

        return NextResponse.json({
            success: true,
            message: "قیمت پلن‌ها با موفقیت بروزرسانی شد.",
            pricing,
        });
    } catch (error) {
        console.error("Plan pricing PUT error:", error);
        return NextResponse.json(
            { success: false, message: "خطا در ذخیره قیمت پلن‌ها." },
            { status: 500 },
        );
    }
}
