import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";


export const useFiles = (roomId?: string, page?: number) => {
    const queryClient = useQueryClient()

    const { data: pagination, isLoading } = useQuery<FilePagination>({
        queryKey: ['files', roomId, page],
        queryFn: async () => {
            const response = await agent.get<FilePagination>(`/files?roomId=${roomId}&page=${page}&pageSize=3`)
            return response.data
        },
        enabled: !!roomId && !!page,
        placeholderData: prev => prev
    })

    const deleteFile = useMutation({
        mutationFn: async (publicId: string) => {
            await agent.post('/files/delete?publicId=' + publicId)
        },
        onSuccess: async () => {
            await queryClient.refetchQueries({ queryKey: ['files', roomId, page] })
        }
    })

    const uploadFile = useMutation({
        mutationFn: async (data: FormData) => {
            const response = await agent.post<FileModel>('/files/upload', data)
            return response.data
        },
        onSuccess: async () => {
            await queryClient.refetchQueries({ queryKey: ['files', roomId, 1] })
        }
    })

    return {
        pagination,
        isLoading,
        uploadFile,
        deleteFile
    }
}