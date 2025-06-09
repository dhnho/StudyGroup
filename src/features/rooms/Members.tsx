import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, Box, Badge } from "@mui/material";
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import React, { Fragment, useState } from "react";
import { store } from "../../libs/stores/store";
import { stringToColor } from "../../libs/util/util";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { observer } from "mobx-react-lite";
import { useAccount } from "../../libs/hooks/useAccount";

type Props = {
    closeEditor: () => void;
};

const Members = observer(({ closeEditor }: Props) => {
    const { currentUser } = useAccount()

    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User>();

    const handleClickOpen = (user: User) => {
        setSelectedUser(user);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAccept = async () => {
        await store.roomStore.hubConnection?.invoke('RemoveMember', store.roomStore.room?.id, selectedUser?.id);
    };

    const handleTurnOffAudio = async (userId: string) => {
        console.log(userId)
        await store.roomStore.hubConnection?.invoke('TurnOffAudio', userId, store.roomStore.room?.id)
    }

    return (
        <Box pr={2} position='relative' sx={{ width: '100%', maxWidth: 400, bgcolor: 'background.paper', height: '85vh', borderRadius: 2 }}>
            <Typography variant="h6" px={2} py={1}>
                Thành viên ({ store.roomStore.room?.connections.length })
            </Typography>

            <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
                <IconButton aria-label="fingerprint" sx={{ color: 'black' }} onClick={closeEditor}>
                    <CloseRoundedIcon />
                </IconButton>
            </Box>

            <List>
                {
                    store.roomStore.room?.connections.map((connection, index) => {
                        const color = stringToColor(connection.appUser.fullname);
                        return <Fragment key={index}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    {
                                        connection.roomConnection
                                            ? <Badge color="success" variant="dot">
                                                <Avatar alt="Remy Sharp" src={connection.appUser.photoUrl}
                                                    sx={{ bgcolor: color }}>
                                                    {connection.appUser.fullname[0].toUpperCase()}
                                                </Avatar>
                                            </Badge>
                                            : <Avatar alt="Remy Sharp" src={connection.appUser.photoUrl}
                                                sx={{ bgcolor: color }}>
                                                {connection.appUser.fullname[0].toUpperCase()}
                                            </Avatar>
                                    }
                                    
                                </ListItemAvatar>
                                <ListItemText
                                    primary={connection.appUser.fullname}
                                    secondary={
                                        <React.Fragment>
                                            {connection.appUser.email}
                                        </React.Fragment>
                                    }
                                />
                                
                                {   connection.audioOn
                                    ? <IconButton onClick={() => handleTurnOffAudio(connection.appUserId)} aria-label="delete">
                                        <MicIcon />
                                      </IconButton>
                                    : <IconButton aria-label="delete">
                                        <MicOffIcon />
                                        </IconButton>
                                }
                                {
                                    currentUser?.id === store.roomStore.room?.createrId &&
                                    currentUser?.id !== connection.appUserId &&
                                    <IconButton aria-label="delete" onClick={() => handleClickOpen(connection.appUser)}>
                                        <PersonRemoveIcon />
                                    </IconButton>
                                }
                                
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </Fragment>;
                    })
                }

            </List>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Loại bỏ thành viên"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc muốn loại thành viên {' '}
                        <span style={{ fontWeight: 'bold' }}>
                            {selectedUser?.fullname}
                        </span> {' '}
                        khỏi phòng học?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={() => {
                        handleClose();
                        handleAccept();
                    }} autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
});

export default Members;