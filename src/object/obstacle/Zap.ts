import { SPRITE } from '../../const/const'
import { DEPTH } from '../../const/depth'
import GamePlayScene from '../../scenes/GamePlayScene'
import Obstacle from './Obstacle'

export default class Zap extends Obstacle {
    private sprite1: Phaser.Physics.Matter.Sprite
    private sprite2: Phaser.Physics.Matter.Sprite
    private isSpin: boolean
    private glow1: Phaser.GameObjects.Sprite
    private glow2: Phaser.GameObjects.Sprite

    private spinChance: number
    private hardChance: number

    public constructor(scene: Phaser.Scene, x1: number, y1: number, x2: number, y2: number) {
        super(scene)
        this.sprite1 = scene.matter.add
            .sprite(x1, y1, SPRITE.ORB_ANIM, 0, { isStatic: true })
            .setCircle(30)
            .setDisplaySize(62 * 2, 42 * 2)
            .setStatic(true)
            .setDepth(DEPTH.OBJECT_HIGH)
            .setCollisionGroup(-2)

        this.sprite1.anims.create({
            key: 'turn1',
            frames: this.sprite1.anims.generateFrameNumbers(SPRITE.ORB_ANIM, { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1,
        })

        this.sprite2 = scene.matter.add
            .sprite(x2, y2, SPRITE.ORB_ANIM, 0, { isStatic: true })
            .setCircle(30)
            .setDisplaySize(62 * 2, 42 * 2)
            .setStatic(true)
            .setDepth(DEPTH.OBJECT_HIGH)
            .setCollisionGroup(-2)

        this.spinChance = 0.1
        this.hardChance = 0.1

        this.sprite2.anims.create({
            key: 'turn2',
            frames: this.sprite2.anims.generateFrameNumbers(SPRITE.ORB_ANIM, { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1,
        })

        this.glow1 = scene.add
            .sprite(x1, y1, SPRITE.GLOW, 0)
            .setDepth(DEPTH.BACKGROUND_MEDIUM)
            .setDisplaySize(230, 230)

        this.glow1.anims.create({
            key: 'bloom1',
            frames: this.glow1.anims.generateFrameNumbers(SPRITE.GLOW, { start: 0, end: 15 }),
            frameRate: 10,
            repeat: -1,
        })

        this.glow2 = scene.add
            .sprite(x2, y2, SPRITE.GLOW, 0)
            .setDepth(DEPTH.BACKGROUND_MEDIUM)
            .setDisplaySize(230, 230)

        this.glow2.anims.create({
            key: 'bloom2',
            frames: this.glow2.anims.generateFrameNumbers(SPRITE.GLOW, { start: 0, end: 15 }),
            frameRate: 10,
            repeat: -1,
        })

        this.rect = scene.matter.add
            .sprite((x1 + x2) / 2, (y1 + y2) / 2, SPRITE.ZAP_EFFECT, 0, {
                isStatic: true,
            })
            .setOrigin(0.5, 0.5)
            .setDepth(DEPTH.OBJECT_LOW)
            .setRotation(0)
            .setCollisionGroup(-2)

        this.rect.anims.create({
            key: 'electric',
            frames: this.rect.anims.generateFrameNumbers(SPRITE.ZAP_EFFECT, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        })

        this.sprite1.anims.play('turn1')
        this.sprite2.anims.play('turn2')
        this.glow1.anims.play('bloom1')
        this.glow2.anims.play('bloom2')
        this.rect.play('electric')
    }

    public update(delta: number): void {
        if (this.sprite1.x > this.sprite2.x) {
            let tmp = this.sprite1.x
            this.sprite1.x = this.sprite2.x
            this.sprite2.x = tmp
            tmp = this.sprite1.y
            this.sprite1.y = this.sprite2.y
            this.sprite2.y = tmp
        }

        //spin
        if (this.isSpin) {
            let x = (this.sprite1.x + this.sprite2.x) / 2,
                y = (this.sprite1.y + this.sprite2.y) / 2,
                x1 = this.sprite1.x,
                y1 = this.sprite1.y,
                x2 = this.sprite2.x,
                y2 = this.sprite2.y

            const spinSpeed = 0.0001

            this.sprite1.x =
                x +
                (x1 - x) * Math.cos(delta * spinSpeed * Math.PI) -
                (y1 - y) * Math.sin(delta * spinSpeed * Math.PI)
            this.sprite1.y =
                y +
                (x1 - x) * Math.sin(delta * spinSpeed * Math.PI) +
                (y1 - y) * Math.cos(delta * spinSpeed * Math.PI)
            this.sprite2.x =
                x +
                (x2 - x) * Math.cos(delta * spinSpeed * Math.PI) -
                (y2 - y) * Math.sin(delta * spinSpeed * Math.PI)
            this.sprite2.y =
                y +
                (x2 - x) * Math.sin(delta * spinSpeed * Math.PI) +
                (y2 - y) * Math.cos(delta * spinSpeed * Math.PI)

            x = (this.sprite1.x + this.sprite2.x) / 2
            y = (this.sprite1.y + this.sprite2.y) / 2
            x1 = this.sprite1.x
            y1 = this.sprite1.y
            x2 = this.sprite2.x
            y2 = this.sprite2.y

            if (x2 == x1) x2 += 0.00000000001
            this.sprite1.setRotation(Math.PI / 2 + Math.atan((y2 - y1) / (x2 - x1)))
            this.sprite2.setRotation(-Math.PI / 2 + Math.atan((y2 - y1) / (x2 - x1)))
            this.glow1.setRotation(Math.PI / 2 + Math.atan((y2 - y1) / (x2 - x1)))
            this.glow2.setRotation(-Math.PI / 2 + Math.atan((y2 - y1) / (x2 - x1)))
        }
        this.updateRect()
        this.updateGlow()

        const gpScene = this.scene as GamePlayScene
        this.evaluateSpinChance(gpScene.score.getScore())
    }

    public updateGlow(): void {
        this.glow1.x = this.sprite1.x
        this.glow1.y = this.sprite1.y
        this.glow2.x = this.sprite2.x
        this.glow2.y = this.sprite2.y
    }

    public updateRect(): void {
        this.rect.x = (this.sprite1.x + this.sprite2.x) / 2
        this.rect.y = (this.sprite1.y + this.sprite2.y) / 2

        this.rect.setRotation(0)
        let tmp = 0
        if (
            Math.sqrt(
                (this.sprite1.x - this.sprite2.x) ** 2 + (this.sprite1.y - this.sprite2.y) ** 2
            ) == 0
        )
            tmp = 0.0001

        this.rect
            .setDisplaySize(
                Math.sqrt(
                    (this.sprite1.x - this.sprite2.x) ** 2 + (this.sprite1.y - this.sprite2.y) ** 2
                ) + tmp,
                100
            )
            .setRectangle(
                Math.sqrt(
                    (this.sprite1.x - this.sprite2.x) ** 2 + (this.sprite1.y - this.sprite2.y) ** 2
                ) + tmp,
                100 - 50
            )
            .setCollisionGroup(-2)

        tmp = 0
        if (this.sprite2.x - this.sprite1.x == 0) tmp = 0.0001
        this.rect.setRotation(
            Math.atan((this.sprite2.y - this.sprite1.y) / (this.sprite2.x - this.sprite1.x + tmp))
        )
    }

    public reset(minX: number): void {
        const x1 = minX + Phaser.Math.Between(0, 300)
        const x2 = x1 + Phaser.Math.Between(200, 500)
        const y1 = Phaser.Math.Between(650, 1000)
        let y2 = Phaser.Math.Between(650, 1000)
        const tmp = Math.random()

        if (tmp < this.hardChance) y2 = 1250
        else if (tmp < this.hardChance * 2) y2 = 300

        this.sprite1.setRotation(Math.PI / 2 + Math.atan((y2 - y1) / (x2 - x1)))
        this.sprite2.setRotation(-Math.PI / 2 + Math.atan((y2 - y1) / (x2 - x1)))
        this.setAll(this.scene, x1, y1, x2, y2)
        if (Phaser.Math.Between(0, 10) == 10) this.isSpin = true
        else this.isSpin = false
    }

    public maxX(): number {
        return this.sprite2.x > this.sprite1.x ? this.sprite2.x : this.sprite1.x
    }

    public minX(): number {
        return this.sprite2.x < this.sprite1.x ? this.sprite2.x : this.sprite1.x
    }

    public maxY(): number {
        return this.sprite2.y > this.sprite1.y ? this.sprite2.y : this.sprite1.y
    }

    public minY(): number {
        return this.sprite2.y < this.sprite1.y ? this.sprite2.y : this.sprite1.y
    }

    public getBody(): Phaser.Types.Physics.Matter.MatterBody[] {
        return [this.sprite1, this.sprite2, this.rect]
    }

    public setAll(_scene: Phaser.Scene, x1: number, y1: number, x2: number, y2: number): void {
        if (x1 > x2) {
            let tmp = x1
            x1 = x2
            x2 = tmp
            tmp = y1
            y1 = y2
            y2 = tmp
        }

        this.sprite1.x = x1
        this.sprite2.x = x2
        this.sprite1.y = y1
        this.sprite2.y = y2
        this.updateRect()
        this.updateGlow()

        const tmp = Math.random()

        if (tmp < this.spinChance) this.isSpin = true
        else this.isSpin = false
    }

    public evaluateSpinChance(score: number): void {
        this.spinChance = Math.log10((0.5 * score) / 123 + 1) / 3

        if (this.spinChance > 0.6) this.spinChance = 0.6

        this.hardChance = Math.log10((0.5 * score) / 123 + 1) / 6

        if (this.hardChance > 0.3) this.hardChance = 0.3
    }

    public setVisible(visible: boolean): Zap {
        if (this.sprite1.visible == visible) return this

        this.sprite1.setVisible(visible)
        this.sprite2.setVisible(visible)
        this.glow1.setVisible(visible)
        this.glow2.setVisible(visible)
        this.rect.setVisible(visible)
        return this
    }
}
