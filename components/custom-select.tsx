"use client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils";

interface Option {
    label: string;
    value: string;
}

interface CustomSelectProps {
    placeholder: string;
    options: Option[];
    onChange: (value: string) => void;
    value?: string | null;
    classname?: string;
}

export const CustomSelect = ({ placeholder, options, onChange, value, classname }: CustomSelectProps) => {
    return <Select onValueChange={onChange} value={value ??""}>
  <SelectTrigger className={cn("w-full", classname)}>
    <SelectValue placeholder={placeholder} />
  </SelectTrigger>
  <SelectContent>
    {options.map(opt => (
        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
    ))}
  </SelectContent>
</Select>
}
