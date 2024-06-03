import {useAuthAction} from "@features/auth/authSlice.ts";
import {AccountCircle, Lock, Password} from "@mui/icons-material";
import {Box, Button, InputAdornment, Link, OutlinedInput, Theme} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import {useAppDispatch} from "@redux/store.ts";
import authService from "@services/AuthService.ts";
import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";

const LoginPane = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useAppDispatch();
    const {setUser} = useAuthAction()
    const navigate = useNavigate()

    function handleSubmit(e) {
        e.preventDefault();
        authService.login({user: username, pass: password})
            .then(data => dispatch(setUser(data)))
            .then(() => navigate("/"));
    }

    return (
        <Box component="form"
             onSubmit={handleSubmit}
             width={"35%"}
             position="fixed" top="50%" left="50%"
             sx={{transform: "translate(-50%, -50%)", backgroundColor: "background.paper"}}
             boxShadow="gba(0, 0, 0, 0.1) 0px 4px 12px;"
             padding={5}
            borderRadius={2}
        >
            <Grid2 container spacing={2}>
                <Grid2 sm={12}>
                    <Box
                        fontSize={28}
                        fontWeight={600}
                        textAlign={"center"}
                        color={(theme: Theme) => theme.palette.grey["500"]}
                    >
                        Login
                    </Box>
                </Grid2>
                <Grid2 sm={12}>
                    <OutlinedInput size="medium"
                                   fullWidth
                                   placeholder="Username"
                                   startAdornment={(
                                       <InputAdornment position="start">
                                           <AccountCircle sx={{color:(theme:Theme) => theme.palette.grey["400"]}}/>
                                       </InputAdornment>
                                   )}
                                   value={username}
                                   onChange={({target}) => setUsername(target.value)}/>
                </Grid2>
                <Grid2 sm={12}>
                    <OutlinedInput
                        fullWidth
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={({target}) => setPassword(target.value)}
                        startAdornment={(
                            <InputAdornment position="start">
                                <Lock sx={{color:(theme:Theme) => theme.palette.grey["400"]}}/>
                            </InputAdornment>
                        )}/>
                </Grid2>
                <Grid2 sm={12}>
                    <Link>Forgot password ?</Link>
                </Grid2>
                <Grid2 sm={12}>
                    <Button fullWidth variant="contained" type="submit">Login</Button>
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default LoginPane;
