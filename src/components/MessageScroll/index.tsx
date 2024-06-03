import {useChatSelector} from "@features/chat/chatSlice.ts";
import MessageRes from "@models/Message.ts";
import {Box, Stack} from "@mui/material";
import React, {useEffect, useState} from 'react';
import Message from "../Message/Message.tsx";
interface MessageScrollProps{
    messages : MessageRes[]
}
const MessageScroll = ({messages}: MessageScrollProps) => {

    useEffect(() => {

    }, []);
    return (
        <Box sx={{overflow: "auto", display: "flex", flexDirection: "column-reverse", gap: 1, paddingY: 2}}>

            {messages.map(message =><Message message={message}/> )}
        </Box>
    );
};

export default MessageScroll;
