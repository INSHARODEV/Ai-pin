"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginSchema } from "../utils/zodschama";  
import { userData } from "../utils/user.data";
import { User } from "../../../backend/src/modules/users/schmas/users.schema";
import { MakeApiCall, Methods } from "../actions";
 import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, useFormContext } from "react-hook-form";

type Inputs = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { register, handleSubmit,watch, formState: { errors } } = useForm<Inputs>();;

  const email = watch("email");
  const password = watch("password");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const router = useRouter();

  const submit: SubmitHandler<Inputs> = async (data:any) => {
    const valdidatedData = loginSchema.safeParse(data);
    console.log(email, password);

    try {
      const res = await MakeApiCall({
        body: JSON.stringify(valdidatedData.data),
        url: `/auth/signin`,
        method: Methods.POST,
      });
      // Send as JSON instead of FormData
      console.log(process.env.NEXT_PUBLIC_BASE_URL);
      localStorage.setItem("accessToken", res.data);
      const payloadPart = res.data.split(".")[1];
      const user: User = userData(payloadPart);
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/recoder");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong during login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
    className="min-h-screen flex items-center justify-center flex-col p-2 
    bg-[linear-gradient(to_top_right,_rgb(3,55,101),_rgb(13,112,200),_rgb(97,108,202),_rgb(127,174,215),_rgb(94,152,203))]"
  >

 
<div  className=" text-center text-white text-4xl font-bold">   AI Pin</div>
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back!</h2>
        <form onSubmit={handleSubmit(submit)} className="space-y-5">
          {" "}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              {...register("email")}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                errors.email ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message as any}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                errors.password ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white ${
              error || !password || loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            disabled={!email || !password || loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
/*"use client";

import React, { useState } from "react";
 import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../utils/zodschama";
import { z } from "zod";
import { useForm } from "react-hook-form";
import InputForm from "../_componentes/reusable/Form";
import { MakeApiCall, Methods } from "../actions";

type LoginInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: LoginInputs) => {
    setLoading(true);
    try {
  await MakeApiCall({url:'/auth/signin',body:JSON.stringify(data),method:Methods.POST})
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <InputForm<LoginInputs>
          onSubmit={handleLogin}
          loading={loading}
          defaultValues={{ email: "", password: "" }}
        >
          <InputForm.Input name="email" label="Email" required />
          <InputForm.Input name="password" label="Password" type="password" required />
          <InputForm.SubmitButton label="Login" />
        </InputForm>
      </div>
    </div>
  );
}
*/
