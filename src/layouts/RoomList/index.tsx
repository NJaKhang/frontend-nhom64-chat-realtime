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
import {useRoomAction} from "@features/chat/roomSlice.ts";
import {useAppDispatch} from "@redux/store.ts";
import Message from "@models/Message.ts";

interface NewRoom {
    name: string
    type: ChatType
}

const initialNewRoom: NewRoom = {
    name: "",
    type: ChatType.People
};

export interface RoomDisplay {
    chat: RoomChat,
    highlight: boolean
}

const RoomList = () => {

    const [value, setValue] = React.useState(ChatType.People);
    const [displayRooms, setDisplayRooms] = useState<RoomDisplay[]>([])
    const {target, newMessages} = useChatSelector();
    const [openModal, setOpenModal] = React.useState(false);
    const [type, setType] = useState<ChatType>(ChatType.People);
    const [newRoom, setNewRoom] = useState<NewRoom>(initialNewRoom);
    const dispatch = useAppDispatch();
    const {addNewRoom, addRooms} = useRoomAction();

    useEffect(() => {
        chatService.findRoomChat().then((rooms) => {
            const displayRooms = rooms.map(room => ({
                chat: room,
                highlight: false, // Khởi tạo highlight là false cho mỗi phòng chat
            }));
            setDisplayRooms(displayRooms);
            console.log(displayRooms);
            dispatch(addRooms(displayRooms))
        });
    }, []);

    // Effect đẩy dữ liệu người mới vừa nhắn lên trên đầu
    useEffect(() => {
        console.log(target);
        setDisplayRooms(prevRooms => handleNewMessage([...prevRooms]));
        dispatch(addRooms(handleNewMessage([...displayRooms])));
    }, [newMessages]);

    const handleChange = (event: React.SyntheticEvent, newValue: ChatType) => {
        setValue(newValue);
    };

    const handleButtonClick = (type: ChatType) => {
        setType(type);
        setNewRoom(prevState => ({
            ...prevState,
            [type]: type
        }));
        console.log(newRoom.type);
        handleClickOpen();
    }

    const handleClickOpen = () => {
        setOpenModal(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        console.log(name)
        setNewRoom(prevState => ({...prevState, name}));
    }

    const handleSubmit = () => {
        // Thêm vào RoomDisplay
        const room: RoomDisplay = {
            chat: {
                name: newRoom.name,
                type: (newRoom.type === ChatType.People) ? 0 : 1,
                actionTime: new Date()
            },
            highlight: true
        };
        console.log(room);
        // Set room mới lên đầu danh sách
        setDisplayRooms(prevRooms => [room, ...prevRooms]);
        // Gửi new room vào store
        dispatch(addNewRoom(room));
        console.log(displayRooms);
        handleClose();
    }

    const handleClose = () => {
        setOpenModal(false);
    };

    const handleNewMessage = (roomList: RoomDisplay[]) => {
        const updatedRooms: RoomDisplay[] = roomList;
        newMessages.forEach((message: Message) => {
            const index = updatedRooms.findIndex(room => room.chat.name === message.name);
            if (index > -1) {
                const [topRoomUpdated] = updatedRooms.splice(index, 1);
                updatedRooms.unshift({
                    ...topRoomUpdated,
                    highlight: true
                });
            }
        });
        return updatedRooms;
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
                        <IconButton color="primary" onClick={() => handleButtonClick(ChatType.People)}
                                    sx={{padding: "14px"}}>
                            <PersonAddIcon color="primary"/>
                        </IconButton>
                        <IconButton color="primary" onClick={() => handleButtonClick(ChatType.Group)}
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
                            {displayRooms.filter(displayRoom => displayRoom.chat.type === 0).map((displayRoom) => <RoomItem data={displayRoom} chatType={value}
                                                                                           key={displayRoom.chat.name}/>)}
                        </List>
                    </TabPanel>
                    <TabPanel value={ChatType.Group} sx={{padding: 0}}>
                        <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                            {displayRooms.filter(displayRoom => displayRoom.chat.type === 1).map((displayRoom) => <RoomItem data={displayRoom} chatType={value}
                                                                                           key={displayRoom.chat.name}/>)}
                        </List>
                    </TabPanel>
                </TabContext>
            </Box>
        </Box>
    );
};

export default RoomList;
