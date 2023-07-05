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
        this.add.rectangle(0, 0, 3200, 1600, 0x000000).setOrigin(0, 0).setAlpha(0.5)

        this.add.rectangle(2100, 100 + 100 / 2, 950, 1250, 0x8aa1c0).setOrigin(0.5, 0)
        this.add.rectangle(2100, 100 + 100 / 2, 930, 1240, 0x242c46).setOrigin(0.5, 0)

        this.add.rectangle(2100, 100 + 100 / 2, 1000, 100, 0x575f61)
        this.add.nineslice(2100, 100 + 100 / 2, IMAGE.BUTTON_BACKING, undefined, 1000, 50)

        const text = this.add
            .text(2100, 100 + 100 / 2, 'RESULTS', {
                fontSize: '80px',
                fontStyle: 'bold',
                fontFamily: FONT_NAME
            })
            .setOrigin(0.5, 0.5)
        text.setStroke('#000000', 1)

        const text2 = this.add
            .text(2100, 275, 'DISTANCE', {
                fontSize: '80px',
                fontStyle: 'bold',
                fontFamily: FONT_NAME
            })
            .setOrigin(0.5, 0.5)
        text2.setStroke('#000000', 1)

        const text3 = this.add
            .text(2100, 400, `${Math.floor(this.score)}M`, {
                fontSize: '125px',
                fontFamily: FONT_NAME,
                fontStyle: 'bold',
                color: '#fef03b'
            })
            .setOrigin(0.5, 0.5)
        text3.setStroke('#000000', 1)

        const text4 = this.add
            .text(2100 - 400, 600, 'COLLECTED', {
                fontSize: '60px',
                fontFamily: FONT_NAME,
                fontStyle: 'bold',
            })
            .setOrigin(0, 0.5)
        text4.setStroke('#000000', 1)

        const text5 = this.add
            .text(2450, 600, `${this.coin}`, {
                fontSize: '60px',
                fontFamily: FONT_NAME,
                color: '#fef03b',
                fontStyle: 'bold',
            })
            .setOrigin(1, 0.5)
        text5.setStroke('#000000', 1)

        this.add.image(2500, 600, IMAGE.COIN).setDisplaySize(60, 60)

        this.playAgainBtn = new Button(this, 2100, 800, 650, 200, 'PLAY AGAIN', {
            color: '#ffffff',
            fontSize: '80px',
            fontStyle: 'bold',
            fontFamily: FONT_NAME,
        })
        this.playAgainBtn.setInteractive()

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
            this.scene.stop(SCENE.GAMEPLAY)
            this.scene.start(SCENE.MENU)
        } else if (this.playAgainBtn.getIsPointerDown()) {
            this.scene.stop(SCENE.GAMEPLAY)
            this.scene.start(SCENE.GAMEPLAY)
        }
    }
}
