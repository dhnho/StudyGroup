import { z } from "zod";
import { requiredString } from "../util/util";

export const loginSchema = z.object({
    email: requiredString('Email').email("Email chưa đúng định dạng"),
    password: requiredString('Mật khẩu'),
})

export type LoginSchema = z.infer<typeof loginSchema>;