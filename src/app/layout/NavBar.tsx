import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import VideocamIcon from '@mui/icons-material/Videocam';
import { useAccount } from '../../libs/hooks/useAccount';
import { useNavigate } from 'react-router';
import { useRoom } from '../../libs/hooks/useRoom';
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import { store } from '../../libs/stores/store';
import { stringToColor } from '../../libs/util/util';
import { useQueryClient } from '@tanstack/react-query';
import Info from '../../features/account/Info';

function ResponsiveAppBar() {
    const navigate = useNavigate();
    const queryClient = useQueryClient()

    const { currentUser, isUserLoading } = useAccount();
    const { createRoom } = useRoom();

    //Menu
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    //Dialog
    const [open, setOpen] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false)

    if (isUserLoading) {
        store.uiStore.isBusy()
    } else {
        store.uiStore.isIdle()
    }

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    //Xử lý tạo phòng
    const handleCreatingRoom = async () => {
        await createRoom.mutateAsync(undefined, {
            onSuccess: (roomId: string) => {
                store.uiStore.isBusy()
                navigate('/' + roomId);
            }
        });
    };

    //Xử lý tham gia phòng
    const handleJoiningRoom = (roomId: string) => {
        store.uiStore.isBusy()
        navigate('/' + roomId)
    }

    const handleLogout = async () => {
        localStorage.removeItem('token')
        await queryClient.removeQueries({ queryKey: ['currentUser'], exact: true })
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <VideocamIcon fontSize='large' sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            // fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.1rem',
                            color: 'inherit',
                            textDecoration: 'none',

                        }}
                    >
                        STUDY GROUP
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {currentUser
                                ?
                                // pages.map((page) => (
                                //     <MenuItem key={page} onClick={handleCloseNavMenu}>
                                //         <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                                //     </MenuItem>
                                // ))
                                <Box>
                                    <MenuItem onClick={() => {
                                        handleCloseNavMenu();
                                        handleCreatingRoom();
                                    }}>
                                        <Typography sx={{ textAlign: 'center' }}>Tạo phòng</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={() => {
                                        handleCloseNavMenu()
                                        handleClickOpen()
                                    }}>
                                        <Typography sx={{ textAlign: 'center' }}>Tham gia</Typography>
                                    </MenuItem>
                                </Box>
                                :
                                <Box>
                                    <MenuItem onClick={() => {
                                        handleCloseNavMenu();
                                        navigate('/login');
                                    }}>
                                        <Typography sx={{ textAlign: 'center' }}>Đăng nhập</Typography>
                                    </MenuItem>

                                    <MenuItem onClick={() => {
                                        handleCloseNavMenu();
                                        navigate('/register');
                                    }}>
                                        <Typography sx={{ textAlign: 'center' }}>Đăng ký</Typography>
                                    </MenuItem>
                                </Box>

                            }
                        </Menu>
                    </Box>

                    <VideocamIcon fontSize='large' sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.1rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        STUDY GROUP
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {currentUser ?
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button onClick={handleCreatingRoom}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    Tạo phòng
                                </Button>

                                <Button sx={{ my: 2, color: 'white', display: 'block' }} onClick={handleClickOpen}>
                                    Tham gia
                                </Button>
                            </Box>
                            : <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1 }}>
                                <Button onClick={() => { navigate('/login'); }}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    Đăng nhập
                                </Button>
                                <Button onClick={() => { navigate('/register'); }}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    Đăng ký
                                </Button>
                            </Box>
                        }
                    </Box>

                    {currentUser && <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar src={currentUser.photoUrl} sx={{ bgcolor: stringToColor(currentUser.fullname) }}>
                                        {currentUser.fullname[0].toUpperCase()}
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={() => {
                                handleCloseUserMenu()
                                setInfoOpen(true)
                            }}>
                                <Typography sx={{ textAlign: 'center' }}>Thông tin cá nhân</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => {
                                handleCloseUserMenu()
                                handleLogout()
                            }}>
                                <Typography sx={{ textAlign: 'center' }}>Đăng xuất</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>}
                </Toolbar>
            </Container>
            
            {/* Hiển thị Dialog tham gia phòng */}
            <Dialog
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        component: 'form',
                        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries((formData).entries());
                            const roomId = formJson.roomId as string;
                            handleJoiningRoom(roomId)
                            handleClose();
                        },
                    },
                }}
            >
                <DialogTitle>Tham gia</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="roomId"
                        name="roomId"
                        label="Nhập mã phòng"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button type="submit">Vào</Button>
                </DialogActions>
            </Dialog>

            {
                infoOpen && <Box position='fixed' top={0} bottom={0} left={0} right={0} display='inline-grid' justifyContent='center' alignItems='center' bgcolor='rgba(0, 0, 0, 0.8)' zIndex={2}>
                    <Info closeInfo={() => setInfoOpen(false)} />
                </Box>
            }
        </AppBar>
    );
}
export default ResponsiveAppBar;