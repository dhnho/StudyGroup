import { RefObject, useState } from "react";
import { executeCode } from "../../libs/api/piston";
import { Box, Button, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { LANGUAGE_EXTENSION } from "../../libs/util/util";
import * as monaco from 'monaco-editor';

type Props = {
    editorRef: RefObject<monaco.editor.IStandaloneCodeEditor | null>,
    language: Language
}

export default function Result({ editorRef, language }: Props) {
    const [output, setOutput] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const runCode = async () => {
        if(!editorRef.current) return

        const sourceCode = editorRef.current.getValue();
        if (!sourceCode) return;
        try {
            setIsLoading(true);
            const { run: result } = await executeCode(language, sourceCode);
            setOutput(result.output.split("\n"));
            if (result.stderr)
                setIsError(true);
            setIsError(false);
        } catch {
            toast.error("Lỗi");
        } finally {
            setIsLoading(false);
        }
    };

    const exportCode = async () => {
        if(!editorRef.current) return

        const sourceCode = editorRef.current.getValue();
        if (!sourceCode) return;

        const blob = new Blob([sourceCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = "main" + LANGUAGE_EXTENSION[language];
        a.click();

        URL.revokeObjectURL(url);
    }

    return (
        <Box height="100%" width='100%' display='flex' flexDirection='column' justifyContent='end'>
            <Box mb={2}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={runCode}
                    loading={isLoading}
                    sx={{
                        '&.Mui-disabled': {
                            color: 'white'
                        },
                    }}
                >
                    { isLoading ? 'Loading...' : 'Run code' }
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={exportCode}
                    sx={{
                        marginLeft: 1,
                        '&.Mui-disabled': {
                            color: 'white'
                        },
                    }}
                >
                    Export
                </Button>
            </Box>

            <Box
                height="50vh"
                width='50vh'
                p={2}
                color={isError ? "red.400" : "white"}
                border="1px solid"
                borderRadius={4}
                borderColor={isError ? "red.500" : "#aaa"}
            >
                {
                    output.length > 0 ? output.map((line, i) => <Typography key={i}>{line}</Typography>)
                        : 'Click "Run Code" to see the output here.'
                }
            </Box>
        </Box>
    );
}
