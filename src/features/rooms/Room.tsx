import CallEndIcon from '@mui/icons-material/CallEnd';
import { Box, Divider, Grid, IconButton, ListItemIcon, Menu, MenuItem, styled, Tooltip } from "@mui/material";
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ChatIcon from '@mui/icons-material/Chat';
import TerminalIcon from '@mui/icons-material/Terminal';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PresentToAllIcon from '@mui/icons-material/PresentToAll';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import DrawIcon from '@mui/icons-material/Draw';
import Media from "./Media";
import { observer } from 'mobx-react-lite';
import { store } from '../../libs/stores/store';
import { useEffect, useState } from 'react';
import Chat from './Chat';
import CodeEditor from '../code-editor/CodeEditor';
import { useNavigate } from 'react-router';
import Members from './Members';
import { useAccount } from '../../libs/hooks/useAccount';
import Files from './Files';
import Screen from './Screen';
import WhiteBoard from './WhiteBoard';

const CustomIconButton = styled(IconButton)({
    backgroundColor: '#333537',
    color: '#e3e3e3',
    margin: '5px',
    '&:hover': {
        backgroundColor: '#434547',
    }
});

const EndCallIconButton = styled(IconButton)({
    backgroundColor: '#dc362e',
    color: '#e3e3e3',
    width: '75px',
    borderRadius: '30px',
    margin: '5px',
    '&:hover': {
        backgroundColor: '#ec463e',
    }
});

const Room = observer(() => {
    const { currentUser } = useAccount();
    const navigate = useNavigate();

    const [messageOpen, setMessageOpen] = useState<boolean>(false);
    const [editorOpen, setEditorOpen] = useState<boolean>(false);
    const [membersOpen, setMembersOpen] = useState<boolean>(false);
    const [filesOpen, setFilesOpen] = useState<boolean>(false);
    const [whiteBoardOpen, setWhiteBoardOpen] = useState<boolean>(false)

    const toggleCamera = async () => {
        store.mediaStore.toggleCamera();
    };

    const toggleAudio = () => {
        store.mediaStore.toggleAudio();
    };

    const hanldeToggleMessageBox = () => {
        setMessageOpen(!messageOpen);
    };

    const handleToggleEditor = () => {
        setEditorOpen(!editorOpen);
    };

    const handleToggleMemers = () => {
        setMembersOpen(!membersOpen);
    };

    //Menu
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        store.uiStore.isIdle()

        // if(!currentUser) {
        //     navigate('/home')
        //     toast.warn("Bạn phải đăng nhập trước")
        // }
    }, [navigate, currentUser]) 

    return (
        <Box sx={{ flexGrow: 1, height: '100vh', backgroundColor: '#131314' }}>
            <Grid container spacing={2} padding={2} height='calc(100% - 67px)'>
                <Grid height='100%' overflow='hidden' sx={{ display: { xs: messageOpen ? 'none' : 'block', sm: 'block' }}}
                    size={{ lg: messageOpen ? 9 : 12, md: messageOpen ? 8 : 12, sm: messageOpen ? 6 : 12, xs: messageOpen ? 0 : 12 }}
                >
                    { store.roomStore.displayMediaStream && <Screen /> }
                    
                    <Media />
                </Grid>

                {
                    messageOpen && <Grid size={{ lg: 3, md: 4, sm: 6, xs: messageOpen ? 12 : 0 }}>
                        <Chat />
                    </Grid>
                }

            </Grid>

            <Box paddingBottom='10px' display='flex' justifyContent='center' position='fixed' right={0} bottom={0} left={0}>
                <CustomIconButton size="large" onClick={toggleCamera}>
                    { store.mediaStore.CameraOn && <VideocamIcon fontSize="inherit" /> }
                    { !store.mediaStore.CameraOn && <VideocamOffIcon fontSize="inherit" /> }
                </CustomIconButton>

                <CustomIconButton size="large" onClick={toggleAudio}>
                    { store.mediaStore.AudioOn && <MicIcon fontSize="inherit" /> }
                    { !store.mediaStore.AudioOn && <MicOffIcon fontSize="inherit" /> }
                </CustomIconButton>

                <CustomIconButton size="large" onClick={hanldeToggleMessageBox}>
                    <ChatIcon fontSize="inherit" />
                </CustomIconButton>

                <Tooltip title="Công cụ">
                    <CustomIconButton
                        onClick={handleClick}
                        size="large"
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <MoreVertIcon fontSize="inherit" />
                    </CustomIconButton>
                </Tooltip>

                <EndCallIconButton size="large" onClick={() => navigate('/')}>
                    <CallEndIcon fontSize="inherit" />
                </EndCallIconButton>

                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    slotProps={{
                        paper: {
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mb: 2,
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
                                    bottom: -8,
                                    right: '48%',
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'center', vertical: 'bottom' }}
                    anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                >
                    <MenuItem onClick={() => {
                        handleClose();
                        handleToggleEditor();
                    }}>
                        <ListItemIcon>
                            <TerminalIcon fontSize="small" />
                        </ListItemIcon>
                        Code Editor
                    </MenuItem>
                    <MenuItem onClick={() => {
                        handleClose();
                        setFilesOpen(!filesOpen)
                    }}>
                        <ListItemIcon>
                            <AttachFileIcon fontSize="small" />
                        </ListItemIcon>
                        Tài liệu
                    </MenuItem>
                    <MenuItem onClick={() => {
                        handleClose();
                        setWhiteBoardOpen(!whiteBoardOpen)
                    }}>
                        <ListItemIcon>
                            <DrawIcon fontSize="small" />
                        </ListItemIcon>
                        Bảng trắng
                    </MenuItem>
                    { !store.roomStore.isShared && <MenuItem onClick={async () => {
                        handleClose();
                        await store.roomStore.toggleShareScreen()
                    }}>
                        <ListItemIcon>
                            <PresentToAllIcon fontSize="small" />
                        </ListItemIcon>
                        Chia sẻ màn hình
                    </MenuItem>}
                    { store.roomStore.isShared && <MenuItem onClick={async () => {
                        handleClose();
                        await store.roomStore.stopSharingScreen()
                    }}>
                        <ListItemIcon>
                            <CancelPresentationIcon fontSize="small" />
                        </ListItemIcon>
                        Dừng chia sẻ
                    </MenuItem>}

                    <Divider />
                    <MenuItem onClick={() => {
                        handleClose();
                        handleToggleMemers();
                    }}>
                        <ListItemIcon>
                            <PeopleAltIcon fontSize="small" />
                        </ListItemIcon>
                        Thành viên
                    </MenuItem>

                </Menu>
            </Box>

            {/* Code Editor */}
            {
                editorOpen && <Box position='fixed' top={0} bottom={0} left={0} right={0} display='flex' justifyContent='center' alignItems='center' bgcolor='rgba(0, 0, 0, 0.8)' zIndex={2}>
                    <CodeEditor closeEditor={() => setEditorOpen(false)} />
                </Box>
            }

            {/* Members */}
            {
                membersOpen && <Box position='fixed' top={0} bottom={0} left={0} right={0} display='flex' justifyContent='center' alignItems='center' bgcolor='rgba(0, 0, 0, 0.8)' zIndex={2}>
                    <Members closeEditor={() => setMembersOpen(false)} />
                </Box>
            }

            {/* Files */}
            {
                filesOpen && <Box position='fixed' top={0} bottom={0} left={0} right={0} display='flex' justifyContent='center' alignItems='center' bgcolor='rgba(0, 0, 0, 0.8)' zIndex={2}>
                    <Files closeFiles={() => setFilesOpen(false)} />
                </Box>
            }

            {
                whiteBoardOpen && <Box position='fixed' top={0} bottom={0} left={0} right={0} display='flex' justifyContent='center' alignItems='center' bgcolor='rgba(0, 0, 0, 0.8)' zIndex={2}>
                    <WhiteBoard closeWhiteBoard={() => setWhiteBoardOpen(false)} />
                </Box>
            }
        </Box>
    );
});

export default Room;