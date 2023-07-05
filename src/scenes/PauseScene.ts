import * as Phaser from 'phaser'
import { FONT_NAME, IMAGE, SCENE } from '../const/const'
import Button from '../components/Button'

export default class PauseScene extends Phaser.Scene {
    private continueBtn: Button
    private settingBtn: Button
    private homeBtn: Button
    private music:
        | Phaser.Sound.WebAudioSound
        | Phaser.Sound.NoAudioSound
        | Phaser.Sound.HTML5AudioSound

    public constructor() {
        super({
            key: SCENE.PAUSE,
        })
    }

    public init(data: {
        music: Phaser.Sound.WebAudioSound | Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound
    }) {
        this.music = data.music
    }

    public create(): void {
        this.add.rectangle(0, 0, 3200, 1600, 0x000000).setOrigin(0, 0).setAlpha(0.5)

        this.add.rectangle(2100, 100 + 100 / 2, 950, 1250, 0x8aa1c0).setOrigin(0.5, 0)
        this.add.rectangle(2100, 100 + 100 / 2, 930, 1240, 0x242c46).setOrigin(0.5, 0)

        this.add.rectangle(2100, 100 + 100 / 2, 1000, 100, 0x575f61)
        this.add.nineslice(2100, 100 + 100 / 2, IMAGE.BUTTON_BACKING, undefined, 1000, 50)

        this.continueBtn = new Button(this, 2100, 500, 650, 200, 'CONTINUE', {
            color: '#ffffff',
            fontSize: '80px',
            fontStyle: 'bold',
            fontFamily: FONT_NAME,
        })
        this.continueBtn.setInteractive()

        this.settingBtn = new Button(this, 2100, 800, 650, 200, 'SETTING', {
            color: '#ffffff',
            fontSize: '80px',
            fontStyle: 'bold',
            fontFamily: FONT_NAME,
        })
        this.settingBtn.setInteractive()

        this.homeBtn = new Button(this, 2100, 1100, 650, 200, 'HOME', {
            color: '#ffffff',
            fontSize: '80px',
            fontStyle: 'bold',
            fontFamily: FONT_NAME,
        })
        this.homeBtn.setInteractive()
    }

    public update(): void {
        if (this.homeBtn.getIsPointerDown()) {
            this.music.stop()
            this.scene.stop(SCENE.GAMEPLAY)
            this.scene.start(SCENE.MENU)
        } else if (this.continueBtn.getIsPointerDown()) {
            this.scene.resume(SCENE.GAMEPLAY)
            this.scene.stop(SCENE.PAUSE)
        } else if (this.settingBtn.getIsPointerDown()) {
            this.settingBtn.setIsPointerDown(false)
            this.scene.pause(SCENE.PAUSE)
            this.scene.launch(SCENE.SETTING, { scene: SCENE.PAUSE, music: this.music })
            return
        }
    }
}
