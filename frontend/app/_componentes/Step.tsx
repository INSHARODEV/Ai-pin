import React from "react"

export interface Params {
  step: number
  currentStep: number
  label: string
}

export default function Step({ step, currentStep, label }: Params) {
   
  const isActive = currentStep === step

  return (
    <div className="flex items-center h-[100%]  my-4 justify-left w-[100%]">
 
      <div
        className={`min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full text-white  mx-7
            ${currentStep<step ? "bg-[#597f9f76]" :  isActive?"bg-[rgba(13,112,200,1)]":"bg-[rgba(174,174,174,1)]"}`}
   
      >
        {step + 1}
      </div>

      
      <span
        className={`text-lg font-medium ${
          isActive ? "text-[rgba(13,112,200,1)]" : "text-gray-500"
        }`}
      >
        {label}
      </span>
    </div>
  )
}
