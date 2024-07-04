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

const RoomList = () => {

    const [value, setValue] = React.useState(ChatType.People);
    const [rooms, setRooms] = useState<RoomChat[]>([])
    const {newMessages} = useChatSelector();
    const [openModal, setOpenModal] = React.useState(false);
    const [type, setType] = useState<ChatType>(ChatType.People);

    const handleChange = (event: React.SyntheticEvent, newValue: ChatType) => {
        setValue(newValue);
    };

    const handleButtonClick = (type: ChatType) => {
        setType(prevState => type);
        console.log(type);
        handleClickOpen();
    }

    const handleClickOpen = () => {
        setOpenModal(true)
    };

    const handleSubmit = () => {
        handleClose();
    }

    const handleClose = () => {
        setOpenModal(false)
    };

    useEffect(() => {
        chatService.findRoomChat().then((rooms) => setRooms(rooms))
    }, []);

    console.log(rooms)

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
                        <IconButton color="primary" onClick={() => handleButtonClick(ChatType.People)} sx={{padding: "14px"}}>
                            <PersonAddIcon color="primary"/>
                        </IconButton>
                        <IconButton color="primary" onClick={() => handleButtonClick(ChatType.Group)} sx={{padding: "14px"}}>
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
                                    <TextField id="outlined-basic" label={type === ChatType.People ? "Add new people" : "Add new group"} variant="outlined" sx={{width: 300}}/>
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
                            {rooms.map((room) => <RoomItem data={room} chatType={value} key={room.name}/>)}
                        </List>
                    </TabPanel>
                    <TabPanel value={ChatType.Group}>Item Two</TabPanel>
                </TabContext>
            </Box>
        </Box>
    );
};

export default RoomList;
