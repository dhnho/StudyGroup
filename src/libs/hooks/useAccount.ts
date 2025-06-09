import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoginSchema } from "../schemas/LoginSchema";
import { RegisterSchema } from "../schemas/RegisterSchema";
import agent from "../api/agent";

export const useAccount = () => {
    const queryClient = useQueryClient()

    const loginUser = useMutation({
        mutationFn: async (schema: LoginSchema) => {
            const response = await agent.post<string>('/account/login', schema);
            return response.data
        },
        onSuccess: async (token: string) => {
            localStorage.setItem('token', token)
        }
    });

    const registerUser = useMutation({
        mutationFn: async (schema: RegisterSchema) => {
            const response = await agent.post<string>('/account/register', schema)
            return response.data
        },
        onSuccess: async (token: string) => {
            localStorage.setItem('token', token)
        }
    })

    const uploadPhoto = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await agent.post<string>('/account/upload', formData)
            return response.data
        },
        onSuccess: async (photoUrl: string) => {
            await queryClient.setQueryData(['currentUser'], (oldData: User) => {
                return {
                    ...oldData,
                    photoUrl: photoUrl
                }
            })
        }
    })

    const changeName = useMutation({
        mutationFn: async (name: string) => {
            const response = await agent.post<string>('/account/change-name?name=' + name)
            return response.data
        },
        onSuccess: async (name: string) => {
            await queryClient.setQueryData(['currentUser'], (oldData: User) => {
                return {
                    ...oldData,
                    fullname: name
                }
            })
        }
    })

    const changePassword = useMutation({
        mutationFn: async (model: ChangePasswordModel) => {
            await agent.post('/account/change-password?password=' + model.password + '&newPassword=' + model.newPassword)
        }
    })

    const { data: currentUser, isLoading: isUserLoading } = useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const response = await agent.get<User>('/account/current-user');
            return response.data;
        },
        enabled: !!localStorage.getItem('token')
    })

    return {
        loginUser,
        registerUser,
        currentUser,
        isUserLoading,
        uploadPhoto,
        changeName,
        changePassword
    }
}