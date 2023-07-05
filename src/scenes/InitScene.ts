import * as Phaser from 'phaser'
import { IMAGE, SCENE } from '../const/const'

export default class InitScene extends Phaser.Scene {
    public constructor() {
        super({
            key: SCENE.INIT,
        })
    }

    public preload(): void {
        this.load.image('loading-bg', IMAGE.LOGO2)
    }

    public create(): void {
        //
    }

    public update(): void {
        this.scene.start(SCENE.LOADING)
    }
}
