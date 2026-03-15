"use server";

import { cookies } from "next/headers";

export async function setAuthCookie(token: string) {
    // در Next.js 15 به بعد، cookies() باید await شود
    const cookieStore = await cookies();
    
    cookieStore.set({
        name: "accessToken",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // انقضا: 30 روز
    });
}

export async function removeAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
}

// تابع جدید برای خواندن امن توکن توسط سرور اکشن
export async function getAuthCookie() {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    return token || null;
}
