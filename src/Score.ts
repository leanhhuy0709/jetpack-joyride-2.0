import { FONT_NAME } from './const/const'
import { DEPTH } from './const/depth'

export default class Score extends Phaser.GameObjects.Text {
    private score: number
    private highScore: number
    private level: number

    public constructor(scene: Phaser.Scene) {
        super(
            scene,
            (10 * scene.cameras.main.width) / 3200,
            (60 * scene.cameras.main.width) / 3200,
            '0',
            {}
        )

        this.scene.add.existing(this)

        this.setFontSize((80 * this.scene.cameras.main.width) / 3200)
        this.setColor('#ffffff')
        this.setFontFamily(FONT_NAME)
        this.setStroke('#000000', (5 * scene.cameras.main.width) / 3200)
        this.setDepth(DEPTH.OBJECT_VERYLOW)

        this.score = 0
        if (localStorage.getItem('highscore'))
            this.highScore = Number(localStorage.getItem('highscore'))
        else this.highScore = 0
        this.level = 100
    }

    public add(delta: number, coeff = 1): void {
        this.score += delta * coeff

        if (this.highScore < this.score) {
            this.highScore = this.score
        }

        this.setNewScore()
    }

    public setNewScore(): void {
        this.setText(`${Math.floor(this.score)}`)
        this.x = this.scene.cameras.main.scrollX + 10
    }

    public resetScore(): void {
        this.score = 0
        this.setNewScore()
    }

    public getLevel(): number {
        return this.level
    }

    public setLevel(level: number): void {
        this.level = level
    }

    public getScore(): number {
        return this.score
    }

    public saveHighScore(): void {
        localStorage.setItem('highscore', `${this.highScore}`)
    }
}
