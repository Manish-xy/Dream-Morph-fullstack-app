"use client"


import { useEffect, useState } from "react";
import { Filter, FilterX, Info, Loader, RefreshCcw, Save } from "lucide-react";
import ReactBeforeSliderComponent from 'react-before-after-slider-component';
import 'react-before-after-slider-component/dist/build.css';
import { CustomSelect } from "@/components/custom-select"
import { Textarea } from "@/components/ui/textarea";
import { aiStyles, roomStyles } from "@/lib/helper";
import { TooltipButton } from "./tool-tip-button";
import { ImageUploader } from "@/components/image-uploader";
import { ProgressStatus } from "@/components/progess-status";
import { toast } from "sonner";
import { generateFromHuggingFaceModel } from "@/actions/generate-from0hugging-face";
import { uploadToCloudinary } from "@/lib/upload-to-cloudinary";
import axios from "axios";
import { useRouter } from "next/dist/client/components/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface ClientProps {
    user: {
        id: string,
        fullName: string | null,
        imageUrl: string,
        email: string
    }
}


export const Client = ({ user }: ClientProps) => {

    const [room, setRoom] = useState<string | null>(null);
    const [aiStyle, setAiStyle] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>("");
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [outputImage, setOutputImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const router = useRouter();

    // Ensure particles only render on client side to avoid hydration mismatch
    useEffect(() => {
        setIsMounted(true);
    }, []);
    

    const handleRoomChange = (value: string) => {
        setRoom(value);
    };

    const handleAiStyleChange = (value: string) => {
        setAiStyle(value);
    };

    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(e.target.value);
    };

    const handleRoomReset = () => {
        setRoom(null);
    };

    const handleStyleReset = () => {
        setAiStyle(null);
    };

    const clearAllFilters = () => {
        if (uploadedImage && isSaving) {
            toast.warning(
                "Please delete the uploaded image before clearing filters."
            );
            return;
        }

        handleRoomReset();
        handleStyleReset();
        setPrompt("");
        setOutputImage(null);
        setUploadedImage(null);
        setProgress(0);
        setIsSaving(false); // Optional: reset saving state
    };

    const clearAfterSave = () => {
        setUploadedImage(null);
        setOutputImage(null);
        setPrompt("");
        setRoom(null);
        setAiStyle(null);
        setProgress(0);
        setIsSaving(false);
    };

    const saveTheResults = async () => {
    if (!uploadedImage || !outputImage) {
        toast.error("Please generate an image before saving.");
        return;
    }

    try {
        setIsSaving(true);

        const response = await axios.post("/api/results", {
            uploadedImage,
            outputImage,
            prompt,
            roomStyle: room ?? "Default",
            aiStyle: aiStyle ?? "Default",
            userName: user.fullName ?? "Unknown User",
            userImage: user.imageUrl ?? "/assets/img/avatar.jpg",
        })
        if (response.data?.success) {
    toast.success("Result saved successfully!");
    router.refresh();
    clearAfterSave();
} else {
    toast.error("Something went wrong. Could not save.");
}


    } catch (error) {
        console.error("Save error:", error);
        toast.error("Failed to save result", {
            description: error instanceof Error ? error.message : "Unknown error"
        });
    } finally {
        setIsSaving(false);
    }
};

    const handleGenerate = async () => { 
        if (!uploadedImage) return;

        try {
            setLoading(true);

            // Step 1: Generate image from Hugging Face
            toast.info("Generating your design...");
            const result = await generateFromHuggingFaceModel({
                imageUrl: uploadedImage,
                prompt: `${prompt}${room ? `Room Style : ${room}` : ""} ${aiStyle ? `Ai Style : ${aiStyle}` : ""}, Make sure the image is high quality (1080p) and make sure the ratio is 16:9 and visually appealing.`
            });

            if (!result) {
                throw new Error("No image generated");
            }

            // Step 2: Upload generated image to Cloudinary
            toast.info("Saving your design...");
            const cloudinaryUrl = await uploadToCloudinary(result, "generated-designs");
            
            // Step 3: Set the Cloudinary URL as output
            setOutputImage(cloudinaryUrl);
            toast.success("Design generated and saved successfully!");

        } catch (error) {
            console.error("Generation error:", error);
            toast.error("Failed to generate room design. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    const handleImageChange = (url : string) => {
        setUploadedImage(url);
    };
    const handleImageRemove = () => {
        setUploadedImage(null);
    };
    
    useEffect(() => {
    let interval: NodeJS.Timeout;

    if (loading) {
        setProgress(0);
        interval = setInterval(() => {
            setProgress((prev) => (prev < 95 ? prev + 5 : prev));
        }, 300);
    } else if (!loading && progress !== 0) {
        setProgress(100);
        const timeout = setTimeout(() => setProgress(0), 1000);
        return () => clearTimeout(timeout);
    }

    return () => clearInterval(interval);
}, [loading]);


    return (
        <div className="relative my-12 w-full p-6 lg:p-8 rounded-lg border border-input space-y-6 overflow-hidden bg-background/50 backdrop-blur-sm">
            {/* Mysterious background particles - only render on client to avoid hydration mismatch */}
            {isMounted && (
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [0, -100, 0],
                                x: [0, Math.random() * 30 - 15, 0],
                                opacity: [0, 0.3, 0],
                                scale: [0, 1, 0],
                            }}
                            transition={{
                                duration: 4 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 5,
                                ease: "easeInOut",
                            }}
                            className="absolute w-1 h-1 bg-purple-400 dark:bg-purple-300 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                        />
                    ))}
                </div>
            )}

            <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full space-y-4 lg:col-span-3 p-6 border border-input rounded-lg bg-gradient-to-br from-transparent to-purple-50/5 dark:to-purple-950/5 backdrop-blur-sm"
                >
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Room Style</label>
                        <CustomSelect
                            placeholder="Select Room Style"
                            options={roomStyles}
                            onChange={handleRoomChange}
                            value={room}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">AI Style</label>
                        <CustomSelect
                            placeholder="Select AI Style"
                            options={aiStyles}
                            onChange={handleAiStyleChange}
                            value={aiStyle}
                        />
                    </div>
                </motion.div>
                <div className="w-full space-y-4 lg:col-span-9 relative p-6 border border-input rounded-lg bg-background/30">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Your Prompt</label>
                        <Textarea
                            placeholder="Describe your desired room transformation..."
                            value={prompt}
                            onChange={handlePromptChange}
                            className="min-h-[120px] resize-none"
                        />
                    </div>
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <TooltipButton
                                content="clear all filters"
                                onClick={clearAllFilters}
                                icon={<FilterX className="min-w-4 min-h-4" />}
                            />
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            animate={outputImage ? { 
                                boxShadow: [
                                    "0 0 0px rgba(168, 85, 247, 0)",
                                    "0 0 20px rgba(168, 85, 247, 0.5)",
                                    "0 0 0px rgba(168, 85, 247, 0)"
                                ]
                            } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="rounded-md"
                        >
                            <TooltipButton
                                content="Save TheResults"
                                onClick={saveTheResults}
                                icon={<Save className="min-w-4 min-h-4" />}
                                disabled={!outputImage || isSaving}
                                loading={isSaving}
                            />
                        </motion.div>
                    </div>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        animate={uploadedImage && !loading ? {
                            boxShadow: [
                                "0 0 0px rgba(139, 92, 246, 0)",
                                "0 0 30px rgba(139, 92, 246, 0.6)",
                                "0 0 0px rgba(139, 92, 246, 0)"
                            ]
                        } : {}}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        className="rounded-md"
                    >
                        <TooltipButton
                            content="Generate"
                            icon={<RefreshCcw />}
                            onClick={handleGenerate}
                            label="Generate"
                            buttonSize="default"
                            buttonVariant="default"
                            loading={loading}
                            buttonClassName="w-full"
                            disabled={!uploadedImage || loading}
                        />
                    </motion.div>

                    </div>
            </div>
            
            {/* Image Upload and Output Section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid w-full grid-cols-1 lg:grid-cols-2 gap-6 relative z-10"
            >
                {/* Upload Section */}
                <div className="flex flex-col space-y-3">
                    <label className="text-sm font-medium text-muted-foreground">Upload Image</label>
                    <motion.div
                        animate={!uploadedImage ? {
                            boxShadow: [
                                "0 0 0px rgba(139, 92, 246, 0)",
                                "0 0 20px rgba(139, 92, 246, 0.3)",
                                "0 0 0px rgba(139, 92, 246, 0)"
                            ]
                        } : {}}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="rounded-lg flex-1"
                    >
                        <ImageUploader
                            location="clients"
                            onChange={handleImageChange}
                            onRemove={handleImageRemove}
                            value={uploadedImage}
                        />
                    </motion.div>
                </div>

                {/* Output Section */}
                <div className="flex flex-col space-y-3">
                    <label className="text-sm font-medium text-muted-foreground">Generated Result</label>
                    <div className="w-full flex-1 relative rounded-lg border border-input bg-muted dark:bg-muted/50 overflow-hidden">
                {loading && !outputImage && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full h-full flex flex-col gap-4 items-center justify-center"
                    >
                        <motion.div 
                            className="flex items-center justify-center gap-2"
                            animate={{
                                boxShadow: [
                                    "0 0 0px rgba(59, 130, 246, 0)",
                                    "0 0 40px rgba(59, 130, 246, 0.8)",
                                    "0 0 0px rgba(59, 130, 246, 0)"
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Loader className="w-8 h-8 animate-spin text-blue-500"/>
                            <span className="ml-2 text-lg text-blue-500 animate-pulse">Generating....</span>
                        </motion.div>

                        <div className="w-full mt-4 h-40 flex items-center justify-center">
                            <ProgressStatus progress={50} size="lg"/>
                        </div>
                        <motion.div 
                            className="flex items-center justify-center gap-2"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <span>
                                Keep Waiting , this might take a while.. please dont&apos;t close the tab.

                            </span>
                        </motion.div>
                    </motion.div>
                )}
                {!loading && !outputImage && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full flex items-center justify-center"
                    >
                        <motion.span 
                            className="text-lg text-muted-foreground flex flex-col items-center"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Info className="my-2 text-muted-foreground"/>
                            Start analysing the image
                        </motion.span>
                    </motion.div>
                )}
                {outputImage && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative"
                    >
                        <motion.div
                            animate={{
                                boxShadow: [
                                    "0 0 0px rgba(168, 85, 247, 0)",
                                    "0 0 40px rgba(168, 85, 247, 0.4)",
                                    "0 0 0px rgba(168, 85, 247, 0)"
                                ]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="rounded-md"
                        >
                            <ReactBeforeSliderComponent
                                firstImage={{
                                    imageUrl : uploadedImage || "https://placehold.co/600x400"
                                }}
                                secondImage={{
                                    imageUrl : outputImage || "https://placehold.co/600x400"
                                }}
                            />
                        </motion.div>
                    </motion.div>
                )}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
