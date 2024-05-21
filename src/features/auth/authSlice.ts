import {User} from "@models/User.ts";
import {createSlice} from "@reduxjs/toolkit";

interface AuthState{
    user: User | null
    loading: boolean
}

const initialState : AuthState = {
    loading: false,
    user: null
}


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

    }
})


export default authSlice