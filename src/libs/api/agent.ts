import axios from "axios";
import { toast } from "react-toastify";

const agent = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

agent.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if(token) config.headers['Authorization'] = `Bearer ${token}`
    return config;
})

agent.interceptors.response.use(
    async response => {
        return response;
    },

    async error => {
        const { status, data } = error.response;
        switch (status) {
            case 400:
                toast.error(data)    

                break;

            case 401:
                window.location.href = '/home'
                localStorage.removeItem('token')

                break;

            default:
                break;
        }

        return Promise.reject(error);
    }
);

export default agent;