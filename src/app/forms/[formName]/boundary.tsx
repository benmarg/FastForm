"use client";

import { Suspense } from "react";
import { DynamicFormFallback } from "@/components/common/dynamic-form";

export function FormPageBoundary({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Suspense fallback={<DynamicFormFallback />}>{children}</Suspense>
    </div>
  );
}
