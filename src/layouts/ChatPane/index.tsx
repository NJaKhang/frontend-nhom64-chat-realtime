import {ChatType} from "@constants/ChatType.ts";
import {useChatAction, useChatSelector} from "@features/chat/chatSlice.ts";
import MessageRes from "@models/Message.ts";
import {Box, Theme} from "@mui/material";
import {useAppDispatch} from "@redux/store.ts";
import chatService from "@services/ChatService.ts";
import socketService from "@services/SocketService.ts";
import React, {useCallback, useEffect, useRef, useState} from 'react';
import ChatHeader from "../../components/ChatHeader";
import ChatInput from "../../components/ChatInput";
import InfiniteScroll from "react-infinite-scroll-component";
import Message from "../../components/Message/Message.tsx";
import {useAuthSelector} from "@features/auth/authSlice.ts";

const chatType = [ChatType.People, ChatType.Group]

const ChatPane = () => {
    const [messages, setMessages] = useState<MessageRes[]>([])
    const {target, type, newMessages} = useChatSelector();
    const dispatch = useAppDispatch();
    const {addNewMessage, removeNewMessage, setTarget} = useChatAction()
    const [loading, setLoading] = useState(false)
    const audioRef = useRef<HTMLAudioElement>(null)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(false)
    const {user} = useAuthSelector();
    useEffect(() => {
        setLoading(true)
        setPage(1)
        setHasMore(false)
        if (type === ChatType.People) {
            chatService.findPeopleChats(target)
                .then((data) => {
                    setMessages(data)
                    if (data.length == 50) {
                        setHasMore(true)
                    } else {
                        setHasMore(false)

                    }
                })
                .then(() => setLoading(false))
                .catch((error) => console.log(error))

        } else {
            chatService.findRoomChats(target)
                .then((data) => {
                    const roomMessages = data.chatData;
                    setMessages(roomMessages)
                    if (roomMessages.length === 50) {
                        setHasMore(true)
                    } else {
                        setHasMore(false)

                    }
                })
                .then(() => setLoading(false))
                .catch((error) => console.log(error))
        }

        socketService.receiveMessageHandler = (message) => {
            console.log(message)
            if (message.name === target) {
                setMessages(prevState => [message, ...prevState])

            } else {
                dispatch(addNewMessage(message));

            }
        }

        dispatch(removeNewMessage({target, type}))
    }, [target, type])

    useEffect(() => {
        if (audioRef.current) {
            const temp = [...newMessages];
            const item = temp.pop()
            if (item) {
                // Kiểm tra xem người gửi có phải là người đăng nhập không
                if (item.name !== user.name) {
                    if (!temp.some(value => value.name == item.to && value.type == item.type)) {

                        audioRef.current.currentTime = 0;
                        audioRef.current.play();


                    }
                }
            }

        }
    }, [newMessages.length]);


    useEffect(() => {
        const temp = newMessages.filter(mes => mes.name == target && chatType[mes.type] == type);
        if (temp.length == 0)
            return
        else {
            setMessages((prev) => [...prev, ...messages])
        }
    }, [newMessages, target, type]);

    useEffect(() => {
    }, [messages]);

    const loadMore = useCallback(() => {
        chatService.findPeopleChats(target, page + 1)
            .then((data) => {
                if (data.length < 50)
                    setHasMore(false)
                setMessages(prevState => [...prevState, ...data]);
                setPage(page + 1)
            })
    }, [hasMore, page, target, type])
    return (
        <Box sx={{
            gridArea: "chat-pane",
            padding: 2,
            maxHeight: "100vh"

        }}>
            {!!target ? (
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
                    <Box sx={{overflow: "auto", display: "flex", flexDirection: "column-reverse", gap: 1, paddingY: 2}}
                         id="container">

                        <InfiniteScroll
                            dataLength={messages.length}
                            next={loadMore}
                            style={{display: 'flex', flexDirection: 'column-reverse', gap: "8px"}}
                            inverse={true} //
                            hasMore={hasMore}
                            loader={<h4>Loading...</h4>}
                            scrollableTarget="container"
                        >
                            {!loading && messages.map(message => <Message key={message.id} message={message}/>)}

                        </InfiniteScroll>
                    </Box>
                    <ChatInput onSubmit={(message) => setMessages([message, ...messages])}/>
                </Box>
            ) : (
                <Box
                    sx={{
                        height: "100%",
                        borderRadius: 2,
                        display: "grid",
                        placeItems: "center"

                    }}
                >

                    <Box component="img" maxWidth="40%" src="/img.png">
                    </Box>
                </Box>
            )
            }
            <audio src="/interface-124464.mp3" hidden ref={audioRef}/>
        </Box>
    );
};

export default ChatPane;
