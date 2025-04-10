"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useModal } from "@/context/ModalContext";


export default function ClientPaymentRedirectHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { openPurchaseModal } = useModal();

    useEffect(() => {
        const invId = searchParams.get("InvId");
        const outSum = searchParams.get("OutSum");
        const isSuccess = searchParams.get("IsSuccess");
        const status = searchParams.get("Status");
        console.log("Robokassa redirect detected", { invId, outSum, isSuccess, status });
        // Handle success
        if (invId && outSum && (isSuccess === "true" || status !== "fail")) {
            openPurchaseModal({
                showSuccessMessage: true,
                orderId: invId,
                price: outSum,
            });

            router.replace("/", { scroll: false });
            return;
        }

        // Handle failure
        if (isSuccess === "false" || status === "fail") {

            console.error("Payment failed");

            router.replace("/", { scroll: false });
        }
    }, [searchParams]);

    return null;
}
