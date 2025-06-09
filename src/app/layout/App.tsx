import ResponsiveAppBar from './NavBar';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import Spinner from '../shared/spinner';
import { store } from '../../libs/stores/store';
import Home from '../../features/home/Home';

function App() {
    useEffect(() => {
        const removeUserMessage = localStorage.getItem('removeUser')
        if(removeUserMessage) {
            toast.info(removeUserMessage)
            localStorage.removeItem('removeUser')
        }

    }, [])

    return (
        <Box>
            <ResponsiveAppBar  />

            <Box sx={{ height: 'calc(100vh - 68.5px)' }}>
                <Home />
            </ Box>

            {
                store.uiStore.isLoading && <Box position='fixed' top={0} bottom={0} left={0} right={0} display='flex' justifyContent='center' alignItems='center' bgcolor='rgba(0, 0, 0, 0.8)'>
                    <Spinner />
                </Box>
            }
        </Box>
    );
}

export default App;
