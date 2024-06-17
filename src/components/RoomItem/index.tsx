import {ChatType} from "@constants/ChatType.ts";
import {useChatAction} from "@features/chat/chatSlice.ts";
import RoomChat from "@models/RoomChat.ts";
import {Avatar, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography} from "@mui/material";
import {useAppDispatch} from "@redux/store.ts";
import React from 'react';

interface RoomItemProps {
    chatType: ChatType
    data: RoomChat
}

const RoomItem = ({data, chatType}: RoomItemProps) => {
    const {setTarget} = useChatAction();
    const dispatch = useAppDispatch();


    function handleClick() {
        dispatch(setTarget({target: data.name, type: chatType}))
    }

    return (
        <ListItem alignItems="flex-start" disablePadding
        >
            <ListItemButton onClick={() => handleClick()}>
                <ListItemAvatar>
                    <Avatar alt={data.name} sx={{width: 32, height: 32}}/>
                </ListItemAvatar>
                <ListItemText
                    primary={data.name}
                    secondary={
                        <React.Fragment>
                            <Typography
                                sx={{display: 'inline'}}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                Ali Connors
                            </Typography>
                        </React.Fragment>
                    }
                />
            </ListItemButton>
        </ListItem>
    );
};

export default RoomItem;
