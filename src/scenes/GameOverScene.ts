import * as Phaser from 'phaser'
import { FONT_NAME, IMAGE, SCENE } from '../const/const'
import Button from '../components/Button'

export default class GameOverScene extends Phaser.Scene {
    private playAgainBtn: Button
    private homeBtn: Button
    private score: number
    private coin: number

    public constructor() {
        super({
            key: SCENE.GAMEOVER,
        })
    }

    public init(data: { score: number; coin: number }) {
        this.score = data.score
        this.coin = data.coin
    }

    public preload(): void {
        //
    }

    public create(): void {
        this.add
            .rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000)
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

        const text = this.add
            .text(
                (2100 * this.cameras.main.width) / 3200,
                (150 * this.cameras.main.width) / 3200,
                'RESULTS',
                {
                    fontSize: '80px',
                    fontStyle: 'bold',
                    fontFamily: FONT_NAME,
                }
            )
            .setOrigin(0.5, 0.5)
        text.setStroke('#000000', 1)

        const text2 = this.add
            .text(
                (2100 * this.cameras.main.width) / 3200,
                (275 * this.cameras.main.width) / 3200,
                'DISTANCE',
                {
                    fontSize: '80px',
                    fontStyle: 'bold',
                    fontFamily: FONT_NAME,
                }
            )
            .setOrigin(0.5, 0.5)
        text2.setStroke('#000000', 1)

        const text3 = this.add
            .text(
                (2100 * this.cameras.main.width) / 3200,
                (400 * this.cameras.main.width) / 3200,
                `${Math.floor(this.score)}M`,
                {
                    fontSize: '125px',
                    fontFamily: FONT_NAME,
                    fontStyle: 'bold',
                    color: '#fef03b',
                }
            )
            .setOrigin(0.5, 0.5)
        text3.setStroke('#000000', 1)

        const text4 = this.add
            .text(
                (1700 * this.cameras.main.width) / 3200,
                (600 * this.cameras.main.width) / 3200,
                'COLLECTED',
                {
                    fontSize: '60px',
                    fontFamily: FONT_NAME,
                    fontStyle: 'bold',
                }
            )
            .setOrigin(0, 0.5)
        text4.setStroke('#000000', 1)

        const text5 = this.add
            .text(
                (2450 * this.cameras.main.width) / 3200,
                (600 * this.cameras.main.width) / 3200,
                `${this.coin}`,
                {
                    fontSize: '60px',
                    fontFamily: FONT_NAME,
                    color: '#fef03b',
                    fontStyle: 'bold',
                }
            )
            .setOrigin(1, 0.5)
        text5.setStroke('#000000', 1)

        this.add
            .image(
                (2500 * this.cameras.main.width) / 3200,
                (600 * this.cameras.main.width) / 3200,
                IMAGE.COIN
            )
            .setDisplaySize(60, 60)

        this.playAgainBtn = new Button(
            this,
            (2100 * this.cameras.main.width) / 3200,
            (800 * this.cameras.main.width) / 3200,
            (650 * this.cameras.main.width) / 3200,
            (200 * this.cameras.main.width) / 3200,
            'PLAY AGAIN',
            {
                color: '#ffffff',
                fontSize: '80px',
                fontStyle: 'bold',
                fontFamily: FONT_NAME,
            }
        )
        this.playAgainBtn.setInteractive()

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
            this.scene.stop(SCENE.GAMEPLAY)
            this.scene.start(SCENE.MENU)
        } else if (this.playAgainBtn.getIsPointerDown()) {
            this.scene.stop(SCENE.GAMEPLAY)
            this.scene.start(SCENE.GAMEPLAY)
        }
    }
}
