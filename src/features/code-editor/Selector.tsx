import { Box, MenuItem, FormControl, InputLabel, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import { LANGUAGE_VERSIONS } from "../../libs/util/util";

const languages = Object.entries(LANGUAGE_VERSIONS);

type Props = {
    onSelect: (language: Language) => void;
};

export default function Selector({ onSelect }: Props) {
    const [lang, setLang] = useState("javascript");

    const handleChange = (event: SelectChangeEvent) => {
        setLang(event.target.value);
        onSelect(event.target.value as Language);
    };

    return (
        <Box margin={1}>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 300 }}>
                <InputLabel id="demo-simple-select-standard-label" sx={{ color: 'white' }}>Languages</InputLabel>
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={lang}
                    onChange={handleChange}
                    label="Age"
                    sx={{
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                        },
                        '& .MuiSelect-icon': {
                            color: 'white',
                        }
                    }}
                >
                    {
                        languages.map(([languages, version]) => (
                            <MenuItem value={languages}>{languages} - {version}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
        </Box>
    );
}
