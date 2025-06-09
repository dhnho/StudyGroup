import { VisibilityOff, Visibility } from "@mui/icons-material";
import { Box, Button, FormControl, IconButton, Input, InputAdornment, InputLabel } from "@mui/material";
import React, { useState } from "react";
import { passwordRegex } from "../../libs/util/util";
import { toast } from "react-toastify";
import { useAccount } from "../../libs/hooks/useAccount";
 
type Field = 'password' | 'newPassword' | 'confirmPassword'

export default function ChangePassword() {
    const { changePassword } = useAccount()

    const [showPassword, setShowPassword] = useState({
        password: false,
        newPassword: false,
        confirmPassword: false
    });

    const [password, setPassword] = useState({
        password: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleClickShowPassword = (field: Field) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const renderPasswordField = (label: string, field: Field) => (
        <Box>
            <FormControl sx={{ m: 1 }} variant="standard">
                <InputLabel htmlFor="standard-adornment-password">{ label }</InputLabel>
                <Input
                    id="standard-adornment-password"
                    type={showPassword[field] ? 'text' : 'password'}
                    onChange={(event) => setPassword((prev) => ({
                        ...prev,
                        [field]: event.target.value
                    }))}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label={
                                    showPassword ? 'hide the password' : 'display the password'
                                }
                                onClick={() => handleClickShowPassword(field)}
                                onMouseDown={handleMouseDownPassword}
                                onMouseUp={handleMouseUpPassword}
                            >
                                {showPassword[field] ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
        </Box>
    );

    const handleChangePassword = async () => {
        if(!passwordRegex.test(password.newPassword.trim())) {
            toast.warn("Mật khẩu mới phải có tối thiểu 8 ký tự, ít nhất 1 ký tự chữ và 1 ký tự số")
            return
        }

        if(password.newPassword.trim() !== password.confirmPassword.trim()) {
            toast.warn("Mật khẩu mới và xác nhận mật khẩu không khớp")
            return
        }

        await changePassword.mutateAsync(
            { password: password.password, newPassword: password.newPassword},
            {
                onSuccess: () => toast.success("Cập nhật mật khẩu thành công")
            }    
        )
    }

    return (
        <Box>
            {renderPasswordField("Mật khẩu hiện tại", "password")}
            {renderPasswordField("Mật khẩu mới", "newPassword")}
            {renderPasswordField("Nhập lại mật khẩu mới", "confirmPassword")}

            <Box display='flex' justifyContent='flex-end' mt={1}>
                <Button onClick={handleChangePassword} disabled={ password.password === '' || password.newPassword === '' || password.confirmPassword === '' } variant="contained" size="small">
                    Lưu
                </Button>
            </Box>
        </Box>
    );
}
