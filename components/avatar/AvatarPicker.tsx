"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar } from "./Avatar";
import { AVATAR_PARTS, SHIRT_COLOURS, DEFAULT_AVATAR } from "@/lib/bem";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PickerProps = {
  memberId: string;
  initial: {
    head: string | null;
    shirt: string | null;
    pants: string | null;
    shoes: string | null;
    primaryColor: string | null;
  };
  onSaved?: () => void;
  submitLabel?: string;
};

export function AvatarPicker({
  memberId,
  initial,
  onSaved,
  submitLabel = "Save character",
}: PickerProps) {
  const router = useRouter();
  const [head, setHead] = useState(initial.head ?? DEFAULT_AVATAR.head);
  const [shirt, setShirt] = useState(initial.shirt ?? DEFAULT_AVATAR.shirt);
  const [pants, setPants] = useState(initial.pants ?? DEFAULT_AVATAR.pants);
  const [shoes, setShoes] = useState(initial.shoes ?? DEFAULT_AVATAR.shoes);
  const [primaryColor, setPrimaryColor] = useState(
    initial.primaryColor ?? DEFAULT_AVATAR.primaryColor
  );
  const [isPending, startTransition] = useTransition();

  const save = () => {
    startTransition(async () => {
      const res = await fetch(`/api/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ head, shirt, pants, shoes, primaryColor }),
      });
      if (!res.ok) {
        toast.error("Couldn't save — try again in a sec");
        return;
      }
      toast.success("Looking sharp.");
      router.refresh();
      onSaved?.();
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-accent/40 p-8">
        <Avatar
          head={head}
          shirt={shirt}
          pants={pants}
          shoes={shoes}
          primaryColor={primaryColor}
          size={200}
        />
      </div>

      <div className="space-y-6">
        <SlotRow
          label="Hair"
          options={AVATAR_PARTS.head}
          value={head}
          onChange={setHead}
          render={(v) => (
            <Avatar
              head={v}
              shirt={shirt}
              pants={pants}
              shoes={shoes}
              primaryColor={primaryColor}
              size={70}
              idle={false}
            />
          )}
        />
        <SlotRow
          label="Shirt"
          options={AVATAR_PARTS.shirt}
          value={shirt}
          onChange={setShirt}
          render={(v) => (
            <Avatar
              head={head}
              shirt={v}
              pants={pants}
              shoes={shoes}
              primaryColor={primaryColor}
              size={70}
              idle={false}
            />
          )}
        />
        <SlotRow
          label="Pants"
          options={AVATAR_PARTS.pants}
          value={pants}
          onChange={setPants}
          render={(v) => (
            <Avatar
              head={head}
              shirt={shirt}
              pants={v}
              shoes={shoes}
              primaryColor={primaryColor}
              size={70}
              idle={false}
            />
          )}
        />
        <SlotRow
          label="Shoes"
          options={AVATAR_PARTS.shoes}
          value={shoes}
          onChange={setShoes}
          render={(v) => (
            <Avatar
              head={head}
              shirt={shirt}
              pants={pants}
              shoes={v}
              primaryColor={primaryColor}
              size={70}
              idle={false}
            />
          )}
        />
        <div>
          <p className="mb-2 text-sm font-medium text-foreground/80">
            Shirt colour
          </p>
          <div className="flex flex-wrap gap-2">
            {SHIRT_COLOURS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setPrimaryColor(c)}
                className={cn(
                  "h-9 w-9 rounded-full border-2 transition",
                  primaryColor === c
                    ? "border-foreground scale-110"
                    : "border-border hover:scale-105"
                )}
                style={{ backgroundColor: c }}
                aria-label={`Shirt colour ${c}`}
              />
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Button
            onClick={save}
            disabled={isPending}
            size="lg"
            className="w-full sm:w-auto"
          >
            {isPending ? "Saving..." : submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SlotRow({
  label,
  options,
  value,
  onChange,
  render,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  render: (v: string) => React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-foreground/80">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "flex h-24 w-20 items-end justify-center overflow-hidden rounded-xl border-2 bg-card transition",
              value === opt
                ? "border-primary shadow-sm"
                : "border-border hover:border-foreground/40"
            )}
            aria-pressed={value === opt}
          >
            <div className="mt-3 overflow-hidden">{render(opt)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
