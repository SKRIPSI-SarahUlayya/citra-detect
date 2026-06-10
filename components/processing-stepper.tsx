"use client"

import { cn } from "@/lib/utils"
import { IconCheck, IconLoader2 } from "@tabler/icons-react"

const STEPS = [
  { label: "Citra diterima", description: "File valid dan siap diproses" },
  { label: "Preprocessing", description: "Resize 224×224 + normalisasi piksel" },
  { label: "Klasifikasi CNN", description: "Ekstraksi fitur & inferensi model" },
  { label: "Pembangkitan Grad-CAM", description: "Visualisasi area berpengaruh" },
]

interface ProcessingStepperProps {
  currentStep: number
}

export function ProcessingStepper({ currentStep }: ProcessingStepperProps) {
  return (
    <div className="space-y-3">
      {STEPS.map((step, index) => {
        const state =
          index < currentStep ? "done" : index === currentStep ? "active" : "pending"
        return (
          <div key={index} className="flex items-start gap-3">
            <div
              className={cn(
                "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                state === "done" && "border-green-500 bg-green-500 text-white",
                state === "active" && "border-primary bg-primary/10 text-primary",
                state === "pending" && "border-muted-foreground/30 text-muted-foreground/30"
              )}
            >
              {state === "done" ? (
                <IconCheck className="size-3.5" />
              ) : state === "active" ? (
                <IconLoader2 className="size-3.5 animate-spin" />
              ) : (
                <span className="text-xs">{index + 1}</span>
              )}
            </div>
            <div>
              <p
                className={cn(
                  "text-sm font-medium",
                  state === "pending" && "text-muted-foreground"
                )}
              >
                {step.label}
              </p>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
