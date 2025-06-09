import { createContext } from "react";
import { MediaStore } from "./mediaStore";
import { RoomStore } from "./roomStore";
import { UiStore } from "./uiStore";

interface Store {
    mediaStore: MediaStore
    roomStore: RoomStore
    uiStore: UiStore
}

export const store: Store = {
    mediaStore: new MediaStore(),
    roomStore: new RoomStore(),
    uiStore: new UiStore()
}

export const StoreContext = createContext(store);