import { useMutation, useQuery } from "@tanstack/react-query";
import agent from "../api/agent";
import { useEffect, useRef } from "react";
import { useAccount } from "./useAccount";
import { store } from "../stores/store";
import { runInAction } from "mobx";

export const useRoom = (roomId?: string) => {
    const { currentUser } = useAccount();
    const { CameraOn, AudioOn } = store.mediaStore
    const { isReady } = store.roomStore

    const created = useRef(false);

    useEffect(() => {
        if (roomId && !created.current) {
            store.roomStore.createHubConnection(roomId);
            created.current = true;
        }

        return () => {
            store.roomStore.stopHubConnection();
            runInAction(() => {
                store.roomStore.room = null;
                store.roomStore.hubConnection = null
                // store.roomStore.peer = null
                store.roomStore.peer?.destroy()

                if(store.roomStore.displayMediaStream) {
                    store.roomStore.displayMediaStream.getTracks().forEach(track => track.stop())
                    store.roomStore.displayMediaStream = null
                }

                store.mediaStore.AudioOn = false
                store.mediaStore.CameraOn = false
            })
        };
    }, [roomId]);

    useEffect(() => {
        console.log(store.roomStore.isReady)
        if (isReady && currentUser) {
            store.roomStore.initPeer(currentUser.id);
        }
    }, [isReady, currentUser]);

    useEffect(() => {
        if(store.roomStore.isReady) store.roomStore.toggleCamera(CameraOn)
    }, [CameraOn])

    useEffect(() => {
        if(store.roomStore.isReady) store.roomStore.toggleAudio(AudioOn)
    }, [AudioOn])

    const createRoom = useMutation({
        mutationFn: async () => {
            const response = await agent.post<string>('/room/create');
            return response.data;
        }
    });

    const { data: rooms } = useQuery({
        queryKey: ['rooms'],
        queryFn: async () => {
            const response = await agent.get<Room[]>('/room/rooms');
            return response.data;
        }
    })

    return {
        createRoom,
        rooms
    };
};
