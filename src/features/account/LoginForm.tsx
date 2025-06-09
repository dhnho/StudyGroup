import { Visibility, VisibilityOff } from "@mui/icons-material";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { Avatar, Box, Button, FormControl, FormHelperText, Grid, IconButton, Input, InputAdornment, InputLabel, Typography } from "@mui/material";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchema } from "../../libs/schemas/LoginSchema";
import { useAccount } from "../../libs/hooks/useAccount";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router";

export default function RegisterForm() {
    const navigate = useNavigate();
    const { loginUser } = useAccount();

    const [showPassword, setShowPassword] = useState(false);

    const { handleSubmit, register, formState: { errors, isValid, isSubmitting } } = useForm<LoginSchema>({
        mode: 'onTouched', //tránh thông báo lỗi khi nhập, hiển thị lỗi khi rời input
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginSchema) => {
        await loginUser.mutateAsync(data, {
            onSuccess: () => {
                navigate('/');

                toast.success("Đăng nhập thành công");
            }
        });
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <Grid container display='flex' justifyContent='space-around' sx={{ height: '100vh', background: 'linear-gradient(180deg, #003f96,  #1f96fc)' }}>
            <Box zIndex={2} sx={{ 
                background: 'url(/cloud.png) no-repeat center / cover', 
                position: 'fixed', 
                top: {
                    xs: '18%',
                    sm: '0'
                }, 
                bottom: 0, 
                width: '100%',
                transform: {
                    md: 'rotate(0)',
                    xs: 'rotate(90deg);'
                },
                height: {
                    md: '100%',
                    xs: '100vw'
                }
             }}>
                
            </Box>

            <Grid size={{ md: 5, xs: 12 }} zIndex={3} display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                <Typography variant="h6" sx={{ mb: 6, color: 'white', display: { xs: 'none', md: 'block' } }}>Welcome to</Typography>

                <Avatar onClick={() => navigate('/')} alt="Cindy Baker" src="/group-video-call.png" sx={{ backgroundColor: 'white', width: 70, height: 70, padding: 0.5, cursor: 'pointer' }} />
                <Typography variant="h5" sx={{ mt: 2, mb: 6, fontWeight: 'bold', color: 'white', letterSpacing: 3 }}>STUDYGROUP</Typography>

                <Typography variant="body1" sx={{ color: 'white', display: { xs: 'none', md: 'block' } }} textAlign="center">
                    Kết nối – Học hỏi – Cùng nhau tiến bộ <br />
                    Nơi học tập trở nên dễ dàng và thú vị hơn cùng bạn bè
                </Typography>
            </Grid>
            <Grid size={{ md: 7, xs: 12 }} display='flex' justifyContent='center' alignItems='center' sx={{ background: {
                sm: 'transparent',
                xs: 'white'
            } }}>
                <Box onSubmit={handleSubmit(onSubmit)} zIndex={3} component='form' autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', width: '350px', mx: 5 }}>
                    <Typography variant="h4" textAlign='center' sx={{ mb: 6, fontWeight: 'bold', color: 'primary.main' }}>Đăng nhập</Typography>

                    <FormControl variant="standard" sx={{ mb: 3 }}>
                        <InputLabel htmlFor="email">
                            Email
                        </InputLabel>
                        <Input
                            id="email"
                            {...register('email')}
                            startAdornment={
                                <InputAdornment position="start">
                                    <EmailIcon />
                                </InputAdornment>
                            }
                        />
                        {errors.email && <FormHelperText error> {errors.email.message} </FormHelperText>}
                    </FormControl>

                    <FormControl variant="standard" sx={{ mb: 3 }}>
                        <InputLabel htmlFor="password">
                            Mật khẩu
                        </InputLabel>
                        <Input
                            id="password"
                            {...register('password')}
                            type={showPassword ? 'text' : 'password'}
                            startAdornment={
                                <InputAdornment position="start">
                                    <LockIcon />
                                </InputAdornment>
                            }
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        {errors.password && <FormHelperText error> {errors.password.message} </FormHelperText>}
                    </FormControl>

                    <Box display='flex' justifyContent='center' flexDirection='column'>
                        <Button disabled={!isValid || isSubmitting} loading={isSubmitting} type="submit" variant="contained">Đăng nhập</Button>

                        <Typography textAlign='center' mt={2}>
                            Bạn chưa có tải khoản? {''}
                            <Link to='/register'>
                                <Typography component='span' color="primary">Đăng ký ngay</Typography>
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}
