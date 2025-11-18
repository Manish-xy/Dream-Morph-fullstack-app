"use client";

"use client";

import { ToastProvider } from "@/providers/toast-provider";
import { ClerkProvider } from "@clerk/nextjs";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <ClerkProvider>
    <ToastProvider />
    {children}
    </ClerkProvider>;
};

export default Providers;
