import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import Peer, { MediaConnection } from "peerjs";
import { toast } from "react-toastify";
import { getToken } from "../util/util";
import { store } from "./store";

export class RoomStore {
    room: Room | null = null;
    hubConnection: HubConnection | null = null;

    peer: Peer | null = null;
    currentIndex = -1;

    displayMediaStream: MediaStream | null = null;
    isShared = false;

    get isReady() {
        return this.room !== null;
    }

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection(roomId: string) {
        if (!roomId) return;

        this.hubConnection = new HubConnectionBuilder()
            .withUrl(`${import.meta.env.VITE_ROOM_URL}/rooms?roomId=${roomId}`, {
                accessTokenFactory: () => getToken()
            })
            .withAutomaticReconnect()
            .build();

        this.hubConnection.start().catch(error =>
            console.log('Error establishing connection: ', error));

        this.hubConnection.on('Joined', (room: Room) => {
            runInAction(() => {
                this.room = room;
            });
        });

        this.hubConnection.on('NewConnection', (connection: Connection) => {
            runInAction(() => {
                if (!this.room) return;

                const index = this.room.connections.findIndex(c => c.id === connection.id);
                if (index !== -1) this.room.connections[index] = {
                    ...this.room.connections[index],
                    roomConnection: connection.roomConnection
                };
                else this.room.connections.push(connection);
            });
        });

        this.hubConnection.on('Left', (id: number) => {
            runInAction(() => {
                if (!this.room) return;

                const index = this.room.connections.findIndex(c => c.id === id);
                if (index !== -1) {
                    this.room.connections[index].mediaStream?.getTracks().forEach(track => track.stop())
                    this.room.connections[index] = {
                        ...this.room.connections[index],
                        roomConnection: undefined,
                        cameraOn: false,
                        audioOn: false,
                        mediaStream: undefined
                    };
                }
            });
        });

        this.hubConnection.on('ToggleCamera', (peerId: string, cameraOn: boolean) => {
            runInAction(() => {
                if (!this.room) return;

                const index = this.room.connections.findIndex(c => c.appUserId === peerId);
                if (index !== -1) {
                    this.room.connections[index].mediaStream?.getVideoTracks()
                        .forEach(track => track.enabled = cameraOn);
                    this.room.connections[index].cameraOn = cameraOn;
                }
            });
        });

        this.hubConnection.on('ToggleAudio', (peerId: string, audioOn: boolean) => {
            runInAction(() => {
                if (!this.room) return;

                const index = this.room.connections.findIndex(c => c.appUserId === peerId);
                if (index !== -1) {
                    this.room.connections[index].audioOn = audioOn;
                    this.room.connections[index].mediaStream?.getAudioTracks()
                        .forEach(track => track.enabled = audioOn);
                }
            });
        });

        this.hubConnection.on('NewMessage', (message: Message) => {
            runInAction(() => {
                this.room?.messages.push(message);
            });
        });

        this.hubConnection.on('RemoveMember', (userId: string) => {
            runInAction(() => {
                if (this.room?.connections[this.currentIndex].appUserId == userId) {
                    localStorage.setItem('removeUser', 'Bạn đã bị loại khỏi phòng học');
                    window.location.href = '/';
                }

                if (this.room)
                    this.room.connections = this.room.connections.filter(connection => connection.appUserId !== userId);
            });
        });

        this.hubConnection.on('TuffOffAudio', (userId: string) => {
            runInAction(() => {
                if (!this.room) return;

                if (this.room?.connections[this.currentIndex].appUserId == userId) {
                    store.mediaStore.AudioOn = false
                }

                const index = this.room.connections.findIndex(c => c.appUserId === userId);
                if (index !== -1) {
                    this.room.connections[index].audioOn = false;
                    this.room.connections[index].mediaStream?.getAudioTracks()
                        .forEach(track => track.enabled = false);
                }
            });
        });

        this.hubConnection.on('StopSharing', () => {
            runInAction(() => {
                this.displayMediaStream?.getTracks().forEach(track => track.stop());
                this.displayMediaStream = null;
                this.isShared = false;
            });
        });
    }

    stopHubConnection() {
        if (this.hubConnection?.state === HubConnectionState.Connected) {
            this.hubConnection.stop().catch(error =>
                console.log('Error stopping connection: ', error));
        }
    }

    async initPeer(currentUserId: string) {
        if (!currentUserId || !this.room) return;

        this.peer = new Peer(currentUserId, {
            host: "peerserver-to1e.onrender.com",
            secure: true,
            port: 443,
            path: '/'
        });

        try {
            const localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            localStream.getVideoTracks().forEach(track => track.enabled = false);
            localStream.getAudioTracks().forEach(track => track.enabled = false);

            //gán local stream
            this.addRemoteStream(currentUserId, localStream, true);
            //sau khi mở kết nối thành công, thực hiện gọi các stream khác trong phòng
            this.peer.on('open', () => {
                this.room?.connections.forEach(connection => {
                    if (connection.appUserId !== currentUserId && connection.roomConnection) {
                        const call = this.peer?.call(connection.appUserId, localStream, { metadata: { type: 'open' } });
                        call?.on('stream', (remoteStream: MediaStream) => {
                            runInAction(() => {
                                connection.mediaStream = remoteStream;
                            });
                        });
                    }
                });
            });

            //đáp lại call
            this.peer.on('call', (call: MediaConnection) => {
                const isScreen = call.metadata.type === 'screen';

                if (isScreen)
                    call.answer();
                else
                    call.answer(this.room?.connections[this.currentIndex].mediaStream);

                call.on('stream', (remoteStream: MediaStream) => {
                    if (isScreen)
                        runInAction(() => {
                            this.displayMediaStream = remoteStream;
                        });
                    else {
                        
                        this.addRemoteStream(call.peer, remoteStream);
                    }
                });
            });

            // this.peer.on('connection', (conn: DataConnection) => {
            //     conn.on('data', (data) => {
            //         console.log(data);
            //     });
            // });

            this.peer.on('error', (err) => {
                console.error('Peer error:', err);
            });

        } catch {
            toast.warning("Vui lòng mở quyền truy cập camera và micro trong cài đặt trình duyệt.");
            return undefined;
        }
    }

    addRemoteStream(peerId: string, stream: MediaStream, isCurrentUser?: boolean) {
        if (!this.room) return;

        const index = this.room.connections.findIndex(c => c.appUserId === peerId);
        if (index !== -1) {
            runInAction(() => {
                this.room!.connections[index] = {
                    ...this.room!.connections[index],
                    mediaStream: stream,
                    cameraOn: false
                };

                if (isCurrentUser) this.currentIndex = index;
            });
        }
    }

    async toggleCamera(cameraOn: boolean) {
        if (this.room && this.room.id) await this.hubConnection?.invoke('ToggleCamera', this.room.id, cameraOn);
    }

    async toggleAudio(audioOn: boolean) {
        if (this.room && this.room.id) await this.hubConnection?.invoke('ToggleAudio', this.room.id, audioOn);
    }

    async stopSharingScreen() {
        if (this.room && this.room.id) await this.hubConnection?.invoke('StopSharing', this.room.id);
    }

    async toggleShareScreen() {
        await runInAction(async () => {
            this.displayMediaStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            });

            this.isShared = true;

            this.room?.connections.forEach((connection, index) => {
                if (index != this.currentIndex && this.displayMediaStream) {
                    this.peer?.call(connection.appUserId, this.displayMediaStream, { metadata: { type: 'screen' } });
                }
            });
        });
    }
}