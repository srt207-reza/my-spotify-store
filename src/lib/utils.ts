import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * این تابع کلاس‌های تیلویند را با هم ترکیب می‌کند
 * و تداخل کلاس‌ها (مثلا دو رنگ پس‌زمینه همزمان) را به صورت هوشمند حل می‌کند.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
