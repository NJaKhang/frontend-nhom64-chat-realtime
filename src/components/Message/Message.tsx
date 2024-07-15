import {useAuthSelector} from "@features/auth/authSlice.ts";
import {useChatSelector} from "@features/chat/chatSlice.ts";
import MessageRes from "@models/Message.ts";
import {Avatar, Box, Typography} from "@mui/material";
import React, {useEffect} from 'react';


interface MessageProps {
    message: MessageRes
    showAvatar?: boolean
}

const Message = ({message, showAvatar}: MessageProps) => {
    const {user} = useAuthSelector()
    const {target, newMessages} = useChatSelector();

    useEffect(() => {

    }, [target]);

    const isOwner = user && user.name == message.name


    return (
        <Box display="flex" justifyContent={isOwner ? "flex-end" : "flex-start"} alignItems="flex-end" padding="2px 0">
            <Box display="flex" justifyContent="flex-end" flexDirection="column" padding="4px 8px">
                <Box sx={{marginRight: 1, minWidth: "24px"}}>
                    {(!isOwner) && <Avatar sx={{width: "24px", height: "24px",}}/>}
                </Box>
                <Box sx={{color: "#3d3d3d"}}>
                    {(!isOwner && message.type === 1) ? message.name : ""}
                </Box>
            </Box>
            <Box sx={{width: "auto",maxWidth: "55%"}}>
                <Box sx={{color: "#888888"}}>
                    {!isOwner ? message.createAt : ""}
                </Box>
                <Typography paddingX={2} paddingY={1} sx={{
                    backgroundColor: isOwner ? "primary.main" : "background.paper",
                    color: isOwner ? "#fff" : "text.main",
                    display: "inline-block",
                    borderRadius: 2,

                }}>
                    {message.mes}
                </Typography>
            </Box>

        </Box>
    );
};

export default Message;
