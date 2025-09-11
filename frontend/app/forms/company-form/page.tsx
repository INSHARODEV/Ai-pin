"use client";

import React, { useContext } from "react";
import InputForm from "../../_componentes/reusable/Form";
import { ArrowRight } from "lucide-react"; // for the arrow icon
import Logo from "../../_componentes/icons/Logo";
import { MakeApiCall, Methods } from "../../actions";
import { stepsContext } from '../layout';
import { useRouter } from "next/navigation"; // ✅ FIX
import { routes } from "@/app/_componentes/Form-sidebar";

export interface Params{
  step:number;

}
export default function Page() {
  const router = useRouter();
  const {step,setStep}=useContext( stepsContext) as any
  const handleSubmit = async(data: any) => {
    const submittedData={
    name:data.name,
    manager:{
  "firstName":data.firstName,
    "email":data.email,
    "role":"MANAGER"
    }
  

  
}
console.log(submittedData)
const res=await MakeApiCall({  
  method:Methods.POST,
  url:'/company',
  body:JSON.stringify(submittedData),
    headers:'json'

})
// console.log(res)
console.log(res)
setStep(step+1)
   
router.push(`/${routes(res._id,1) }`);
 
  };

  return (
    <div className="  mx-auto mt-10 p-12 bg-white rounded-lg shadow h-[100%]">
 
      <h3 className="text-xl font-semibold mb-1">Company Setup</h3>
      <p className="text-gray-600 mb-6">
        Enter the company details and create the main manager account.
      </p>

      <InputForm
        onSubmit={handleSubmit}
        defaultValues={{ company: "", managerName: "", email: "" }}
      >
        {/* Company Section */}
        <div className="space-y-2  ">
          <label className="text-xs font-semibold text-gray-500 tracking-wide">
            COMPANY
          </label>
          <div className="p-1.5">

         
          <InputForm.Input
            name="name"
            label=""  
            required
            placeHolder="Company name"
          />
           </div>
        </div>

        {/* Manager Section */}
        <div className="space-y-2  ">
          <label className="text-xs font-semibold text-gray-500 tracking-wide">
            MANAGER
          </label>
          <div className="p-1.5  mt-7" >


          <InputForm.Input
            name="managerName"
            label=""
            required
            placeHolder="Manager's name"
          />
          <div className="mt-7"> 
          <InputForm.Input
            name="email"
            label=""
            type="email"
            required
            placeHolder="Manager's email"
          />
          </div>
          </div>
        </div>

        {/* Submit button → round with arrow */}
        <div className="flex justify-end mt-14">
          <button
          
            type="submit"
     className="flex w-12  h-12 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow" 
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </InputForm>
    </div>
  );
}
