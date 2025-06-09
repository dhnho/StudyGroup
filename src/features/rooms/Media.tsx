import { Box, Grid } from "@mui/material";
import MediaDetail from "./MediaDetail";
import { useParams } from "react-router";
import { useRoom } from "../../libs/hooks/useRoom";
import { observer } from "mobx-react-lite";
import { store } from "../../libs/stores/store";

const Media = observer(() => {
    const { roomId } = useParams()
    useRoom(roomId)

    const chunkArray = (array: Connection[]) => {
        let rows: number = 0

        if(array.length <= 2) rows = 1
        else if(array.length <= 6) rows = 2
        else rows = 3

        const size = Math.ceil(array.length / rows)

        const result: Connection[][] = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }

        return result;
    };

    if(!store.roomStore.isReady) return

    const chunkedItem = chunkArray(store.roomStore.room!.connections);

    return (
        <Box visibility={ store.roomStore.displayMediaStream ? 'hidden' : 'visible' } height='calc(100vh - 82px)'>
            {
                chunkedItem && chunkedItem.map((rowItems, index) => (
                    <Grid key={index} container paddingTop={2} spacing={2} height='calc(100% / 3)' alignContent='space-evenly' justifyContent='center' alignItems='center'>
                        {
                            rowItems.map((item, index) => (
                                <MediaDetail connection={item} key={index} />
                            ))
                        }
                    </Grid>
                ))
            }
        </Box>
    );
})

export default Media