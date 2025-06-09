import { makeAutoObservable, runInAction } from "mobx"

export class MediaStore {
    CameraOn = false
    AudioOn = false
    
    constructor() {
        makeAutoObservable(this)
    }

    toggleCamera() {
        runInAction(() => {
            this.CameraOn = !this.CameraOn
        })
    }

    toggleAudio() {
        runInAction(() => {
            this.AudioOn = !this.AudioOn
        })
    }
}