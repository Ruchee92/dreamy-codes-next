"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ImageOff } from 'lucide-react';

interface AboutImageProps {
    src: string;
    alt: string;
    className?: string;
}

export default function AboutImage({ src, alt, className = '' }: AboutImageProps) {
    const [error, setError] = useState(false);

    // Fallback to ensuring https
    const secureSrc = src.startsWith('http://') ? src.replace('http://', 'https://') : src;

    return (
        <div className={`relative overflow-hidden bg-gray-100 flex items-center justify-center ${className}`}>
            {!error ? (
                <motion.img
                    initial={{ opacity: 0, scale: 1.05 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    src={secureSrc}
                    alt={alt}
                    className="w-full h-full object-cover"
                    onError={() => setError(true)}
                    referrerPolicy="no-referrer"
                />
            ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 p-8 space-y-4">
                    <ImageOff size={48} strokeWidth={1} />
                    <span className="font-display font-bold uppercase tracking-widest text-xs text-center border border-gray-200 px-4 py-2">
                        Image Unavailable
                    </span>
                </div>
            )}
        </div>
    );
}
