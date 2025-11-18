"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader, Trash } from "lucide-react";
import { toast } from "sonner";
import { ProgressStatus } from "./progess-status";
import { on } from "events";

interface ImageUploaderProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string | null;
  location: string;
}

export const ImageUploader = ({
  disabled,
  onChange,
  onRemove,
  value,
  location,
}: ImageUploaderProps) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [onDeleting, setOnDeleting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    onUpload(file);
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
    multiple: false,

  });


  const onUpload = async (file: File) => {
    try {
      setIsLoading(true);
      setProgress(0);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "dream_morph_upload");
      formData.append("folder", location);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setProgress(parseFloat(percentComplete.toFixed(2)));
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          onChange(response.secure_url);
          setIsLoading(false);
          setProgress(0);
          toast.success("Image uploaded successfully!");
        } else {
          setIsLoading(false);
          setProgress(0);
          toast.error("Upload failed");
        }
      });

      xhr.addEventListener("error", () => {
        setIsLoading(false);
        setProgress(0);
        toast.error("Upload failed");
      });

      xhr.open("POST", `https://api.cloudinary.com/v1_1/dketx57te/image/upload`);
      xhr.send(formData);

    } catch (error) {
      setIsLoading(false);
      setProgress(0);
      toast.error("Upload failed", {
        description: (error as Error)?.message,
      });
    }
  };

  const onDelete = () => {
    setOnDeleting(true);
    try {
      if(!value){
        toast.error("No image to delete");
        return;
      }
      onRemove(value);
      toast.success("Image deleted successfully!");
    } catch (error) {
      toast.error("Deletion failed", {
        description: (error as Error)?.message,
      });
    }finally {
      setOnDeleting(false);
    }
  };

  if (!isMounted) return null;

  return <div className="w-full h-full">
    {value ? (<div className="w-full h-full relative rounded-md flex items-center justify-center overflow-hidden border border-input bg-muted dark:bg-muted/50">
      <Image
        fill
        className="w-full h-full object-cover"
        alt="Uploaded Image"
        src={value}
        priority
      />
      <div className="absolute z-10 top-2 right-2 cursor-pointer">
        <Button
          size="icon"
          variant={"destructive"}
          className="cursor-pointer" 
          onClick={onDelete}>
            {onDeleting ? <Loader className="animate-spin"/> : <Trash />}
          </Button>
      </div>
    </div>
    ) : (
      <div {...getRootProps({
        className: `w-full h-full min-h-[400px] relative rounded-md flex items-center justify-center overflow-hidden border border-dashed transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-100 dark:bg-blue-950"
            : isDragReject
            ? "border-red-500 bg-red-100 dark:bg-red-950"
            : "border-input bg-muted dark:bg-muted/50"
        }`
      })}>
        <input {...getInputProps()} />
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {/* progress */}
            <ProgressStatus progress={progress}/>
          </div>
        ) : (
          <div className=" w-full h-full flex flex-col gap-2 items-center justify-center text-muted-foreground dark:text-muted">
            <ImagePlus className="w-10 h-10"/>
            <p>
              {isDragActive
              ? "Drop it here ..."
              : "Drag & drop an image, or click to select one"}
            </p>
          </div>
        )}
      </div>
    )}
  </div>
};
