import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import OrderForm from "@/components/order/OrderForm";
import { readPlanPricing } from "@/lib/planPricingStore";

export const dynamic = "force-dynamic";

export default async function OrderPage() {
    const pricing = await readPlanPricing();

    return (
        <div className="min-h-[70vh] flex items-center justify-center pb-10">
            <Suspense
                fallback={
                    <div className="flex justify-center items-center">
                        <Loader2 className="w-10 h-10 animate-spin text-[#1ED760]" />
                    </div>
                }
            >
                <OrderForm initialPricing={pricing} />
            </Suspense>
        </div>
    );
}
