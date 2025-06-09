import { z } from "zod";
import { passwordRegex, requiredString } from "../util/util";

export const registerSchema = z.object({
    email: requiredString('Email').email("Email chưa đúng định dạng"),
    fullname: requiredString('Họ tên'),
    password: requiredString('Mật khẩu').regex(passwordRegex, "Tối thiểu 8 ký tự, ít nhất 1 ký tự chữ và 1 ký tự số"),
    confirmPassword: requiredString('Mật khẩu'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ['confirmPassword']
})

export type RegisterSchema = z.infer<typeof registerSchema>;