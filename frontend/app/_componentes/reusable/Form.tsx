"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";

type FormContextType<T extends FieldValues> = {
  register: ReturnType<typeof useForm<T>>["register"];
  errors: ReturnType<typeof useForm<T>>["formState"]["errors"];
  loading?: boolean;
};

const FormContext = createContext<FormContextType<any> | null>(null);

function useFormContextSafe<T extends FieldValues>() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("InputForm subcomponent must be used inside <InputForm>");
  return ctx as FormContextType<T>;
}

interface InputFormProps<T extends FieldValues> {
  defaultValues?: Partial<T>;
  onSubmit: SubmitHandler<T>;
  loading?: boolean;
  children: ReactNode;
}

function InputForm<T extends FieldValues>({
  defaultValues,
  onSubmit,
  loading,
  children,
}: InputFormProps<T>) {
  const { register, handleSubmit, formState: { errors } } = useForm<T>({ defaultValues  }as any);

  return (
    <FormContext.Provider value={{ register, errors, loading }}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {children}
      </form>
    </FormContext.Provider>
  );
}

// Input field subcomponent
interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}

function InputField({ name, label, type = "text", required }: InputFieldProps) {
  const { register, errors } = useFormContextSafe<any>();
  const error = errors[name]?.message as string | undefined;

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        {...register(name, { required })}
        className={`mt-1 block w-full px-3 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md shadow-sm focus:outline-none focus:ring-2 ${
          error ? "focus:ring-red-500" : "focus:ring-blue-500"
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

// Submit button subcomponent
interface SubmitButtonProps {
  label?: string;
}

function SubmitButton({ label = "Submit" }: SubmitButtonProps) {
  const { loading } = useFormContextSafe<any>();
  return (
    <button
      type="submit"
      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white ${
        loading ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
      disabled={loading}
    >
      {loading ? "Loading..." : label}
    </button>
  );
}

// Attach subcomponents
InputForm.Input = InputField;
InputForm.SubmitButton = SubmitButton;

export default InputForm;
