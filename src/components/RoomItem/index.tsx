import {ChatType} from "@constants/ChatType.ts";
import {useChatAction} from "@features/chat/chatSlice.ts";
import {Avatar, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography} from "@mui/material";
import {useAppDispatch} from "@redux/store.ts";
import React, {useCallback, useEffect, useState} from 'react';
import {useRoomAction, useRoomSelector} from "@features/chat/roomSlice.ts";
import {RoomDisplay} from "../../layouts/RoomList";


interface RoomItemProps {
    chatType: ChatType
    data: RoomDisplay
    itemClick: () => void
}

const RoomItem = ({data, chatType, itemClick}: RoomItemProps) => {
    // useState cho set trạng thái của highlight
    const [highlightItem, setHighlightItem] = useState<boolean>(data.highlight);
    const {setTarget} = useChatAction();
    const {setHighlight} = useRoomAction();
    const dispatch = useAppDispatch();
    const {roomList} = useRoomSelector()

    useEffect(() => {
        const room = roomList.find(room => room.chat.name === data.chat.name);
        if (room) {
            setHighlightItem(room.highlight);
        }
    }, [roomList, data.chat.name]);
    
    const stringToColor = useCallback((string: string) => {

        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */
        console.log(color)
        return color;
    }, [])

    const stringAvatar = useCallback((name: string) => {

        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: `${name[0]}${name[1] }`.toUpperCase(),
        };
    }, [stringToColor])

    function handleClick() {
        dispatch(setTarget({target: data.chat.name, type: chatType}))
        dispatch(setHighlight({ name: data.chat.name, highlight: false }));
        setHighlightItem(false);
        itemClick();
    }

    return (
        <ListItem alignItems="flex-start" disablePadding
        >
            <ListItemButton onClick={() => handleClick()}>
                <ListItemAvatar>
                    <Avatar {...stringAvatar(data.chat.name)}/>

                </ListItemAvatar>

                    <div>
                        <p>

                        </p>
                    </div>
                <ListItemText
                    primary={data.chat.name}
                    secondary={
                        <React.Fragment>
                            <Typography
                                sx={{display: 'inline'}}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                {data.chat.actionTime.toDateString()}
                            </Typography>
                        </React.Fragment>
                    }
                    primaryTypographyProps={{
                        sx: {
                            fontWeight: highlightItem ? 'bold' : 'normal',
                        }
                    }}
                />
            </ListItemButton>
        </ListItem>
    );
};

export default RoomItem;
