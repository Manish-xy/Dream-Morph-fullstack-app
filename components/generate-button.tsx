"use client"

import { Button } from "@/components/ui/button";

interface GenerateButtonProps {
    label : string;
}

export const GenerateButton = ({ label }: GenerateButtonProps) => {
  return <Button size={"sm"} className="relative font-medium text-sm bg-gradient-to-b from-[#190d2e] to-[#4a208a] shadow-[0px_0px_12px_#8c45ff]">
    <div className=" absolute inset-0">
      <div className="border border-white/20 absolute inset-0 rounded-md [mask-image:linear-gradient(to_bottom,black,transparent)]"></div>
      <div className="rounded-md absolute border border-white/40 inset-0 [mask-image:linear-gradient(to_top,black,transparent)]"></div>
      <div className="absolute inset-0 shadow-[0_0_10px_rgba(140,69,255,.7)]"></div>
    </div>
    <span className="text-white">{label}</span>
  </Button>
}
