'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
    showText?: boolean
    size?: 'sm' | 'md' | 'lg'
    className?: string
    href?: string
}

const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
}

const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
}

export function Logo({ showText = true, size = 'md', className, href = '/' }: LogoProps) {
    const content = (
        <div className={cn("flex items-center gap-2.5 group", className)}>
            {/* Brain Logo Image */}
            <div
                className={cn(
                    "relative rounded-xl overflow-hidden shadow-lg group-hover:scale-110 group-hover:shadow-cyan-500/30 transition-all duration-300",
                    sizeClasses[size]
                )}
            >
                <Image
                    src="/logo.png"
                    alt="გონი - Brain Logo"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 to-amber-400/0 group-hover:from-cyan-400/20 group-hover:to-amber-400/10 transition-all duration-300" />
            </div>

            {/* Text */}
            {showText && (
                <span
                    className={cn(
                        "font-black tracking-tight transition-all duration-300 georgian-heading text-white group-hover:text-cyan-400",
                        textSizeClasses[size]
                    )}
                >
                    გონი
                </span>
            )}
        </div>
    )

    if (href) {
        return (
            <Link href={href} className="flex items-center">
                {content}
            </Link>
        )
    }

    return content
}
