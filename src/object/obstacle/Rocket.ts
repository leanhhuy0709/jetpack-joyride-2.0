import { SPRITE } from '../../const/const'
import { DEPTH } from '../../const/depth'
import Player from '../Player'
import Obstacle from './Obstacle'

const MIN_SPEED = 10
const MAX_SPEED = 20
const MIN_MOVEY = 1
const MAX_MOVEY = 9
export default class Rocket extends Obstacle {
    private fire: Phaser.Physics.Matter.Sprite
    private alert: Phaser.GameObjects.Sprite
    private speed: number
    private isWaiting: boolean
    private moveY: number
    public constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene)
        this.rect = this.scene.matter.add
            .sprite(x, y, SPRITE.ROCKET, undefined, { isStatic: true })
            .setScale((3 * scene.cameras.main.height) / 1600)
            .setRectangle(
                (85 * scene.cameras.main.width) / 3200,
                (50 * scene.cameras.main.height) / 1600
            )
            .setStatic(true)
            .setDepth(DEPTH.OBJECT_HIGH)
            .setCollisionGroup(-2)

        if (!this.scene.anims.exists('rocket-turn'))
            this.scene.anims.create({
                key: 'rocket-turn',
                frames: this.rect.anims.generateFrameNumbers(SPRITE.ROCKET, {
                    start: 0,
                    end: 3,
                }),
                frameRate: 10,
                repeat: -1,
            })

        this.rect.anims.play('rocket-turn')

        this.fire = this.scene.matter.add
            .sprite(
                x + (80 * scene.cameras.main.width) / 3200,
                y,
                SPRITE.ROCKET_EFFECT,
                undefined,
                { isStatic: true }
            )
            .setDepth(DEPTH.OBJECT_HIGH)
            .setScale((2 * scene.cameras.main.height) / 1600)
            .setRectangle(
                (85 * scene.cameras.main.width) / 3200,
                (50 * scene.cameras.main.height) / 1600
            )
            .setStatic(true)
            .setCollisionGroup(-2)

        if (!this.scene.anims.exists('rocket-fire'))
            this.scene.anims.create({
                key: 'rocket-fire',
                frames: this.rect.anims.generateFrameNumbers(SPRITE.ROCKET_EFFECT, {
                    start: 0,
                    end: 3,
                }),
                frameRate: 10,
                repeat: -1,
            })

        this.fire.anims.play('rocket-fire')

        this.alert = this.scene.add
            .sprite(x, y, SPRITE.ROCKET_ALERT)
            .setDepth(DEPTH.OBJECT_HIGH)
            .setScale(2.5)

        if (!this.scene.anims.exists('alert'))
            this.scene.anims.create({
                key: 'alert',
                frames: this.alert.anims.generateFrameNumbers(SPRITE.ROCKET_ALERT, {
                    start: 0,
                    end: 7,
                }),
                frameRate: 5,
                repeat: 0,
            })

        this.speed = (Phaser.Math.Between(MIN_SPEED, MAX_SPEED) * scene.cameras.main.width) / 3200
        this.moveY = (Phaser.Math.Between(MIN_MOVEY, MAX_MOVEY) * scene.cameras.main.width) / 3200
        this.isWaiting = false
    }

    public update(_delta: number, player: Player | undefined = undefined): void {
        if (this.isWaiting && this.alert.anims.isPlaying) {
            //follow player
            const d = this.moveY
            if (player) {
                if (Math.abs(player.y - this.alert.y) < d) this.alert.y = player.y
                if (player.y > this.alert.y) this.alert.y += d
                else if (player.y < this.alert.y) this.alert.y -= d
            }
            this.alert.x = this.scene.cameras.main.scrollX + 3000
            this.rect.y = this.fire.y = this.alert.y
            this.rect.x = this.alert.x + (100 * this.scene.cameras.main.width) / 3200
            this.fire.x = this.alert.x + (180 * this.scene.cameras.main.width) / 3200
        }
        if (this.isWaiting && !this.alert.anims.isPlaying) {
            if (!this.rect.visible) {
                this.rect.setVisible(true)
                this.fire.setVisible(true)
                this.alert.setVisible(false)
            }
            this.rect.x -= this.speed
            this.fire.x -= this.speed
        }
    }

    public reset(minX: number): void {
        this.rect.x = minX + (100 * this.scene.cameras.main.width) / 3200
        this.fire.x = minX + (180 * this.scene.cameras.main.width) / 3200
        this.alert.x = minX
        const y = (Phaser.Math.Between(400, 600) * this.scene.cameras.main.height) / 1600
        this.rect.y = y
        this.fire.y = y
        this.alert.y = y
        this.isWaiting = false
        this.speed =
            (Phaser.Math.Between(MIN_SPEED, MAX_SPEED) * this.scene.cameras.main.width) / 3200
        this.moveY =
            (Phaser.Math.Between(MIN_MOVEY, MAX_MOVEY) * this.scene.cameras.main.width) / 3200

        this.rect.setVisible(false)
        this.fire.setVisible(false)
        this.alert.setVisible(true)
    }

    public maxX(): number {
        return this.fire.x + this.fire.width
    }

    public maxY(): number {
        return this.fire.y + this.fire.height
    }

    public minX(): number {
        return this.rect.x
    }

    public minY(): number {
        return this.rect.y
    }

    public getBody(): Phaser.Types.Physics.Matter.MatterBody[] {
        return [this.rect, this.fire]
    }

    public startAlert(): void {
        this.alert.play('alert')
        this.isWaiting = true
    }

    public setAll(scene: Phaser.Scene, x: number, y: number): void {
        this.scene = scene
        this.rect.x = x + (100 * scene.cameras.main.width) / 3200
        this.fire.x = x + (180 * scene.cameras.main.width) / 3200
        this.alert.x = x

        this.rect.y = y
        this.fire.y = y
        this.alert.y = y
        this.speed = (Phaser.Math.Between(MIN_SPEED, MAX_SPEED) * scene.cameras.main.width) / 3200
        this.moveY = (Phaser.Math.Between(MIN_MOVEY, MAX_MOVEY) * scene.cameras.main.width) / 3200

        this.isWaiting = false
        this.rect.setVisible(false)
        this.fire.setVisible(false)
        this.alert.setVisible(true)
    }

    public setVisible(visible: boolean): Rocket {
        this.rect.setVisible(visible)
        this.fire.setVisible(visible)
        this.alert.setVisible(visible)
        return this
    }
}
