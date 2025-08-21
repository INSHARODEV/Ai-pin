"use client";
import React, { useEffect } from "react";
import { AUTH } from "../utils/sessionStatus";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function withAuth(
  Component: any,
  { permissons, role: requiredRole }: AUTH
) {
  return function WrappedWithAuth(props: any) {
    const router = useRouter();

    useEffect(() => {
      const stored = localStorage.getItem("user");

      if (!stored) {
        router.push("/login");
        return;
      }

      let role: string;
      let userPermissions: string[] = [];

      try {
        ({ role, permissions: userPermissions } = JSON.parse(stored));
      } catch {
        router.push("/login");
        return;
      }

      console.log("Allowed permissions:", permissons);
      console.log("User permissions:", userPermissions);

      // Role check
      if (requiredRole && role === requiredRole) {
        // Only check permissions if we actually require some
        if (
          permissons.length > 0 &&
          !permissons.some((perm) => userPermissions.includes(perm))
        ) {
          toast.error("You are not allowed to perform this action");
          router.push("/login");
          return;
        }
      }

       if (!role || userPermissions?.length === 0) {
        router.push("/login");
        return;
      }
    }, [router]);

    return <Component {...props} />;
  };
}
//form to create a company  a manger can only create 
//form to create branch by admin belongs to  this  company 
//add an employee to branch by and admin 
//add new mics by admins and assoite thme to emps pf the same company