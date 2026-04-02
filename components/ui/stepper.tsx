"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type Step = {
  id: string | number;
  title: string;
  description?: string;
  content?: React.ReactNode;
  optional?: boolean;
};

export type StepperProps = {
  steps: Step[];
  activeIndex?: number;
  onChange?: (index: number) => void;
  orientation?: "horizontal" | "vertical";
  /** When false, users cannot jump to future steps by clicking on the header. */
  allowJump?: boolean;
  /** Upper bound index the user can navigate to (inclusive). */
  maxReachableIndex?: number;
  showContent?: boolean;
  completed?: (index: number) => boolean;
  className?: string;
  /** Use built-in Back/Next buttons (you’re using form buttons, so keep this false). */
  navigation?: boolean;
};

export default function Stepper({
  steps,
  activeIndex: activeIndexProp,
  onChange,
  orientation = "horizontal",
  allowJump = true,
  maxReachableIndex,
  showContent = true,
  completed,
  className = "",
  navigation = false,
}: StepperProps) {
  const isControlled = typeof activeIndexProp === "number";
  const [internalIndex, setInternalIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const activeIndex = isControlled ? (activeIndexProp as number) : internalIndex;

  const isVertical = orientation === "vertical";

  const canActivate = (idx: number) => {
    if (!allowJump) {
      // Only current or previous
      return idx <= activeIndex;
    }
    if (typeof maxReachableIndex === "number") {
      return idx <= maxReachableIndex;
    }
    return true;
  };

  const handleChange = (index: number) => {
    if (!canActivate(index)) return;
    if (!isControlled) setInternalIndex(index);
    setPrevIndex(activeIndex);
    onChange?.(index);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`flex ${isVertical ? "flex-col" : "flex-row items-start"} gap-4 h-full`}>
        {/* Steps list */}
        <nav aria-label="Progress" className="flex items-center w-full">
          {steps.map((s, idx) => {
            const isActive = idx === activeIndex;
            const isDone = completed ? completed(idx) : idx < activeIndex;
            const isLast = idx === steps.length - 1;
            const clickable = canActivate(idx);

            return (
              <div key={s.id} className={`flex items-center ${!isLast ? "flex-1" : ""}`}>
                <div
                  className={`flex items-center gap-2 ${
                    clickable ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                  }`}
                  onClick={() => clickable && handleChange(idx)}
                  role="button"
                  tabIndex={clickable ? 0 : -1}
                  onKeyDown={(e) => {
                    if (!clickable) return;
                    if (e.key === "Enter" || e.key === " ") handleChange(idx);
                  }}
                  aria-disabled={!clickable}
                >
                  <div
                    className={`flex items-center justify-center rounded-full w-9 h-9 border-2 shrink-0 transition-all ${
                      isActive
                        ? "border-brand-500 bg-brand-50"
                        : isDone
                        ? "border-green-500 bg-green-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4 text-green-600" /> : <Circle className="w-4 h-4 opacity-60" />}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${isActive ? "text-slate-900" : "text-slate-600"}`}>
                      {s.title}
                    </span>
                    {s.description && <span className="text-xs text-slate-500">{s.description}</span>}
                  </div>
                </div>

                {!isLast && <div className={`flex-1 h-[2px] mx-4 ${isDone ? "bg-green-500" : "bg-slate-200"}`} />}
              </div>
            );
          })}
        </nav>

        {/* Content */}
        <div className={`flex-1 ${isVertical ? "mt-2" : ""}`}>
          <Card className="h-full">
            <CardContent className="h-full flex flex-col justify-between">
              <div className="relative overflow-hidden h-full overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ x: prevIndex < activeIndex ? 300 : -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: prevIndex < activeIndex ? -300 : 300, opacity: 0 }}
                    transition={{ type: "tween", duration: 0.35 }}
                    className="absolute w-full h-full"
                  >
                    {showContent ? (
                      steps[activeIndex]?.content ?? (
                        <div className="text-sm text-slate-700">No content provided for this step.</div>
                      )
                    ) : null}
                  </motion.div>
                </AnimatePresence>
              </div>

              {navigation && (
                <div className="flex items-center justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={() => handleChange(Math.max(0, activeIndex - 1))}
                    disabled={!canActivate(activeIndex - 1)}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => handleChange(Math.min(steps.length - 1, activeIndex + 1))}
                    disabled={!canActivate(activeIndex + 1)}
                  >
                    {activeIndex === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
