import './App.css'
import AuthorizationFilter from "@features/auth/AuthoriztionFilter.tsx";
import {useAuthAction} from "@features/auth/authSlice.ts";
import {useAppDispatch} from "@redux/store.ts";
import authService from "@services/AuthService.ts";
import socketService from "@services/SocketService.ts";

import {useEffect, useState} from "react";
import {Route, Routes} from "react-router-dom";
import Loader from "./components/Loader";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";

function App() {
    const [loading, setLoading] = useState(true)
    const dispatch = useAppDispatch();
    const {setUser} = useAuthAction()
    useEffect(() => {
        if (socketService.isOpen()) {
            setLoading(false)

        } else {
            socketService.onOpen = () => {
                setLoading(() => false)

            }
        }


        return () => {
        }
    }, [setLoading])


    return (
        <>
            {loading ? (<Loader/>) : (
                <Routes>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/" element={<AuthorizationFilter><MainPage/></AuthorizationFilter>}/>
                </Routes>
            )}
        </>
    )
}

export default App
