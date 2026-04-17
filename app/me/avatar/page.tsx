import { Suspense } from "react";
import { BrandHeader } from "@/components/brand/BrandHeader";
import { AvatarEditor } from "@/components/avatar/AvatarEditor";

export default function AvatarPage() {
  return (
    <>
      <BrandHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <Suspense
          fallback={
            <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
              Loading…
            </div>
          }
        >
          <AvatarEditor />
        </Suspense>
      </main>
    </>
  );
}
