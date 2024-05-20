import { create } from "zustand";

interface useStoreModalInterface {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useStoreModal = create((set) =>({ //check video at 55:18 if errors occur because "create<useStoreModalStore>" was deprecated so instead i just created it
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false})
}))