import { Avatar, Box, Chip, FormControl, IconButton, Input, InputAdornment, InputLabel, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { store } from "../../libs/stores/store";
import SendIcon from '@mui/icons-material/Send';
import { stringToColor } from "../../libs/util/util";

const Chat = observer(() => {
    const messagesRef = useRef<HTMLDivElement>(null);
    const [content, setContent] = useState<string>('');

    const { room } = store.roomStore;

    const handleSendMessage = async () => {
        await store.roomStore.hubConnection?.invoke('SendMessage', content, store.roomStore.room?.id);
        setContent('');
    };

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            await handleSendMessage();
        }
    };

    const handleDateTime = (dateString: Date | string) => {
        const date = new Date(dateString);
        const now = new Date();

        const diffTime = now.getDate() - date.getDate();
        const oneDay = 24 * 60 * 60 * 1000;

        if(diffTime === 0)
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        else if(diffTime === oneDay)
            return 'Hôm qua'
        else
            return date.toLocaleDateString()
    };

    useEffect(() => {
        if (messagesRef.current) {
            const ref = messagesRef.current;
            ref.scrollTop = ref.scrollHeight;
        }
    }, [room?.messages.length]);

    return (
        <Box padding={1} borderRadius={2} height='100%' display='flex' flexDirection='column'
            sx={{ backgroundColor: 'white' }}>
            <Typography variant="h6">
                Tin nhắn
            </Typography>

            <Box ref={messagesRef} sx={{ width: '100%', height: '100px', flexGrow: 1, overflow: 'auto' }}>
                <List sx={{ bgcolor: 'background.paper' }} >
                    {
                        store.roomStore.room?.messages.map(message => (
                            <ListItem alignItems="flex-start" sx={{ padding: '8px' }} key={message.id}>
                                <ListItemAvatar>

                                    <Avatar src={message.sender.photoUrl} sx={{ bgcolor: stringToColor(message.sender.fullname) }}>
                                        {message.sender.fullname[0].toUpperCase()}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                sx={{ color: 'text.primary', display: 'inline', fontWeight: 'bold' }}
                                            >
                                                { message.sender.fullname }
                                            </Typography>

                                            <span style={{ fontSize: '10px', backgroundColor: '#ddd', padding: '2px 5px', borderRadius: '10px', marginLeft: '6px' }}>{ handleDateTime(message.sentDate) }</span>
                                            <br />

                                            {`${message.content}`}
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                        ))
                    }
                </List>
            </Box>

            <FormControl sx={{ m: 1, width: 'calc(100% - 16px)' }} variant="standard">
                <InputLabel htmlFor="standard-adornment-password">Nhập tin nhắn</InputLabel>
                <Input
                    id="standard-adornment-password"
                    type="text"
                    value={content}
                    autoComplete="off"
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                        if (e.target.value.length <= 150)
                            setContent(e.target.value);
                    }}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton disabled={content.length === 0} onClick={handleSendMessage}>
                                <SendIcon />
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
            <Box display="flex" justifyContent="flex-end">
                <Chip label={`${content.length} / 150 ký tự`} size="small" />
            </Box>
        </Box>
    );
});

export default Chat;