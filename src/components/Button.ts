import * as Phaser from 'phaser'
import { IMAGE } from '../const/const'
import { DEPTH } from '../const/depth'

export default class Button {
    private rectangle: Phaser.GameObjects.NineSlice
    private text: Phaser.GameObjects.Text

    private isPointerDown: boolean
    private isPointerOver: boolean

    private blackRect: Phaser.GameObjects.Rectangle

    public constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        content = '',
        style?: Phaser.Types.GameObjects.Text.TextStyle | undefined
    ) {
        if (width && height)
            this.rectangle = scene.add
                .nineslice(x, y, IMAGE.BUTTON_BACKING, undefined, width, height, 10, 10)
                .setDisplaySize(width, height)
                .setDepth(DEPTH.OBJECT_MEDIUM)

        this.text = scene.add
            .text(x, y, content, style)
            .setOrigin(0.5, 0.5)
            .setStroke('#000000', 3)
            .setDepth(DEPTH.OBJECT_MEDIUM)
        this.isPointerDown = false

        this.isPointerOver = false

        this.blackRect = scene.add
            .rectangle(x, y, width, height, 0x0000, 1)
            .setDisplaySize(width, height)
            .setSize(width, height)
            .setAlpha(0)
            .setDepth(DEPTH.OBJECT_MEDIUM)

        this.rectangle.setInteractive()
    }

    public setInteractive(): void {
        this.rectangle.on('pointerdown', () => this.handlePointerDown(this))
        this.rectangle.on('pointerup', () => this.handlePointerUp(this))
        this.rectangle.on('pointerover', () => this.handlePointerOver(this))
        this.rectangle.on('pointerout', () => this.handlePointerOut(this))
    }

    private handlePointerDown(btn: Button): void {
        this.isPointerDown = true
        btn.blackRect.setAlpha(0.5)
    }

    private handlePointerUp(btn: Button): void {
        this.isPointerDown = false
        btn.blackRect.setAlpha(0)
    }

    private handlePointerOver(btn: Button): void {
        this.isPointerOver = true
        btn.blackRect.setAlpha(0.5)
    }

    private handlePointerOut(btn: Button): void {
        this.isPointerOver = false
        btn.blackRect.setAlpha(0)
    }

    public getIsPointerDown(): boolean {
        return this.isPointerDown
    }

    public getIsPointerOver(): boolean {
        return this.isPointerOver
    }

    public getRectangle(): Phaser.GameObjects.NineSlice {
        return this.rectangle
    }

    public getText(): Phaser.GameObjects.Text {
        return this.text
    }

    public getBlackRect(): Phaser.GameObjects.Rectangle {
        return this.blackRect
    }

    public setIsPointerDown(val: boolean): void {
        this.isPointerDown = val
    }
}
