import { Box, IconButton } from '@mui/material';
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

type Props = {
    closeWhiteBoard: () => void;
};

export default function WhiteBoard({ closeWhiteBoard }: Props) {
    return (
        <Box position='relative' width='90%' height='90%' className="tldraw__editor">
            <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
                <IconButton aria-label="fingerprint" sx={{ color: 'black' }} onClick={closeWhiteBoard}>
                    <CloseRoundedIcon />
                </IconButton>
            </Box>

			<Tldraw />
		</Box>
    );
}
