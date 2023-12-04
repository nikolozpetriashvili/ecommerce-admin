'use client'

import Modal from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import {useEffect} from 'react'

export default function SetupPage() {

  // const storeModal = useStoreModal(); we can use this or below 
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  //
  useEffect(() => {
    if(!isOpen){
      onOpen();
    }

  },[isOpen,onOpen])

  return (
    <div className="p-4">
      Root page
    </div>
  )
}