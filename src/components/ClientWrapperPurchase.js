"use client";

import { usePurchaseModal } from "@/context/PurchaseContext"; // Replace with actual context
import PurchaseModal from "@/components/PurchaseModal";

const ClientWrapperPurchase = () => {
    const { isPurchaseModalOpen, closePurchaseModal } = usePurchaseModal();

    return <PurchaseModal isOpen={isPurchaseModalOpen} onClose={closePurchaseModal} />;
};

export default ClientWrapperPurchase;
