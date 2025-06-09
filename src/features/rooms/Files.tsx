import { Box, Button, ButtonGroup, IconButton, Paper, styled } from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useFiles } from "../../libs/hooks/useFiles";
import { ChangeEvent, useState } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { useAccount } from "../../libs/hooks/useAccount";
import { store } from "../../libs/stores/store";

type Props = {
    closeFiles: () => void;
};

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

export default function Files({ closeFiles }: Props) {
    const { roomId } = useParams()
    const { currentUser } = useAccount()
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState<boolean>(false)

    const { pagination, isLoading, uploadFile, deleteFile } = useFiles(roomId, page + 1);

    //Kiểu dữ liệu của bảng
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'STT', width: 20 },
        { field: 'name', headerName: 'File name', width: 250 },
        {
            field: 'type',
            headerName: 'Type',
            width: 70
        },
        { field: 'size', headerName: 'Size', width: 90 },
        {
            field: 'action',
            headerName: '',
            width: 120,
            renderCell: (params) => (
                // <>
                //     <Button size="small" variant="contained" onClick={() => window.open(params.row.url)}>Xem</Button>
                //     <Button size="small" variant="contained" color="error">Xóa</Button>
                // </>
                <ButtonGroup variant="contained" aria-label="Basic button group">
                    <Button size="small" color="info" onClick={() => window.open(params.row.url)}>Xem</Button>
                    { store.roomStore.room?.createrId === currentUser?.id && <Button size="small" color="error" onClick={() => handleRemovingFile(params.row.publicId)}>Xóa</Button>}
                </ButtonGroup>
            ),
        },
    ];

    //Đổ dữ liệu vào bảng
    const rows = pagination?.files.map((file, index) => {
        return {
            id: index + 1,
            ...file
        };
    });

    //xử lý thay đổi trang
    const handleChangePage = (model: GridPaginationModel) => {
        setPage(model.page);
    };

    //Xử lý thêm file
    const handleUploadingFile = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.item(0)
        if(!file || !roomId) {
            toast.warning("Vui lòng chọn file");
            return
        }

        if(file.size / 1024 / 1024 > 10) {
            toast.warning("Vui lòng chọn file không quá 10MB");
            return
        }

        setLoading(true)

        const formData = new FormData()
        formData.append('formFile', file)
        formData.append('roomId', roomId)

        await uploadFile.mutateAsync(formData, {
            onSuccess: () => {
                setLoading(false)
                toast.success("Thêm file thành công")
            }
        })
    }

    //Xử lý xóa file
    const handleRemovingFile = async (publicId: string) => {
        await deleteFile.mutateAsync(publicId, {
            onSuccess: () => toast.success("Xóa file thành công")
        })
    }

    return (
        <Paper sx={{ display: 'inline-block', position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 0, right: 0, margin: 1 }}>
                <IconButton aria-label="fingerprint" sx={{ color: 'black' }} onClick={closeFiles}>
                    <CloseRoundedIcon />
                </IconButton>
            </Box>

            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                size="small"
                loading={loading}
                sx={{ marginBottom: '12px', margin: 2 }}
            >
                Thêm
                <VisuallyHiddenInput
                    type="file"
                    onChange={(event) => handleUploadingFile(event)}
                />
            </Button>

            <DataGrid
                loading={isLoading}
                rows={rows}
                columns={columns}
                rowCount={pagination?.total ?? 0}
                paginationMode='server'
                pageSizeOptions={[3]}
                pagination
                paginationModel={ { page: page, pageSize: 3 } }
                onPaginationModelChange={handleChangePage}
                rowSelection={false}
                sx={{ border: 0 }}
            />
        </Paper>
    );
}
