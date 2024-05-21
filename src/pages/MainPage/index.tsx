import {Room} from "@mui/icons-material";
import {Box} from "@mui/material";
import React from 'react';
import SideBar from "../../layouts/SideBar";

const MainPage = () => {
    return (
        <Box>
            <SideBar/>
            <RoomList/>
            <ChatPane/>
        </Box>
    );
};

export default MainPage;
