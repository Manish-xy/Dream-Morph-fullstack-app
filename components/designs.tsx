"use client";

import { Card } from "@/components/ui/card";
import ReactBeforeSliderComponent from 'react-before-after-slider-component';
import "react-before-after-slider-component/dist/build.css";
import { GenerateRoom } from "@/lib/generated/prisma";
import { Container } from "@/components/container";
import { Badge, Heart } from "lucide-react";
import { motion } from "framer-motion";

interface DesignsProps {
    designs: GenerateRoom[];
    isDesignPage?: boolean;
    userId: string | null;
}

export const Designs = ({
    designs,
    isDesignPage = false,
    userId,
}: DesignsProps) => {
    if (designs.length === 0) {
        return (
            <Container className="pb-40">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                >
                    <p className="text-2xl text-muted-foreground">
                        No designs yet. Create your first one!
                    </p>
                </motion.div>
            </Container>
        );
    }

    return (
        <Container className="pb-40 space-y-4">
            {isDesignPage && (
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xl text-muted-foreground font-bold tracking-wide"
                >
                    Your Designs
                </motion.h2>
            )}

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full grid grid-cols-1 min-md:grid-cols-3 gap-4"
            >
                {designs.map((design, index) => (
                    <DesignCard
                        key={design.id}
                        design={design}
                        userId={userId}
                        index={index}
                    />
                ))}
            </motion.div>
        </Container>
    );
};

const DesignCard = ({
    design,
    userId,
    index,
}: {
    design: GenerateRoom;
    userId: string | null;
    index: number;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
        >
            <Card className="p-2 rounded-md shadow-none border-input hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-700 gap-3 relative transition-all duration-300 overflow-hidden group">
                {design.favourites?.length > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 left-3 z-50 rounded-full bg-black/70 backdrop-blur-sm font-semibold text-white px-3 py-1 flex items-center gap-1.5 shadow-lg"
                    >
                        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                        <span className="text-sm">{design.favourites.length}</span>
                    </motion.div>
                )}

                {/* Hover overlay with design info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-4">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileHover={{ y: 0, opacity: 1 }}
                        className="text-white space-y-1"
                    >
                        {design.roomStyle && (
                            <p className="text-sm font-semibold">
                                Room: <span className="text-purple-300">{design.roomStyle}</span>
                            </p>
                        )}
                        {design.aiStyle && (
                            <p className="text-sm font-semibold">
                                Style: <span className="text-blue-300">{design.aiStyle}</span>
                            </p>
                        )}
                    </motion.div>
                </div>

                <div className="w-full aspect-square rounded-md overflow-hidden h-full">
                    <ReactBeforeSliderComponent
                        firstImage={{
                            imageUrl: design?.uploadedImage || "https://placehold.co/512x512",
                        }}
                        secondImage={{
                            imageUrl: design?.outputImage || "https://placehold.co/512x512",
                        }}
                    />
                </div>
            </Card>
        </motion.div>
    );
};
