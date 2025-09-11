"use client";

import React, { useContext, useState } from "react";
import { stepsContext } from "../../layout";
import InputForm from "@/app/_componentes/reusable/Form";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MakeApiCall, Methods } from "@/app/actions";
import { useRouter } from "next/navigation"; // ✅ FIX
import { routes } from "@/app/_componentes/Form-sidebar";

export interface BranchFormData {
  name?: string;
  firstName?: string;
  email?: string;
}

export default function Page() {
  const router = useRouter();
  const [branches, setBranches] = useState<BranchFormData[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);  
  const { id } = useParams<{ id: string }>();
  const { step, setStep } = useContext(stepsContext) as any;
 
  const AddBranch = () => {
    const newIndex = branches.length;
    setBranches((prev) => [...prev, {}]); // add empty branch
    setActiveIndex(newIndex); // open the new one
  };

  const handleSubmit = async (data: BranchFormData, idx: number) => {
    // save branch data into the array
    setBranches((prev) =>
      prev.map((b, i) => (i === idx ? { ...b, ...data } : b))
    );

    
      const submittedData={
      name:data.name,
      Superviosr:{
    "firstName":data.firstName,
      "email":data.email,
      "role":"Superviosr"
      }
    
  
    
  }
  console.log(submittedData)
  const res=await MakeApiCall({  
    method:Methods.POST,
    url:`/branch/${id}`,
    body:JSON.stringify(submittedData),
      headers:'json'
  
  })
  console.log(await res)
    // Auto-collapse after submit (optional)
    setActiveIndex(null);

    // setStep(step + 1); // if you want to move wizard forward
  };
 
    const handleNavigatio = (clickedStep: number) => {
      // if step starts at 1, shift it down by 1 for array indexing
      console.log(step)
      
      const index = (step + clickedStep) ; 
      setStep(index)
     // console.log(index)
      router.push(`/${routes(id,index) }`);
    };

 

  return (
    <div className="mx-auto mt-10 p-12 bg-white rounded-lg shadow h-[100%]">
      <h3 className="text-xl font-semibold mb-1">Branches Setup</h3>
      <p className="text-gray-600 mb-6">
        Add each branch with its supervisor information.
      </p>

      {/* Branch list */}
      {branches.map((branch, idx) => (
        <div key={idx} className="mb-4 border rounded-md">
          {/* Accordion Header */}
          <div
            className="cursor-pointer px-4 py-2 bg-gray-100 flex justify-between items-center"
            onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
          >
            <span className="font-medium text-gray-700">
              Branch {idx + 1}
            </span>
            <span>{activeIndex === idx ? "▲" : "▼"}</span>
          </div>

          {/* Accordion Body */}
          {activeIndex === idx && (
            <div className="p-4">
              <InputForm
                onSubmit={(data) => handleSubmit(data, idx)}
                defaultValues={branch}
              >
                {/* Branch Name */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500">
                    Branch
                  </label>
                  <InputForm.Input
                    name="name"
                    required
                    placeHolder="Branch name"
                  />
                </div>

                {/* Supervisor */}
                <div className="space-y-2 mt-2">
                  <InputForm.Input
                    name="firstName"
                    required
                    placeHolder="Supervisor name"
                  />
                  <InputForm.Input
                    name="email"
                    type="email"
                    required
                    placeHolder="Supervisor email"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-between mt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setActiveIndex(null)}
                  >
                    Collapse
                  </Button>
                  <Button type="submit">Save Branch</Button>
                </div>
              </InputForm>
            </div>
          )}
        </div>
      ))}

      {/* First button */}
      {branches.length === 0 && (
        <div className="flex justify-center mt-6">
          <Button type="button" onClick={AddBranch}>
            Add Branch
          </Button>
        </div>
      )}

      {/* Add Another Branch */}
      {branches.length > 0 && activeIndex === null && (
        <div className="flex justify-end mt-6">
          <Button type="button" onClick={AddBranch}>
            Add Another Branch
          </Button>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex justify-between mt-10">
        <div className="flex w-12 h-12 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow">
          <ArrowLeft size={20} onClick={()=>handleNavigatio(-1)} />
        </div>
        <button     className="flex w-12  h-12 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow"> 
        <ArrowRight   size={20} onClick={()=>handleNavigatio(1)} />
        </button>
     
         
      
      </div>
    </div>
  );
}
