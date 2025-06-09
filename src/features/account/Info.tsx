import { Box, IconButton, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import Profile from "./Profile";
import ChangePassword from "./ChangePassword";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Rooms from "./Rooms";

type Props = {
    closeInfo: () => void
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{  }}>
                    <Box>{children}</Box>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default function Info({ closeInfo }: Props) {

    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        console.log(event)
        setValue(newValue);
    };

    return (
        <Box position='relative'
            sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', paddingX: 2, paddingY: 8, borderRadius: 2 }}
        >
            <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
                <IconButton aria-label="fingerprint" sx={{ color: 'black' }} onClick={closeInfo}>
                    <CloseRoundedIcon />
                </IconButton>
            </Box>

            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={{ borderRight: 1, borderColor: 'divider' }}
            >
                <Tab label="Gần đây" {...a11yProps(0)} />
                <Tab label="Thông tin" {...a11yProps(1)} />
                <Tab label="Đổi mật khẩu" {...a11yProps(2)} />
            </Tabs>
            
            <TabPanel value={value} index={0}>
                <Rooms />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Profile />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <ChangePassword />
            </TabPanel>
        </Box>
    );
}
