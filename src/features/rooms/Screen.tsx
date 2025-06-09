import { useEffect, useRef } from "react";
import { store } from "../../libs/stores/store";
import { Box } from "@mui/material";

export default function Screen() {
    const { displayMediaStream } = store.roomStore

    const stream = useRef<HTMLVideoElement>(null)
    
    useEffect(() => {
        if(stream.current && displayMediaStream) {
            stream.current.srcObject = displayMediaStream
        }
    }, [displayMediaStream])

    return (
        <Box height='100%' display='flex' alignItems='center'>
            <video ref={stream} autoPlay muted={store.roomStore.isShared}
                style={{ objectFit: 'contain', width: '100%', height: '100%', borderRadius: 8 }}>
            </video>
        </Box>
    );
}
