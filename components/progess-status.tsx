"use client";

import React from "react";

type SizeVariant = "sm" | "md" | "lg" | "xl";

interface ProgressStatusProps {
    progress: number;
    size?: SizeVariant;
}

const sizeMap: Record<SizeVariant, string> = {
    sm: "size-20", // 80px
    md: "size-32", // 128px
    lg: "size-40", // 160px
    xl: "size-52", // 208px
};

export const ProgressStatus = ({
    progress,
    size = "md",
}: ProgressStatusProps) => {
    const clampedProgress = Math.min(
        100,
        Math.max(0, Number(progress.toFixed(2)))
    );

    const dashOffset = 100 - clampedProgress;

    return (
        <div className={`relative ${sizeMap[size]}`}>
            <svg
                className="size-full -rotate-90"
                viewBox="0 0 36 36"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                </defs>

                <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className="stroke-current text-gray-200 dark:text-neutral-700"
                    strokeWidth="2"
                />
                <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="url(#progress-gradient)"
                    strokeWidth="2"
                    strokeDasharray="100"
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    style={{
                        transition: "stroke-dashoffset 0.5s ease-in-out",
                    }}
                />

            </svg>

            <div className="absolute top-1/2 start-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="text-center text-xl font-bold text-blue-600 dark:text-blue-400">
                    {clampedProgress}%
                </span>
            </div>
        </div>
    );
};
