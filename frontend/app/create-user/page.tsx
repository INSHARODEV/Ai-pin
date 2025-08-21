"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserSchmea } from "../utils/zodschama";
import { MakeApiCall, Methods } from "../actions";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "../../../backend/src/shared/ROLES";
import toast from "react-hot-toast";

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role.ADMIN;
  jobTitle: string;
};

export default function CreateAdmin() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(createUserSchmea) });

  const email = watch("email");
  const password = watch("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const submit: SubmitHandler<Inputs> = async (data) => {
    const parsed = createUserSchmea.safeParse(data);
    if (!parsed.success) {
      setError("Validation failed");
      return;
    }

    setLoading(true);
    try {
      const res = await MakeApiCall({
        body: JSON.stringify(parsed.data),
        url: `/auth`, // ✅ change to your backend's create user endpoint
        method: Methods.POST,
      });

      toast.success("New user has been created");
      router.push("/recoder");
    } catch (err) {
      console.error("Create user error:", err);
      setError(
        err instanceof Error ? err.message : "Something went wrong during user creation."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create New User</h2>
        <form onSubmit={handleSubmit(submit)} className="space-y-5">
          <input {...register("firstName")} placeholder="First Name" />
          {errors.firstName && <p>{errors.firstName.message}</p>}

          <input {...register("lastName")} placeholder="Last Name" />
          {errors.lastName && <p>{errors.lastName.message}</p>}

          <input {...register("jobTitle")} placeholder="Job Title" />
          {errors.jobTitle && <p>{errors.jobTitle.message}</p>}

          <select {...register("role")}>
            <option value="">Select Role</option>
            <option value={Role.MANAGER}>Manager</option>
            <option value={Role.ADMIN}>Admin</option>
          </select>
          {errors.role && <p>{errors.role.message}</p>}

          <input {...register("email")} placeholder="Email" />
          {errors.email && <p>{errors.email.message}</p>}

          <input type="password" {...register("password")} placeholder="Password" />
          {errors.password && <p>{errors.password.message}</p>}

          {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={!email || !password || loading}
            className={`w-full py-2 px-4 text-white rounded ${
              !email || !password || loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
}
