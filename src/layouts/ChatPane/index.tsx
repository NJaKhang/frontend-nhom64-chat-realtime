import {useChatSelector} from "@features/chat/chatSlice.ts";
import MessageRes from "@models/Message.ts";
import {Box, Theme} from "@mui/material";
import chatService from "@services/ChatService.ts";
import React, {useEffect, useState} from 'react';
import ChatHeader from "../../components/ChatHeader";
import ChatInput from "../../components/ChatInput";
import MessageScroll from "../../components/MessageScroll";

const ChatPane = () => {
    const [messages, setMessages] = useState<MessageRes[]>([])
    const {target, type} = useChatSelector();

    useEffect(() => {
        console.log("chat pane");
        chatService.findPeopleChats(target).then((data) => {
            setMessages(data)
            console.log(data)
        }).catch((error) => console.log(error))
    }, [target, type])

    return (
        <Box sx={{
            gridArea: "chat-pane",
            padding: 2,
            maxHeight: "100vh"

        }}>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateRows: "min-content 1fr min-content",
                    backgroundColor: (theme: Theme) => theme.palette.grey["50"],
                    borderRadius: 2,
                    height: "100%",
                    padding: 2,
                }}
            >
                <ChatHeader/>
                <MessageScroll messages={messages}/>
                <ChatInput onSubmit={(message) => setMessages([message, ...messages])}/>
            </Box>
        </Box>
    );
};

export default ChatPane;
