"use client"

import { Toaster } from '@/components/ui/sonner'


export const ToastProvider = () => {
  return (
    <Toaster 
    richColors
    position="top-right"
    className='bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white shadow-lg'
    />
  )
}
