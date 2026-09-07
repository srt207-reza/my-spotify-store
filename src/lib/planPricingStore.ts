import "server-only";

import fs from "fs/promises";
import path from "path";
import { PRICING, type PlanPricing } from "@/components/order/orderData";
import type { Plan, PlanType } from "@/components/order/orderTypes";

const pricingFilePath = path.join(process.cwd(), "plan-prices.json");
const PLAN_TYPES: PlanType[] = ["individual", "family"];

type StoredPlanPrice = {
    id?: unknown;
    price?: unknown;
    originalPrice?: unknown;
};

function isPositiveInteger(value: unknown): value is number {
    return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function cloneDefaultPlan(plan: Plan): Plan {
    return {
        ...plan,
        originalPrice: plan.originalPrice ?? plan.price,
    };
}

export function getDefaultPlanPricing(): PlanPricing {
    return {
        individual: PRICING.individual.map(cloneDefaultPlan),
        family: PRICING.family.map(cloneDefaultPlan),
    };
}

export function mergeStoredPlanPricing(value: unknown): PlanPricing {
    const defaults = getDefaultPlanPricing();
    const source = value && typeof value === "object" ? (value as Record<string, unknown>) : {};

    for (const planType of PLAN_TYPES) {
        const storedPlans = Array.isArray(source[planType]) ? (source[planType] as StoredPlanPrice[]) : [];

        defaults[planType] = defaults[planType].map((plan) => {
            const stored = storedPlans.find((item) => item && String(item.id ?? "") === plan.id);
            if (!stored || !isPositiveInteger(stored.price)) return plan;

            const originalPrice = isPositiveInteger(stored.originalPrice)
                ? Math.max(stored.originalPrice, stored.price)
                : Math.max(plan.originalPrice ?? plan.price, stored.price);

            return {
                ...plan,
                price: stored.price,
                originalPrice,
            };
        });
    }

    return defaults;
}

export function validatePlanPricing(value: unknown): PlanPricing | null {
    if (!value || typeof value !== "object") return null;

    const source = value as Record<string, unknown>;
    const defaults = getDefaultPlanPricing();
    const validated = getDefaultPlanPricing();

    for (const planType of PLAN_TYPES) {
        if (!Array.isArray(source[planType])) return null;

        const submittedPlans = source[planType] as StoredPlanPrice[];
        const nextPlans: Plan[] = [];

        for (const defaultPlan of defaults[planType]) {
            const submitted = submittedPlans.find(
                (item) => item && String(item.id ?? "") === defaultPlan.id,
            );

            if (
                !submitted ||
                !isPositiveInteger(submitted.price) ||
                !isPositiveInteger(submitted.originalPrice) ||
                submitted.originalPrice < submitted.price
            ) {
                return null;
            }

            nextPlans.push({
                ...defaultPlan,
                price: submitted.price,
                originalPrice: submitted.originalPrice,
            });
        }

        validated[planType] = nextPlans;
    }

    return validated;
}

export async function readPlanPricing(): Promise<PlanPricing> {
    try {
        const fileData = await fs.readFile(pricingFilePath, "utf-8");
        return mergeStoredPlanPricing(JSON.parse(fileData));
    } catch {
        return getDefaultPlanPricing();
    }
}

export async function writePlanPricing(pricing: PlanPricing): Promise<void> {
    const storedPricing = {
        individual: pricing.individual.map(({ id, price, originalPrice }) => ({
            id,
            price,
            originalPrice: originalPrice ?? price,
        })),
        family: pricing.family.map(({ id, price, originalPrice }) => ({
            id,
            price,
            originalPrice: originalPrice ?? price,
        })),
    };

    await fs.writeFile(pricingFilePath, JSON.stringify(storedPricing, null, 2), "utf-8");
}
