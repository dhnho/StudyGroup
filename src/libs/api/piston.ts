import axios from "axios";
import { LANGUAGE_VERSIONS } from "../util/util";

const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston",
});

export const executeCode = async (language: Language, sourceCode: string) => {
    console.log(language, LANGUAGE_VERSIONS[language], sourceCode)
    const response = await API.post("/execute", {
        language: language,
        version: LANGUAGE_VERSIONS[language],
        files: [
            {
                content: sourceCode,
            },
        ],
    });
    return response.data;
};