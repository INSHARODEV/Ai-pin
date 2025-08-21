import { z } from "zod";
import { Role } from "../../../backend/src/shared/ROLES";

export const loginSchema = z.object({
  email: z
    .string()
    .transform((val) => {
       return val.replace(/[^\w.@]/g, "").toLowerCase();
    })
    .pipe(
      z
        .string()
        .email("Invalid email format")
        .max(50, "Email must be at most 50 characters")
    ),

  password: z.string(),
});


export const createUserSchmea=z.object({
 
    firstName: z
    .string()
    .transform((val) => {
       return val.replace(/[^\w.@]/g, "").toLowerCase();
    }),
    lastName: z
    .string()
    .transform((val) => {
       return val.replace(/[^\w.@]/g, "").toLowerCase();
    }),
    email: z
    .string()
    .transform((val) => {
       return val.replace(/[^\w.@]/g, "").toLowerCase();
    }),
    password:  z.string(),
    role: z.enum([Role.ADMIN]),
    jobTitle: z.string()
})