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
        this.add
            .rectangle(
                0,
                0,
                (3200 * this.cameras.main.width) / 3200,
                (1600 * this.cameras.main.width) / 3200,
                0x000000
            )
            .setOrigin(0, 0)
            .setAlpha(0.5)

        this.add
            .rectangle(
                (2100 * this.cameras.main.width) / 3200,
                (150 * this.cameras.main.width) / 3200,
                (950 * this.cameras.main.width) / 3200,
                (1250 * this.cameras.main.width) / 3200,
                0x8aa1c0
            )
            .setOrigin(0.5, 0)
        this.add
            .rectangle(
                (2100 * this.cameras.main.width) / 3200,
                (150 * this.cameras.main.width) / 3200,
                (930 * this.cameras.main.width) / 3200,
                (1240 * this.cameras.main.width) / 3200,
                0x242c46
            )
            .setOrigin(0.5, 0)

        this.add.rectangle(
            (2100 * this.cameras.main.width) / 3200,
            (150 * this.cameras.main.width) / 3200,
            (1000 * this.cameras.main.width) / 3200,
            (100 * this.cameras.main.width) / 3200,
            0x575f61
        )
        this.add.nineslice(
            (2100 * this.cameras.main.width) / 3200,
            (150 * this.cameras.main.width) / 3200,
            IMAGE.BUTTON_BACKING,
            undefined,
            (1000 * this.cameras.main.width) / 3200,
            (50 * this.cameras.main.width) / 3200
        )

        this.continueBtn = new Button(
            this,
            (2100 * this.cameras.main.width) / 3200,
            (500 * this.cameras.main.width) / 3200,
            (650 * this.cameras.main.width) / 3200,
            (200 * this.cameras.main.width) / 3200,
            'CONTINUE',
            {
                color: '#ffffff',
                fontSize: '80px',
                fontStyle: 'bold',
                fontFamily: FONT_NAME,
            }
        )
        this.continueBtn.setInteractive()

        this.settingBtn = new Button(
            this,
            (2100 * this.cameras.main.width) / 3200,
            (800 * this.cameras.main.width) / 3200,
            (650 * this.cameras.main.width) / 3200,
            (200 * this.cameras.main.width) / 3200,
            'SETTING',
            {
                color: '#ffffff',
                fontSize: '80px',
                fontStyle: 'bold',
                fontFamily: FONT_NAME,
            }
        )
        this.settingBtn.setInteractive()

        this.homeBtn = new Button(
            this,
            (2100 * this.cameras.main.width) / 3200,
            (1100 * this.cameras.main.width) / 3200,
            (650 * this.cameras.main.width) / 3200,
            (200 * this.cameras.main.width) / 3200,
            'HOME',
            {
                color: '#ffffff',
                fontSize: '80px',
                fontStyle: 'bold',
                fontFamily: FONT_NAME,
            }
        )
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
