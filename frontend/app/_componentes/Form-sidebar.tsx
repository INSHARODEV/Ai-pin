'use client'
import React, { useState } from 'react'
import Step from './Step'
import Logo from './icons/Logo'

const companySetup = {
  "Company-Setup-(required)": "Company Setup (required)",
  "Branches Setup": "Branches Setup",
  "Sales Team Setup": "Sales Team Setup"
}

export default function FormSidebar() {
  const [step, setStep] = useState(0)

  return (
    <div className="h-full  flex flex-col my-5  p-10" >

 <Logo/>

      <h1 className="text-2xl font-semibold text-center mb-7">Adding a new Company</h1>

      {Object.entries(companySetup).map(([key, label], index) => (
        <Step
          key={key}
          step={index}
          currentStep={step}
        label= {key}
       
        />
      ))}
    </div>
  )
}
