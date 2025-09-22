"use client";

import React, { useContext, useEffect, useState } from "react";
 import InputForm from "@/app/_componentes/reusable/Form";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MakeApiCall, Methods } from "@/app/actions";
import { routes } from "@/app/_componentes/Form-sidebar";
import { Branch, Role } from "../../../../../shard/src";
import { Employee } from "../../../../../shard/src";
import { stepsContext } from "@/app/context/stesp.context";
import { createUserSchmea } from "@/app/utils/zodschama";
import Loader from "@/app/loader";
 

export interface SaleshFormData {
  firstName?: string;
  email?: string;
  saved:boolean
}

type Member = SaleshFormData;

type BranchWithIdAndMembers = Branch & {
  _id: string;
  members: Member[];

};

export default function Page() {
  const router = useRouter();
  const [branches, setBranches] = useState<BranchWithIdAndMembers[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [branchEmps,setBrnachEmps]=useState<Employee[]>([])
  const { id } = useParams<{ id: string }>();
  const { step, setStep } = useContext(stepsContext) as any;
  const [loading,setLoading]=useState<boolean>(false)
  useEffect(() => {
    async function getCompanies() {
      setStep(2)
      const {branchs} = await MakeApiCall({
        method: Methods.GET,
        url: `/company/${id}`,
      });
      console.log('b',branchs);

      // Add empty members array for each branch
      setBranches(
        branchs.map((b: Branch) => ({
          ...b,
          members: [],
        }))
      );
    }

    getCompanies();
  }, [id]);

  const addMember = (branchIndex: number) => {
    setBranches((prev) =>
      prev.map((b, i) =>
        i === branchIndex ? { ...b, members: [...b.members, { saved: false }] } : b
      )
    );
     setActiveIndex(branchIndex);
  };

  const handleSubmit = async (
    data: Member,
    branchIndex: number,
    memberIndex: number,
    branchId: string
  ) => {

    setBranches((prev) =>
      prev.map((b, i) =>
        i === branchIndex
          ? {
              ...b,
              members: b.members.map((m, j) =>
                j === memberIndex ? { ...m, ...data } : m
              ),
            }
          : b
      )
    );

    const submittedData = {
      firstName: data.firstName,
      email: data.email?.toLowerCase(),
      role: "SELLER",
      jobTitle: "Employee",
      password: "changeMe",
      branchId,
    };
 

    console.log("Submitting:", submittedData);

    await MakeApiCall({
      method: Methods.POST,
      url: `/auth`,
      body: JSON.stringify(submittedData),
      headers: "json",
    });
    setBranches((prev) =>
      prev.map((b, i) =>
        i === branchIndex
          ? {
              ...b,
              members: b.members.map((m, j) =>
                j === memberIndex ? { ...m, ...data, saved: true } : m
              ),
            }
          : b
      )
    );

    setActiveIndex(null); // collapse after submit
  };

  const handleNavigatio = (clickedStep: number) => {
    const index = step + clickedStep;
    setStep(index);
    router.push(`/${routes(id, index)}`);
  };

   const getCurrentMembers=async(branchId:string)=>{
    const emps = await MakeApiCall({
      method: Methods.GET,
      url: `/users?role=${Role.SELLER}&branchId=${branchId}`,
    });
    setBranches((prev) =>
      prev.map((b) =>
        b._id === branchId
          ? { ...b, members: [...emps.map((e: any) => ({ ...e, saved: true }))] }
          : b
      )
    );
  }
 
  {return  !branches?<Loader/>:(
    <div className="mx-auto mt-10 p-12 bg-white rounded-lg shadow h-[100%]">
      <h3 className="text-xl font-semibold mb-1">Sales Team Setup</h3>
      <p className="text-gray-600 mb-6">
        Assign sales reps to the branches and create their accounts.
      </p>

      {/* Branch list */}
      {branches.map((branch, branchIdx) => (
        <div key={branch._id} className="mb-4 border rounded-md">
          {/* Accordion Header */}
          <div
            className="cursor-pointer px-4 py-2 bg-gray-100 flex justify-between items-center"
            onClick={() =>{
              setActiveIndex(activeIndex === branchIdx ? null : branchIdx)
              getCurrentMembers(branch._id)
            }
             
            }
          >
            <span className="font-medium text-gray-700">
           {branch.name  }
            </span>
            <span>{activeIndex === branchIdx ? "▲" : "▼"}</span>
          </div>

          {/* Accordion Body */}
          {activeIndex === branchIdx && (
            <div className="p-4">
              {branch.members.map((member, memberIdx) => (
                <InputForm

                  key={memberIdx}
                  onSubmit={(data) =>
                    handleSubmit(data, branchIdx, memberIdx, branch._id)
                  }
                  defaultValues={member}
                >
                  <div className="space-y-2 mt-2">
                    <InputForm.Input
                    disabled={member.saved }
                      name="firstName"
                      required
                      placeHolder="Sales representative name"
                    />
                    <InputForm.Input
                        disabled={member.saved }
                      name="email"
                      type="email"
                      required
                      placeHolder="Sales representative email"
                    />
                  </div>

                  <div className="flex justify-between mt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setActiveIndex(null)}
                    >
                      Collapse
                    </Button>
                    <Button   type="submit" disabled={member.saved ? true:false}>Save Member</Button>
                  </div>
                </InputForm>
              ))}

              {/* Always show Add button inside branch */}
              <div className="flex justify-end mt-4">
                <Button type="button" onClick={() => addMember(branchIdx)}  >
                  Add Another Member
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Navigation Controls */}
      <div className="flex justify-between mt-10">
        <button className="flex w-12 h-12 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow">
          <ArrowLeft size={20} onClick={() => handleNavigatio(-1)} />
        </button>
        <button    onClick={()=>router.push('/admin/companies')} className="flex w-12  h-12 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700   text-white shadow"> 
        <ArrowRight   size={20} onClick={()=>handleNavigatio(1)} />
        </button>
      </div>
    </div>
  );}
}
