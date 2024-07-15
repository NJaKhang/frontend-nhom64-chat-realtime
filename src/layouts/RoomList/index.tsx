import {ChatType} from "@constants/ChatType.ts";
import {useChatSelector} from "@features/chat/chatSlice.ts";
import RoomChat from "@models/RoomChat.ts";
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
    ListItemIcon,
    Menu,
    MenuItem,
    OutlinedInput,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import chatService from "@services/ChatService.ts";
import React, {useEffect, useState} from 'react';
import RoomItem from "../../components/RoomItem";
import {useRoomAction, useRoomSelector} from "@features/chat/roomSlice.ts";
import {useAppDispatch} from "@redux/store.ts";
import {useAuthSelector} from "@features/auth/authSlice.ts";
import {PersonAdd} from "@mui/icons-material";
import {AddType} from "@constants/AddType.ts";

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
    const [searchKeyWord, setSearchKeyWord] = useState<string>("");
    const [addType, setAddType] = useState<AddType>(null);
    const [openModal, setOpenModal] = React.useState(false);
    const [type, setType] = useState<ChatType>(ChatType.People);
    const [newRoom, setNewRoom] = useState<RoomDisplay>(initialNewRoom);
    const {target, newMessages} = useChatSelector()
    const dispatch = useAppDispatch();
    const {addNewRoom, addRooms} = useRoomAction();
    const {roomList} = useRoomSelector()
    const {user} = useAuthSelector()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        chatService.findRoomChat().then((rooms) => {
            const displayRooms = rooms.map(room => ({
                chat: room,
                highlight: false,
                message: 0
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

    useEffect(() => {
        setSearchKeyWord("")
    }, [target]);

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

        switch (addType) {
            case AddType.AddPerson:
                handleAddPeople(room);
                break;
            case AddType.CreateRoom:
                handleCreateGroup(room);
                break;
            case AddType.JoinRoom:
                break;
        }

        handleClose();
    }

    const handleClose = () => {
        setOpenModal(false);
    };

    const handleNewMessage = (roomList: RoomDisplay[]) => {
        if (newMessages.length > 0) {
            const mesNotify = [...newMessages].pop();
            let receiveIndex: number;

            // Logic tìm vị trí tin nhắn mới cho type people (Do sử dụng giũa type dạng number (server trả về) và type dạng ChatType nên ở đây cần handle thêm, bị lẫn lộn)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (mesNotify.type === ChatType.People || mesNotify.type == 0) {
                receiveIndex = roomList.findIndex(room => room.chat.name === mesNotify.name);
            }

            if (receiveIndex > -1) {
                const [topRoomUpdated] = roomList.splice(receiveIndex, 1);
                roomList.unshift({
                    ...topRoomUpdated,
                    highlight: true,
                    message: newMessages.filter(m => m.name === topRoomUpdated.chat.name).length
                });
            }
        }
        return roomList;
    }

    const handleCreateGroup = (room: RoomDisplay) => {
        // Set room mới lên đầu danh sách (Đã có trong redux)
        chatService.createGroup(room.chat.name)
            .then((newGroup) => {
                console.log('Group created:', newGroup);
                dispatch(addNewRoom(room));
            })
            .catch((error) => {
                console.error('Error creating group:', error);
            })
    }

    const handleAddPeople = (people: RoomDisplay) => {
        dispatch(addNewRoom(people));
    }

    function handleDropdownClose() {
        setAnchorEl(null);

    }

    function handleAddPersonClick() {
        setAddType(AddType.AddPerson);
        handleButtonClick(0)
        setAnchorEl(null);

    }

    function handleCreateGroupClick() {
        setAddType(AddType.CreateRoom)
        handleButtonClick(1)
        setAnchorEl(null);
    }

    function handleJoinGroupClick() {
        setAddType(AddType.JoinRoom)
        handleButtonClick(1)
        setAnchorEl(null);
    }

    const handleInputSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchKeyWord(value);
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
                justifyContent: "space-between",
                gap: 0.5
            }}>
                <Box sx={{paddingY: 2}}>

                    <OutlinedInput placeholder="Search" value={searchKeyWord} size="medium"
                                   onChange={handleInputSearch}/>
                </Box>

                <Box display="flex" alignItems="center">
                    <Tooltip title="Option">
                        <IconButton
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <MoreVertIcon/>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleDropdownClose}
                        onClick={handleDropdownClose}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&::before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }}
                        transformOrigin={{horizontal: 'right', vertical: 'top'}}
                        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                    >

                        <MenuItem onClick={handleAddPersonClick}>
                            <ListItemIcon>
                                <PersonAdd fontSize="small"/>
                            </ListItemIcon>
                            Add people
                        </MenuItem>
                        <MenuItem onClick={handleCreateGroupClick}>
                            <ListItemIcon>
                                <GroupAddIcon fontSize="small"/>
                            </ListItemIcon>
                            Create group
                        </MenuItem>
                        <MenuItem onClick={handleJoinGroupClick}>
                            <ListItemIcon>
                                <GroupAddIcon fontSize="small"/>
                            </ListItemIcon>
                            Join Group
                        </MenuItem>
                    </Menu>
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
                            <Button onClick={handleClose} variant="text">Cancel</Button>
                            <Button onClick={handleSubmit} autoFocus color="primary" variant="contained">
                                Confirm
                            </Button>
                        </DialogActions>
                    </Dialog>
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
                            {roomList.filter(displayRoom => displayRoom.chat.type === 0 && displayRoom.chat.name != user.name && (displayRoom.chat.name.toLowerCase().includes(searchKeyWord.toLowerCase()))).map((displayRoom) =>
                                <RoomItem active={target == displayRoom.chat.name} data={displayRoom}
                                          chatType={value}
                                          key={displayRoom.chat.name}
                                />)}
                        </List>
                    </TabPanel>
                    <TabPanel value={ChatType.Group} sx={{padding: 0}}>
                        <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                            {roomList.filter(displayRoom => displayRoom.chat.type === 1 && displayRoom.chat.name != user.name && (displayRoom.chat.name.toLowerCase().includes(searchKeyWord.toLowerCase()))).map((displayRoom) =>
                                <RoomItem active={target == displayRoom.chat.name} data={displayRoom}
                                          chatType={value}
                                          key={displayRoom.chat.name}
                                />)}
                        </List>
                    </TabPanel>
                </TabContext>
            </Box>
        </Box>
    );
};

export default RoomList;
