"use client";

import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";

const SetupPage = () => {
  const onOpen = useStoreModal();
  return (
    <div className="p-4">
        Root
    </div>
  );
}

export default SetupPage;