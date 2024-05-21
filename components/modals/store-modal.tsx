"use client";


import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";

export const StoreModal = () => {
    const {isOpen, onOpen, onClose} = useStoreModal();
    return (
        <Modal
            title="Create Store"
            description="Add new store to manage products and categories"
            isOpen={isOpen}
            onClose={onClose}
            >
                Future Create Store Form
            </Modal>
    )
}