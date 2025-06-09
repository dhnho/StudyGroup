import { createBrowserRouter } from "react-router";
import App from "../layout/App";
import LoginForm from "../../features/account/LoginForm";
import RegisterForm from "../../features/account/RegisterForm";
import Room from "../../features/rooms/Room";
import Home from "../../features/home/Home";

export const router = createBrowserRouter([
    {
        path: '/',
        children: [
            {
                path: '',
                element: <App />,
                children: [
                    { path: 'home', element: <Home /> }
                ]
            },
            { path: 'login', element: <LoginForm /> },
            { path: 'register', element: <RegisterForm /> },
            { path: ':roomId', element: <Room /> },
        ]
    }
])