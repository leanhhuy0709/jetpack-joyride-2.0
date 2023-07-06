import * as Phaser from 'phaser'
import Bullet from './bullet/Bullet'
import { DEPTH } from '../const/depth'
import Explosion from './bullet/Explosion'
import ObjectPool from './ObjectPool'
import GamePlayScene from '../scenes/GamePlayScene'
import { IMAGE, SPRITE } from '../const/const'
import Equipment from './equipment/Equipment'
import UserData, { PRODUCT_STATE } from './shop/UserData'
import GravityBelt from './equipment/GravityBelt'
import Shoe from './equipment/Shoe'
import AntiWorker from './equipment/AntiWorker'
import Dan from './equipment/Dan'
import GravitySuit from './equipment/GravitySuite'

const DELAY_FIRE_BULLET = 2
export const DEFAULT_JUMP_VELO = -8

export enum PLAYER_STATE {
    FLYING = 'Fly',
    FALLING = 'Fall',
    MOVING = 'Move',
    DEAD = 'Dead',
}
export default class Player extends Phaser.Physics.Matter.Sprite {
    public playerState: PLAYER_STATE
    private bullets: Bullet[]
    private explosions: Explosion[]
    private delayFire: number
    private speed: number
    private bulletFlash: Phaser.GameObjects.Sprite
    private jumpVelo: number = DEFAULT_JUMP_VELO
    private equipments: Equipment[]
    private defaultSpeed: number
    public canFireBullet: boolean
    private shadow: Phaser.GameObjects.Sprite

    public constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
        super(scene.matter.world, x, y, key)
        this.setDisplaySize(
            (140 * scene.cameras.main.width) / 3200,
            (160 * scene.cameras.main.width) / 3200
        )
            .setRectangle(
                (80 * scene.cameras.main.width) / 3200,
                (150 * scene.cameras.main.width) / 3200
            )
            .setFixedRotation()
            .setCollisionGroup(-2)
            .setDepth(DEPTH.OBJECT_VERYHIGH)
            .setOrigin(0.65, 0.5)

        this.initBullet()

        this.equipments = []

        this.playerState = PLAYER_STATE.MOVING
        this.scene.add.existing(this)
        this.createAnims(key)

        this.defaultSpeed = 0.5
        this.speed = this.defaultSpeed
        this.canFireBullet = true
        this.jumpVelo = (DEFAULT_JUMP_VELO * this.scene.cameras.main.width) / 3200

        this.shadow = scene.add
            .sprite(x, y + (200 * scene.cameras.main.width) / 3200, IMAGE.SHADOW)
            .setDepth(DEPTH.OBJECT_MEDIUM)
            .setScale(3)
            .setAlpha(0)
    }

    private createAnims(key: string): void {
        if (this.scene.anims.exists('move')) this.scene.anims.remove('move')
        this.scene.anims.create({
            key: 'move',
            frames: this.anims.generateFrameNumbers(key, { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1,
        })
        if (this.scene.anims.exists('fly')) this.scene.anims.remove('fly')
        this.scene.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers(key, { start: 3, end: 3 }),
            frameRate: 10,
            repeat: 1,
        })
        if (this.scene.anims.exists('fall')) this.scene.anims.remove('fall')
        this.scene.anims.create({
            key: 'fall',
            frames: this.anims.generateFrameNumbers(key, { start: 2, end: 2 }),
            frameRate: 10,
            repeat: 1,
        })
        if (!this.scene.anims.exists('flash'))
            this.scene.anims.create({
                key: 'flash',
                frames: this.bulletFlash.anims.generateFrameNumbers(SPRITE.BULLET_FLASH, {
                    start: 0,
                    end: 3,
                }),
                frameRate: 10,
                repeat: -1,
            })
        this.anims.play('move')
        this.bulletFlash.play('flash')
    }

    private initBullet(): void {
        this.bullets = []
        this.explosions = []
        this.delayFire = DELAY_FIRE_BULLET

        this.bulletFlash = this.scene.add
            .sprite(0, 0, SPRITE.BULLET_FLASH)
            .setDisplaySize(
                (150 * this.scene.cameras.main.width) / 3200,
                (150 * this.scene.cameras.main.width) / 3200
            )
            .setDepth(DEPTH.OBJECT_HIGH)
    }

    public loadUserData(): void {
        for (let i = 0; i < UserData.getNumProduct(); i++) {
            if (UserData.getProductState(i) == PRODUCT_STATE.EQUIPPED) {
                switch (UserData.getProductName(i)) {
                    case 'Gravity Belt':
                        this.addEquipment(new GravityBelt(this))
                        break
                    case 'Shoe':
                        this.addEquipment(new Shoe(this))
                        break
                    case 'AntiWorker':
                        this.addEquipment(new AntiWorker(this))
                        break
                    case 'Dan':
                        this.addEquipment(new Dan(this))
                        break
                    case 'Gravity Suit':
                        this.addEquipment(new GravitySuit(this))
                        break
                }
            }
        }
    }
    public update(delta: number): void {
        super.update()
        const gpScene = this.scene as GamePlayScene
        this.x += delta * this.speed

        switch (this.playerState) {
            case PLAYER_STATE.MOVING:
                if (!gpScene.matter.overlap(this, [gpScene.ground, gpScene.ground2])) {
                    this.falling()
                }
                break
            case PLAYER_STATE.FLYING:
                break
            case PLAYER_STATE.FALLING:
                if (gpScene.matter.overlap(this, [gpScene.ground, gpScene.ground2])) {
                    this.moving()
                } else this.falling()
                break
            case PLAYER_STATE.DEAD:
                this.bulletFlash.setVisible(false)
                break
        }

        this.updateBullet(delta)

        this.shadow
            .setPosition(this.x - (10 * this.scene.cameras.main.width) / 3200, this.shadow.y)
            .setAlpha(
                (this.y - (320 * this.scene.cameras.main.width) / 3200) /
                    980 /
                    this.scene.cameras.main.width /
                    3200
            )
            .setScale(
                (((3 * ((this.y * 3200) / this.scene.cameras.main.width - 320)) / (1300 - 320)) *
                    this.scene.cameras.main.width) /
                    3200
            )
            .setVisible(this.visible)

        for (let i = 0; i < this.equipments.length; i++) this.equipments[i].update(delta)
    }

    private updateBullet(delta: number) {
        const gpScene = this.scene as GamePlayScene

        for (let i = 0; i < this.getBullets().length; i++) {
            this.bullets[i].update(delta)

            if (gpScene.matter.overlap(this.bullets[i], [gpScene.ground])) {
                this.explosions.push(
                    ObjectPool.getExplosion(
                        this.scene,
                        this.bullets[i].x,
                        this.bullets[i].y,
                        SPRITE.EXPLOSION
                    )
                )

                ObjectPool.removeBullet(this.bullets[i])
                this.bullets.splice(i, 1)
                i--
            }
        }

        let countRemovedExplosion = 0
        for (let i = 0; i < this.explosions.length; i++) {
            if (this.explosions[i].alpha == 0) {
                ObjectPool.removeExplosion(this.explosions[i])
                countRemovedExplosion++
            } else break
        }
        if (countRemovedExplosion > 0) this.explosions.splice(0, countRemovedExplosion)

        this.bulletFlash.setPosition(
            this.x - (11 * this.scene.cameras.main.width) / 3200,
            this.y + (135 * this.scene.cameras.main.width) / 3200
        )
    }

    public fireBullet(): void {
        this.delayFire += 0.5
        if (this.delayFire >= DELAY_FIRE_BULLET) {
            this.bullets.push(
                ObjectPool.getBullet(
                    this.scene,
                    this.x - (10 * this.scene.cameras.main.width) / 3200,
                    this.y + (95 * this.scene.cameras.main.width) / 3200,
                    IMAGE.BULLET
                )
            )
            this.delayFire -= DELAY_FIRE_BULLET
        }
    }

    public flying(): void {
        if (this.canFireBullet) {
            if (this.getVelocity()) {
                if (this.getVelocity() && (this.getVelocity().y as number) > this.jumpVelo) {
                    this.setVelocityY(Number(this.getVelocity().y) + this.jumpVelo / 20)
                } else this.setVelocityY(this.jumpVelo)
            }
            this.fireBullet()
            this.bulletFlash.setVisible(true)
        }
        this.playerState = PLAYER_STATE.FLYING
        this.anims.play('fly')
        for (let i = 0; i < this.equipments.length; i++) this.equipments[i].flying()
    }

    public falling(): void {
        const gpScene = this.scene as GamePlayScene
        if (!gpScene.matter.overlap(this, [gpScene.ground, gpScene.ground2])) {
            this.playerState = PLAYER_STATE.FALLING
            this.anims.play('fall')
            this.bulletFlash.setVisible(false)
        }

        for (let i = 0; i < this.equipments.length; i++) this.equipments[i].falling()
    }

    public moving(): void {
        this.anims.play('move')
        this.playerState = PLAYER_STATE.MOVING
    }

    public getBullets(): Bullet[] {
        return this.bullets
    }

    public getSpeed(): number {
        return this.speed
    }

    public setSpeed(speed: number): void {
        this.speed = speed
    }

    public setJumpVelo(jumpVelo: number): void {
        this.jumpVelo = jumpVelo
    }

    public getJumpVelo(): number {
        return this.jumpVelo
    }

    public addEquipment(equipment: Equipment): void {
        equipment.init()
        this.equipments.push(equipment)
    }

    public getEquipments(): Equipment[] {
        return this.equipments
    }

    public removeEquipment(type: typeof Equipment): void {
        for (let i = 0; i < this.equipments.length; i++) {
            if (this.equipments[i] instanceof type) {
                this.equipments[i].remove()
                this.equipments.splice(i, 1)
                break
            }
        }
    }

    public getDefaultSpeed(): number {
        return this.defaultSpeed
    }

    public setDefaultSpeed(speed: number): void {
        this.defaultSpeed = speed
    }

    public getBulletFlash(): Phaser.GameObjects.Sprite {
        return this.bulletFlash
    }
}
