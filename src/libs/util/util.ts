import { z } from "zod";

export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

export const requiredString = (fieldName: string) => z
    .string({ required_error: `${fieldName} không được để trống` })
    .min(1, { message: `${fieldName} không được để trống` });

export const getToken = () => {
    return localStorage.getItem('token') ?? '';
};

export const stringToColor = (string: string) => {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
};

export const LANGUAGE_VERSIONS = {
    javascript: "18.15.0",
    python: "3.10.0",
    csharp: "6.12.0",
    php: "8.2.3",
    c: "10.2.0",
    cpp: "10.2.0"
};

export const LANGUAGE_EXTENSION = {
    javascript: ".js",
    python: ".py",
    csharp: ".cs",
    php: ".php",
    c: ".c",
    cpp: ".cpp"
};

export const CODE_SNIPPETS = {
    javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
    python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
    csharp:
        'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
    php: "<?php\n\n$name = 'Alex';\necho $name;\n",
    c: '#include <stdio.h> \nint main() { \n\tprintf("Hello world"); \n\treturn 0; \n}',
    cpp: '#include <stdio.h> \nint main() { \n\tprintf("Hello world in c++"); \n\treturn 0; \n}'
};