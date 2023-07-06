import Button from '../components/Button'
import { FONT_NAME, SCENE } from '../const/const'
import { DEPTH } from '../const/depth'
import Volume from '../object/Volume'

export default class SettingScene extends Phaser.Scene {
    private backBtn: Button
    private prevScene: SCENE

    private volumeValue: Phaser.GameObjects.Text

    private plusBtn: Button
    private minusBtn: Button

    private music:
        | Phaser.Sound.WebAudioSound
        | Phaser.Sound.NoAudioSound
        | Phaser.Sound.HTML5AudioSound

    public constructor() {
        super({
            key: SCENE.SETTING,
        })
    }

    public init(data: {
        scene: SCENE
        music: Phaser.Sound.WebAudioSound | Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound
    }) {
        this.prevScene = data.scene
        this.music = data.music
    }

    public create(): void {
        this.add
            .rectangle(
                0,
                0,
                (3200 * this.cameras.main.width) / 3200,
                (1600 * this.cameras.main.width) / 3200,
                0x0000
            )
            .setOrigin(0, 0)
            .setAlpha(0.8)

        this.add
            .rectangle(
                (1600 * this.cameras.main.width) / 3200,
                (200 * this.cameras.main.width) / 3200,
                (2800 * this.cameras.main.width) / 3200,
                (1200 * this.cameras.main.width) / 3200,
                0x1f2944
            )
            .setOrigin(0.5, 0)

        this.backBtn = new Button(
            this,
            (300 * this.cameras.main.width) / 3200,
            (100 * this.cameras.main.width) / 3200,
            (200 * this.cameras.main.width) / 3200,
            (80 * this.cameras.main.width) / 3200,
            'BACK',
            {
                color: '#ffffff',
                fontSize: 40*this.cameras.main.width / 3200,
                fontStyle: 'bold',
                fontFamily: FONT_NAME,
            }
        )
        this.backBtn.setInteractive()

        this.plusBtn = new Button(
            this,
            (2000 * this.cameras.main.width) / 3200,
            (800 * this.cameras.main.width) / 3200,
            (230 * this.cameras.main.width) / 3200,
            (230 * this.cameras.main.width) / 3200,
            '+',
            {
                color: '#ffffff',
                fontSize: 130*this.cameras.main.width / 3200,
                fontStyle: 'bold',
            }
        )
        this.plusBtn.setInteractive()

        this.minusBtn = new Button(
            this,
            (1200 * this.cameras.main.width) / 3200,
            (800 * this.cameras.main.width) / 3200,
            (230 * this.cameras.main.width) / 3200,
            (230 * this.cameras.main.width) / 3200,
            '-',
            {
                color: '#ffffff',
                fontSize: 130*this.cameras.main.width / 3200,
                fontStyle: 'bold',
            }
        )
        this.minusBtn.setInteractive()

        this.volumeValue = this.add
            .text(
                (1600 * this.cameras.main.width) / 3200,
                (800 * this.cameras.main.width) / 3200,
                String(Math.ceil(Volume.value * 100)),
                {
                    fontSize: 130*this.cameras.main.width / 3200,
                    fontStyle: 'bold',
                    fontFamily: FONT_NAME,
                }
            )
            .setDepth(DEPTH.OBJECT_MEDIUM)
            .setOrigin(0.5, 0.5)
    }

    public update(): void {
        if (this.backBtn.getIsPointerDown()) {
            this.scene.stop(SCENE.SETTING)
            this.scene.resume(this.prevScene)
        } else if (this.plusBtn.getIsPointerDown()) {
            Volume.value += 0.005
            if (Volume.value >= 1) Volume.value = 1
            this.volumeValue.setText(String(Math.ceil(Volume.value * 100)))
            this.music.setVolume(Volume.value)
        } else if (this.minusBtn.getIsPointerDown()) {
            Volume.value -= 0.005
            if (Volume.value <= 0) Volume.value = 0
            this.volumeValue.setText(String(Math.ceil(Volume.value * 100)))
            this.music.setVolume(Volume.value)
        }
    }
}
