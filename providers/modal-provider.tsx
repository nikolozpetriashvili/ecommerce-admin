'use client'

import { StoreModal } from '@/components/modals/store-modal';
import {useEffect,useState} from 'react'

//01:00:30 
export const ModalProvider = () => {
  const [isMounted,setIsMounted] = useState(false);

  //until this lifecycle has run which is only something that can happen on client side we return null so there is not hydration error;
  useEffect(() => {
    setIsMounted(true)
  },[])

  if(!isMounted) {
    return null
  }

  return (
    <StoreModal/>
  )
}