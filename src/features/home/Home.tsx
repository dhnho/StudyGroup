import { Box, Grid, Typography, useTheme } from "@mui/material";
import MouseRoundedIcon from '@mui/icons-material/MouseRounded';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import Groups2Icon from '@mui/icons-material/Groups2';

export default function Home() {
    const theme = useTheme()

    return (
        <Box flexDirection={{ xs: 'column-reverse', sm: 'row' }} justifyContent={{ xs: 'center', sm: 'space-around' }} sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Box>
                <Grid container spacing={2}>
                    <Grid size={3} display='flex' boxShadow={2} borderRadius={2} flexDirection='column' alignItems='center' justifyContent='center' sx={{ aspectRatio: '1/1' }} bgcolor={ theme.palette.primary.main }>
                        <MouseRoundedIcon sx={{ color: 'white', fontSize: 30 }} />
                        <Typography color="white" textAlign='center'>Easy</Typography>
                    </Grid>
                    <Grid size={3} display='flex' color='primary' boxShadow={2} borderRadius={2} flexDirection='column' alignItems='center' justifyContent='center' sx={{ aspectRatio: '1/1' }} bgcolor='white'>
                        <WifiTetheringIcon sx={{ color: theme.palette.primary.main, fontSize: 30 }} />
                        <Typography color="primary" textAlign='center'>Online</Typography>
                    </Grid>
                    <Grid size={3} display='flex' boxShadow={2} borderRadius={2} flexDirection='column' alignItems='center' justifyContent='center' sx={{ aspectRatio: '1/1' }} bgcolor={ theme.palette.primary.main }>
                        <AutoStoriesIcon sx={{ color: 'white', fontSize: 30 }} />
                        <Typography color="white" textAlign='center'>Study</Typography>
                    </Grid>
                    <Grid size={3} display='flex' color='primary' boxShadow={2} borderRadius={2} flexDirection='column' alignItems='center' justifyContent='center' sx={{ aspectRatio: '1/1' }} bgcolor='white'>
                        <Groups2Icon sx={{ color: theme.palette.primary.main, fontSize: 30 }} />
                        <Typography color="primary" textAlign='center'>Group</Typography>
                    </Grid>
                </Grid>

                <Typography variant='h5' letterSpacing={2} fontWeight='bold' color="primary" textAlign='center' mt={2}>
                    with
                </Typography>
                
                <Typography variant='h2' fontWeight='bold' color="primary" textAlign='center'>
                    STUDY GROUP
                </Typography>
            </Box>

            <Box sx={{
                
            }}>
                <img src="/gif.gif" alt="" />
            </Box>
        </Box>
    );
}
