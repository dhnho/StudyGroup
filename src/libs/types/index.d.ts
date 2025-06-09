type User = {
    id: string;
    fullname: string;
    email: string;
    photoUrl?: string;
};

type Connection = {
    id: number;
    roomConnection?: string;
    appUserId: string;
    appUser: User;
    mediaStream?: MediaStream;
    cameraOn: boolean;
    audioOn: boolean;
};

type Message = {
    id: number;
    content: string;
    sentDate: Date;
    senderId: string;
    sender: User;
    roomId: string;
};

type Room = {
    id: string;
    persistence: boolean;
    createrId: string;
    connections: Connection[];
    messages: Message[];
};

type FileModel = {
    publicId: string;
    url: string;
    name: string;
    type: string;
    size: string;
};

type FilePagination = {
    files: Files[]
    total: number
}

type ChangePasswordModel = {
    password: string,
    newPassword: string
}

type Language = 'javascript' | 'python' | 'csharp' | 'php' | 'c' | 'cpp';