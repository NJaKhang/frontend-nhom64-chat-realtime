import {useChatSelector} from "@features/chat/chatSlice.ts";
import MessageRes from "@models/Message.ts";
import {Box, Skeleton, Stack} from "@mui/material";
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

            {messages.map(message =><Message key={message.id} message={message}/> )}
            {/*<Skeleton variant="rounded" width={"25%"} height={"40px"}/>*/}
            {/*<Skeleton variant="rounded" width={"33%"} height={"80px"}  sx={{alignSelf: "end"}}/>*/}
            {/*<Skeleton variant="rounded" width={"40%"} height={"40px"} />*/}
            {/*<Skeleton variant="rounded" width={"45%"} height={"80px"} sx={{alignSelf: "end"}}/>*/}
            {/*<Skeleton variant="rounded" width={"20%"} height={"40px"} sx={{alignSelf: "end"}}/>*/}
            {/*<Skeleton variant="rounded" width={"45%"} height={"40px"} />*/}
            {/*<Skeleton variant="rounded" width={"45%"} height={"40px"} sx={{alignSelf: "end"}}/>*/}
            {/*<Skeleton variant="rounded" width={"30%"} height={"40px"}/>*/}
            {/*<Skeleton variant="rounded" width={"20%"} height={"40px"} sx={{alignSelf: "end"}}/>*/}
            {/*<Skeleton variant="rounded" width={"45%"} height={"40px"} sx={{alignSelf: "end"}}/>*/}
        </Box>
    );
};

export default MessageScroll;
