import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "orders.json");

interface SpotifyOrder {
    id: string;
    spotifyEmail: string;
    password?: string;
    fullNameEn: string;
    dateOfBirth: string;
    gender?: string;
    planType: "individual" | "family";
    durationMonths: number;
    price: number;
    status: "pending_payment" | "awaiting_verification" | "processing" | "completed";
    // اطلاعات رسید پرداخت
    receipt?: {
        payerName: string;
        trackingCode: string;
        sourceBank: string;
        submittedAt: string;
    };
    createdAt: string;
}

async function readOrders(): Promise<SpotifyOrder[]> {
    try {
        const fileData = await fs.readFile(dataFilePath, "utf-8");
        return JSON.parse(fileData);
    } catch {
        return [];
    }
}

async function writeOrders(orders: SpotifyOrder[]): Promise<void> {
    await fs.writeFile(dataFilePath, JSON.stringify(orders, null, 2), "utf-8");
}

// ─── POST: ثبت سفارش جدید یا آپدیت رسید پرداخت ───
export async function POST(req: Request) {
    try {
        const data = await req.json();

        // ── حالت ۱: آپدیت رسید یک سفارش موجود ──
        if (data.orderId && data.payerName && data.trackingCode && data.sourceBank) {
            const orders = await readOrders();
            const idx = orders.findIndex((o) => o.id === data.orderId);

            if (idx === -1) {
                return NextResponse.json(
                    { success: false, message: "سفارشی با این شناسه یافت نشد." },
                    { status: 404 }
                );
            }

            orders[idx].receipt = {
                payerName: data.payerName,
                trackingCode: data.trackingCode,
                sourceBank: data.sourceBank,
                submittedAt: new Date().toISOString(),
            };
            orders[idx].status = "awaiting_verification";

            await writeOrders(orders);

            return NextResponse.json(
                { success: true, message: "رسید پرداخت با موفقیت ثبت شد." },
                { status: 200 }
            );
        }

        // ── حالت ۲: ثبت سفارش جدید ──
        if (!data.planType || !data.spotifyEmail || !data.fullNameEn || !data.dateOfBirth) {
            return NextResponse.json(
                { success: false, message: "اطلاعات ضروری ناقص است." },
                { status: 400 }
            );
        }

        const orders = await readOrders();

        const newOrder: SpotifyOrder = {
            id: `SPT-${Date.now().toString().slice(-6)}`,
            spotifyEmail: data.spotifyEmail,
            password: data.password || "",
            fullNameEn: data.fullNameEn,
            dateOfBirth: data.dateOfBirth,
            gender: data.gender || "",
            planType: data.planType,
            durationMonths: data.durationMonths || 1,
            price: data.price || 0,
            status: "pending_payment",
            createdAt: new Date().toISOString(),
        };

        orders.push(newOrder);
        await writeOrders(orders);

        return NextResponse.json(
            {
                success: true,
                orderId: newOrder.id,
                message: "سفارش با موفقیت ثبت شد.",
                supportLink: "https://t.me/getSpotify_Support",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Order API error:", error);
        return NextResponse.json(
            { success: false, message: "خطا در سرور" },
            { status: 500 }
        );
    }
}

// ─── PATCH: تغییر وضعیت سفارش توسط ادمین ───
export async function PATCH(req: Request) {
    try {
        const { id, status } = await req.json();

        const validStatuses = ["pending_payment", "awaiting_verification", "processing", "completed"];
        if (!id || !status || !validStatuses.includes(status)) {
            return NextResponse.json(
                { success: false, message: "اطلاعات نامعتبر است." },
                { status: 400 }
            );
        }

        const orders = await readOrders();
        const idx = orders.findIndex((o) => o.id === id);

        if (idx === -1) {
            return NextResponse.json(
                { success: false, message: "سفارشی با این شناسه یافت نشد." },
                { status: 404 }
            );
        }

        orders[idx].status = status;
        await writeOrders(orders);

        return NextResponse.json({ success: true, message: "وضعیت سفارش بروزرسانی شد." });
    } catch (error) {
        console.error("PATCH error:", error);
        return NextResponse.json({ success: false, message: "خطا در سرور" }, { status: 500 });
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
                { status: 400 }
            );
        }

        const orders = await readOrders();
        const filtered = orders.filter((o) => o.id !== id);

        if (filtered.length === orders.length) {
            return NextResponse.json(
                { success: false, message: "سفارشی با این شناسه یافت نشد." },
                { status: 404 }
            );
        }

        await writeOrders(filtered);
        return NextResponse.json({ success: true, message: "سفارش با موفقیت حذف شد." });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ success: false, message: "خطا در حذف سفارش" }, { status: 500 });
    }
}