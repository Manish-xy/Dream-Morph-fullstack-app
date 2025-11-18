"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReactBeforeSliderComponent from "react-before-after-slider-component";
import "react-before-after-slider-component/dist/build.css";
import { GenerateRoom } from "@/lib/generated/prisma";
import { Heart, Download, Trash2, Sparkles, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { format } from "date-fns";

interface DesignsGalleryProps {
  designs: GenerateRoom[];
  userId: string | null;
}

export const DesignsGallery = ({ designs, userId }: DesignsGalleryProps) => {
  const [filter, setFilter] = useState<"all" | "recent" | "popular">("all");

  // Filter designs based on selection
  const getFilteredDesigns = () => {
    let filtered = [...designs];

    if (filter === "recent") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filter === "popular") {
      filtered.sort((a, b) => b.favourites.length - a.favourites.length);
    }

    return filtered;
  };

  const filteredDesigns = getFilteredDesigns();

  if (designs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 space-y-6"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center"
        >
          <Sparkles className="w-12 h-12 text-white" />
        </motion.div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            No Designs Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            Start creating beautiful room designs with AI. Your masterpieces will
            appear here.
          </p>
        </div>
        <Button
          onClick={() => (window.location.href = "/dashboard")}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 rounded-full"
        >
          Create Your First Design
          <Sparkles className="ml-2 w-5 h-5" />
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header with Stats and Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div className="space-y-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            My Designs
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {designs.length} {designs.length === 1 ? "design" : "designs"} created
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
          {[
            { value: "all", label: "All" },
            { value: "recent", label: "Recent" },
            { value: "popular", label: "Popular" },
          ].map((item) => (
            <motion.button
              key={item.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(item.value as any)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                filter === item.value
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              {item.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Designs Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredDesigns.map((design, index) => (
            <DesignCard key={design.id} design={design} userId={userId} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
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
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(design.outputImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dream-morph-${design.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="relative overflow-hidden rounded-2xl shadow-lg border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 group">
        {/* Like Badge */}
        {design.favourites?.length > 0 && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
            className="absolute top-3 left-3 z-50 rounded-full bg-gradient-to-r from-pink-500 to-red-500 backdrop-blur-sm font-semibold text-white px-3 py-1.5 flex items-center gap-1.5 shadow-xl"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span className="text-sm font-bold">{design.favourites.length}</span>
          </motion.div>
        )}

        {/* Action Buttons */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute top-3 right-3 z-50 flex gap-2"
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  size="icon"
                  onClick={handleDownload}
                  className="rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 shadow-lg"
                  variant="ghost"
                >
                  <Download className="w-4 h-4 text-gray-800 dark:text-gray-200" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Slider */}
        <div className="aspect-square relative overflow-hidden">
          <ReactBeforeSliderComponent
            firstImage={{
              imageUrl: design?.uploadedImage || "https://placehold.co/512x512",
            }}
            secondImage={{
              imageUrl: design?.outputImage || "https://placehold.co/512x512",
            }}
          />
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: isHovered ? "auto" : 80 }}
          className="p-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 space-y-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-1">
              {design.roomStyle && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {design.roomStyle}
                  </span>
                </motion.div>
              )}
              {design.aiStyle && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-3 h-3 text-purple-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {design.aiStyle}
                  </span>
                </motion.div>
              )}
            </div>
          </div>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-2 border-t border-gray-200 dark:border-gray-800 space-y-2"
              >
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{format(new Date(design.createdAt), "MMM dd, yyyy")}</span>
                </div>
                {design.prompt && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {design.prompt}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Card>
    </motion.div>
  );
};
