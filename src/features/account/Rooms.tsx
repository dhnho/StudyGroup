import { Avatar, AvatarGroup, Box, Button, Typography } from "@mui/material";
import { useRoom } from "../../libs/hooks/useRoom";
import { stringToColor } from "../../libs/util/util";
import { useAccount } from "../../libs/hooks/useAccount";
import { store } from "../../libs/stores/store";
import { useNavigate } from "react-router";

export default function Rooms() {
    const { currentUser } = useAccount();
    const { rooms } = useRoom();
    const navigate = useNavigate()

    const handleMemberNames = (connections: Connection[]) => {
        let names = '';

        if (connections.length == 1)
            names = 'Chỉ mình bạn';
        else if (connections.length == 2) {
            if (connections[0].appUserId === currentUser?.id)
                names = 'Bạn và ' + connections[1].appUser.fullname;
            else
                names = 'Bạn và ' + connections[0].appUser.fullname;
        } else {
            for (let i = 0; i <= 1; i++) {
                if (connections[i].appUserId === currentUser?.id)
                    names += 'Bạn';
                else
                    names += connections[i].appUser.fullname;

                if (i == 0) names += ', ';
            }

            names += ' và những người khác';
        }

        return names;
    };

    const handleJoiningRoom = (roomId: string) => {
        store.uiStore.isBusy()
        navigate('/' + roomId)
    }

    return (
        <Box ml={1}>
            {
                rooms && rooms.map((room, index) => (
                    <Box key={index} display='flex' alignItems='center'>
                        <AvatarGroup max={4} spacing={24}>
                            {
                                room.connections.map((connection, index) => (
                                    <Avatar key={index} src={connection.appUser.photoUrl} sx={{ bgcolor: stringToColor(connection.appUser.fullname) }}>
                                        {connection.appUser.fullname[0].toUpperCase()}
                                    </Avatar>
                                ))
                            }

                        </AvatarGroup>

                        <Typography variant="body2" color="textDisabled">{handleMemberNames(room.connections)}</Typography>
                        <Button onClick={() => handleJoiningRoom(room.id)} variant="text" sx={{ ml: 1 }}>{room.id}</Button>
                    </Box>
                ))
            }
        </Box>
    );
}
