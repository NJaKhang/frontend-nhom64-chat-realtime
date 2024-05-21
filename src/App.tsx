import './App.css'

import {useEffect} from "react";
import {Route, Routes} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";

function App() {
    useEffect(() => {


        return () => {
        }
    }, [])


    return (
        <>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/" element={<MainPage/>}/>
            </Routes>
        </>
    )
}

export default App
