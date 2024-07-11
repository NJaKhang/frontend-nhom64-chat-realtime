import {ChatType} from "@constants/ChatType.ts";
import {useChatSelector} from "@features/chat/chatSlice.ts";
import RoomChat from "@models/RoomChat.ts";
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import {TabContext, TabPanel} from "@mui/lab";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    List,
    TextField,
    Typography
} from "@mui/material";
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import chatService from "@services/ChatService.ts";
import React, {useEffect, useState} from 'react';
import RoomItem from "../../components/RoomItem";
import {useRoomAction, useRoomSelector} from "@features/chat/roomSlice.ts";
import {useAppDispatch} from "@redux/store.ts";
import Message from "@models/Message.ts";
import {useAuthSelector} from "@features/auth/authSlice.ts";

export interface RoomDisplay {
    chat: RoomChat,
    highlight: boolean
    message: number;
}

const initialNewRoom: RoomDisplay = {
    chat: {
        name: "",
        type: 0,
        actionTime: new Date()
    },
    highlight: false,
    message: 0
};

const RoomList = () => {

    const [value, setValue] = React.useState(ChatType.People);
    const {target, newMessages} = useChatSelector();
    const [openModal, setOpenModal] = React.useState(false);
    const [type, setType] = useState<ChatType>(ChatType.People);
    const [newRoom, setNewRoom] = useState<RoomDisplay>(initialNewRoom);
    const dispatch = useAppDispatch();
    const {addNewRoom, addRooms} = useRoomAction();
    const {roomList} = useRoomSelector()
    const {user} = useAuthSelector()

    useEffect(() => {
        chatService.findRoomChat().then((rooms) => {
            const displayRooms = rooms.map(room => ({
                chat: room,
                highlight: false,
                message: 0// Khởi tạo highlight là false cho mỗi phòng chat
            }));
            dispatch(addRooms(displayRooms))
        });
    }, []);

    // Effect đẩy dữ liệu người mới vừa nhắn lên trên đầu
    useEffect(() => {
        dispatch(addRooms(handleNewMessage([...roomList])));
    }, [newMessages]);

    const handleChange = (event: React.SyntheticEvent, newValue: ChatType) => {
        setValue(newValue);
    };

    const handleButtonClick = (cType: number) => {
        const chatType = (cType === 0) ? ChatType.People : ChatType.Group;
        setType(chatType);
        setNewRoom(prevState => ({
            ...prevState,
            chat: {
                ...prevState.chat,
                type: cType
            }
        }));
        console.log(newRoom);
        handleClickOpen();
    }

    const handleClickOpen = () => {
        setOpenModal(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setNewRoom(prevState => ({
            ...prevState,
            chat: {
                ...prevState.chat,
                name: name
            }
        }));
    }

    const handleSubmit = () => {
        // Thêm vào RoomDisplay
        const room: RoomDisplay = {
            chat: {
                name: newRoom.chat.name,
                type: newRoom.chat.type,
                actionTime: newRoom.chat.actionTime
            },
            highlight: true,
            message: 0
        };
        console.log(room);
        // Set room mới lên đầu danh sách
        // Gửi new room vào store
        dispatch(addNewRoom(room));
        handleClose();
    }

    const handleClose = () => {
        setOpenModal(false);
    };

    const handleNewMessage = (roomList: RoomDisplay[]) => {
        const mes = [...newMessages]
        newMessages.forEach((message: Message) => {
            const index = roomList.findIndex(room => room.chat.name === message.name);
            if (index > -1) {
                const [topRoomUpdated] = roomList.splice(index, 1);
                roomList.unshift({
                    ...topRoomUpdated,
                    highlight: true,
                    message: newMessages.filter(m => m.name === topRoomUpdated.chat.name).length
                });
            }
        });
        return roomList;
    }

    return (
        <Box sx={{
            gridArea: "room-list",
            width: "320px",
            padding: 2,
            display: "flex",
            flexDirection: "column"

        }}>
            <Box>
                <Typography fontSize={24} fontWeight={500} color={(theme) => theme.palette.grey["600"]}>
                    Live Chat
                </Typography>
            </Box>

            <Box sx={{
                display: "flex",
                justifyContent: "space-between"
            }}>
                <Box sx={{paddingY: 2}}>
                    <TextField size="medium"/>
                </Box>

                <Box sx={{
                    paddingY: 2,
                }}>
                    <Box>
                        <IconButton color="primary" onClick={() => handleButtonClick(0)}
                                    sx={{padding: "14px"}}>
                            <PersonAddIcon color="primary"/>
                        </IconButton>
                        <IconButton color="primary" onClick={() => handleButtonClick(1)}
                                    sx={{padding: "14px"}}>
                            <GroupAddIcon color="primary"/>
                        </IconButton>
                        <Dialog
                            open={openModal}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title" sx={{
                                fontWeight: "bold",
                                fontSize: "20px"
                            }}>
                                {type === ChatType.People ? "Add new people" : "Add new group"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description" sx={{paddingTop: "10px"}}>
                                    <TextField
                                        id="outlined-basic"
                                        label={type === ChatType.People ? "Add new people" : "Add new group"}
                                        variant="outlined"
                                        sx={{width: 300}}
                                        name={"name"}
                                        onChange={handleInputChange}
                                    />
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions sx={{paddingRight: "24px"}}>
                                <Button onClick={handleClose} color="error" variant="contained">Cancel</Button>
                                <Button onClick={handleSubmit} autoFocus color="success" variant="contained">
                                    Confirm
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </Box>
            </Box>

            <Box sx={{flex: 1}}>
                <TabContext value={value}>
                    <Tabs value={value} onChange={handleChange} aria-label="icon tabs example" variant="fullWidth">
                        <Tab icon={<PersonOutlineOutlinedIcon fontSize="small"/>} value={ChatType.People}
                             aria-label="phone"/>
                        <Tab icon={<GroupOutlinedIcon fontSize="small"/>} aria-label="favorite" value={ChatType.Group}/>
                    </Tabs>
                    <TabPanel value={ChatType.People} sx={{padding: 0}}>
                        <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                            {roomList.filter(displayRoom => displayRoom.chat.type === 0 && displayRoom.chat.name != user.name).map((displayRoom) =>
                                <RoomItem active={target == displayRoom.chat.name} data={displayRoom}
                                          chatType={value}
                                          key={displayRoom.chat.name}/>)}
                        </List>
                    </TabPanel>
                    <TabPanel value={ChatType.Group} sx={{padding: 0}}>
                        <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                            {roomList.filter(displayRoom => displayRoom.chat.type === 1 && displayRoom.chat.name != user.name).map((displayRoom) =>
                                <RoomItem active={target == displayRoom.chat.name} data={displayRoom}
                                          chatType={value}
                                          key={displayRoom.chat.name}/>)}
                        </List>
                    </TabPanel>
                </TabContext>
            </Box>
        </Box>
    );
};

export default RoomList;
