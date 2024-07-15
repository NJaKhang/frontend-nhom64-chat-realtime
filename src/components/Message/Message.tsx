import {useAuthSelector} from "@features/auth/authSlice.ts";
import {useChatSelector} from "@features/chat/chatSlice.ts";
import MessageRes from "@models/Message.ts";
import {Avatar, Box, Typography} from "@mui/material";
import React, {useEffect} from 'react';
import avatarUtils from "../../utils/AvatarUtils.ts";


interface MessageProps{
    message: MessageRes
    showAvatar?: boolean
}

const Message = ({message, showAvatar}: MessageProps) => {
    const {user} = useAuthSelector()
    const {target} = useChatSelector();

    useEffect(() => {

    }, [target]);

    const isOwner = user && user.name == message.name

    return (
        <Box display="flex" justifyContent={isOwner ? "flex-end" : "flex-start"} alignItems="center">
            <Box sx={{marginRight: 1, minWidth: "28px"}}>
                {(showAvatar && !isOwner) && <Avatar {...avatarUtils.avatar(message.name, "28px", "12px")}/>}
            </Box>
            <Typography paddingX={2} paddingY={1} sx={{
                backgroundColor: isOwner ? "primary.main" : "background.paper",
                color: isOwner ? "#fff" : "text.main",
                width: "auto",
                borderRadius: 2,
                maxWidth: "55%"
            }}>
                {message.mes}
            </Typography>
        </Box>
    );
};

export default Message;
