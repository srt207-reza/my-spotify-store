import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import OrderForm from "@/components/order/OrderForm";

export default function OrderPage() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center py-10">
            <Suspense
                fallback={
                    <div className="flex justify-center items-center">
                        <Loader2 className="w-10 h-10 animate-spin text-[#1ED760]" />
                    </div>
                }
            >
                <OrderForm />
            </Suspense>
        </div>
    );
}
