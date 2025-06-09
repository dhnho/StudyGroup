import { Avatar, Box, Button, FormControl, Input, InputAdornment, InputLabel, styled } from "@mui/material";
import { useAccount } from "../../libs/hooks/useAccount";
import { stringToColor } from "../../libs/util/util";
import EmailIcon from '@mui/icons-material/Email';
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function Profile() {
    const { currentUser, uploadPhoto, changeName } = useAccount();
    const [name, setName] = useState<string>('')

    const handleUploadingFile = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.item(0)
        if(!file) {
            toast.warning("Vui lòng chọn file");
            return
        }

        const formData = new FormData()
        formData.append('formFile', file)

        await uploadPhoto.mutateAsync(formData, {
            onSuccess: () => {
                toast.success("Cập nhật ảnh đại diện thành công")
            }
        })
    }

    const handleChangeName = async () => {
        if(!/^[A-Z\s]{2,}$/i.test(name.trim())) {
            toast.warn("Tên phải có từ 2 ký tự chữ cái trở lên")
            return
        }

        await changeName.mutateAsync(name.trim(), {
            onSuccess: () => {
                toast.success("Cập nhật tên thành công")
            }
        })
    }

    useEffect(() => {
        if(currentUser)
            setName(currentUser.fullname)
    }, [currentUser])

    return (
        <Box>
            <Box display='flex' alignItems='center'>
                { 
                    currentUser && <Button
                        component="label"
                        role={undefined}
                        variant="text"
                        tabIndex={-1}
                        startIcon={
                            <Avatar src={currentUser?.photoUrl} sx={{ bgcolor: stringToColor(currentUser.fullname), width: 50, height: 50 }}>
                                {currentUser?.fullname[0].toUpperCase()}
                            </Avatar>
                        }
                    >

                        <VisuallyHiddenInput
                            type="file"
                            accept="image/*"
                            onChange={(event) => handleUploadingFile(event)}
                            multiple
                        />
                    </Button>
                }

                <FormControl variant="standard">
                    <InputLabel htmlFor="fullname">
                        Họ tên
                    </InputLabel>
                    <Input
                        id="fullname"
                        value={name}
                        placeholder="off"
                        onChange={(event) => setName(event.target.value)}
                        startAdornment={
                            <InputAdornment position="start">
                                <EmailIcon />
                            </InputAdornment>
                        }
                    />
                </FormControl>
            </Box>

            <Box display='flex' justifyContent='flex-end' mt={1}>
                <Button onClick={handleChangeName} disabled={ name === currentUser?.fullname || name === '' } variant="contained" size="small">
                    Lưu
                </Button>
            </Box>
        </Box>

    );
}
