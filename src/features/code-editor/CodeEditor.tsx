import { Editor } from "@monaco-editor/react";
import { Box, Grid, IconButton } from "@mui/material";
import { useRef, useState } from "react";
import Selector from "./Selector";
import Result from "./Result";
import { CODE_SNIPPETS } from "../../libs/util/util";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import * as monaco from 'monaco-editor';

type Props = {
    closeEditor: () => void
}

export default function CodeEditor({ closeEditor }: Props) {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const [value, setValue] = useState<string>();
    const [language, setLanguage] = useState<Language>("javascript");

    const onMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
        editorRef.current = editor;
        editor.focus();
    };

    const onSelect = (language: Language) => {
        setLanguage(language);
        setValue(CODE_SNIPPETS[language]);
    };

    return (
        <Grid container spacing={3} px={2} pb={4} bgcolor='#2e2e2e' sx={{ boxShadow: `0px 0px 50px 1px #000` }} position='relative'>
            <Grid size={8}>
                <Selector onSelect={onSelect} />
                <Editor
                    options={{
                        minimap: {
                            enabled: false,
                        },
                    }}
                    height="50vh"
                    theme="vs-dark"
                    language={language}
                    defaultValue={CODE_SNIPPETS[language]}
                    onMount={onMount}
                    value={value}
                    onChange={(value) => setValue(value)}
                />
            </Grid>
            <Grid size={4}>
                <Result editorRef={editorRef} language={language} />
            </Grid>

            <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
                <IconButton aria-label="fingerprint" sx={{ color: 'white' }} onClick={closeEditor}>
                    <CloseRoundedIcon />
                </IconButton>
            </Box>
        </Grid>
    );
}
