import { Avatar, Box, Chip, Grid } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { stringToColor } from "../../libs/util/util";
import SensorsRoundedIcon from '@mui/icons-material/SensorsRounded';
import SensorsOffRoundedIcon from '@mui/icons-material/SensorsOffRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import VideocamOffRoundedIcon from '@mui/icons-material/VideocamOffRounded';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { useAccount } from "../../libs/hooks/useAccount";

type Props = {
    connection: Connection
}

const MediaDetail = observer(({ connection }: Props) => {
    const { currentUser } = useAccount()

    const stream = useRef<HTMLVideoElement>(null)
    const color = stringToColor(connection.appUser.fullname)

    useEffect(() => {
        if(stream.current && connection.mediaStream) {
            stream.current.srcObject = connection.mediaStream
        }
    }, [connection.mediaStream])

    return (
        <Grid position='relative' display='flex' justifyContent='center' alignItems='center' height='100%' borderRadius={2} sx={{ backgroundColor: '#aaa', position: 'relative' }}
              size={{
                md: 3,
                sm: 4,
                xs: 6
              }}>
            <Box sx={{ position: 'absolute', top: 5, left: 5, zIndex: 1 }}>
                { connection.roomConnection && <Chip icon={ <SensorsRoundedIcon /> } label={ connection.appUser.fullname } color="success" size="small" /> }
                { !connection.roomConnection && <Chip icon={ <SensorsOffRoundedIcon /> } label={ connection.appUser.fullname } color="default" size="small" /> }

                { connection.cameraOn && <Chip icon={<VideocamRoundedIcon />} label="On" size="small" color="warning" sx={{ marginX: 1 }} /> }
                { !connection.cameraOn && <Chip icon={<VideocamOffRoundedIcon />} label="Off" size="small" sx={{ marginX: 1 }} /> }

                { connection.audioOn && <Chip icon={<MicIcon />} label="On" size="small" color="secondary" /> }
                { !connection.audioOn && <Chip icon={<MicOffIcon />} label="Off" size="small" /> }
            </Box>
            
            <video ref={stream} autoPlay muted={ currentUser?.id === connection.appUserId }
                style={{ transform: 'scaleX(-1)', width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', zIndex: `${ connection.cameraOn ? 0 : -1 }` }}>
            </video>

            {
                !connection.cameraOn && <Box>
                    <Avatar src={connection.appUser.photoUrl}
                        sx={{ bgcolor: color, width: 80, height: 80, fontSize: '50px', fontWeight: 'bold', position: 'absolute', top: '50%', left: '50%', transform: 'translateX(-50%) translateY(-50%)' }}>
                        { connection.appUser.fullname[0].toUpperCase() }
                    </Avatar>
                </Box>
            }
        </Grid>
    );
})

export default MediaDetail