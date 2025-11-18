"use client"
import Image from 'next/image'
import React from 'react'
import Logo from '@/public/assets/svg/logo.svg'

export const LogoContainer = () => {
    return (
        <div className='flex items-center justify-center gap-2'>
            <Image
                src={Logo}
                alt='logo'
                className="w-auto h-8 min-md:h-12"
            />
            <p className="text-xl min-md:text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">Dream-Morph</p>
        </div>
    )
}

