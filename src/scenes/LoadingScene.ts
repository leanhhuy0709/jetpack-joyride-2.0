import * as Phaser from 'phaser'
import { DEPTH } from '../const/depth'
import { AUDIO, COIN_PATTERN, IMAGE, SCENE, SPRITE, TILEMAP } from '../const/const'

export default class LoadingScene extends Phaser.Scene {
    private progressBar: Phaser.GameObjects.Graphics

    public constructor() {
        super({
            key: SCENE.LOADING,
        })
    }

    public preload(): void {
        this.progressBar = this.add.graphics()
        this.progressBar.setDepth(DEPTH.BACKGROUND_HIGH)
        this.add
            .image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'loading-bg')
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height)
        this.load.on('progress', (value: number) => {
            this.progressBar.clear()
            this.progressBar.fillStyle(0xb0bef7, 1)
            this.progressBar.fillRoundedRect(750, 1250, 1600 * value, 50, 20)
            this.progressBar.lineStyle(5, 0x0000)
            this.progressBar.strokeRoundedRect(750, 1250, 1600, 50, 20)
        })

        this.load.spritesheet(SPRITE.BARRY_SPRITE_SHEET, SPRITE.BARRY_SPRITE_SHEET, {
            frameWidth: 93,
            frameHeight: 95,
        })

        this.load.spritesheet(SPRITE.EXPLOSION, SPRITE.EXPLOSION, {
            frameWidth: 64,
            frameHeight: 64,
        })

        this.load.spritesheet(SPRITE.ORB_ANIM, SPRITE.ORB_ANIM, { frameWidth: 62, frameHeight: 42 })

        this.load.spritesheet(SPRITE.GLOW, SPRITE.GLOW, {
            frameWidth: 128,
            frameHeight: 128,
        })

        this.load.spritesheet(SPRITE.ZAP_EFFECT, SPRITE.ZAP_EFFECT, {
            frameWidth: 1024 / 4,
            frameHeight: 117,
        })

        this.load.spritesheet(SPRITE.BULLET_FLASH, SPRITE.BULLET_FLASH, {
            frameWidth: 64,
            frameHeight: 64,
        })

        this.load.spritesheet(SPRITE.COIN_SPRITE, SPRITE.COIN_SPRITE, {
            frameWidth: 32,
            frameHeight: 32,
        })

        this.load.spritesheet(SPRITE.ALARM_LIGHT_EFFECT, SPRITE.ALARM_LIGHT_EFFECT, {
            frameWidth: 1266 / 3,
            frameHeight: 768 / 2,
        })

        this.load.spritesheet(SPRITE.ROCKET, SPRITE.ROCKET, {
            frameWidth: 128 / 4,
            frameHeight: 32,
        })

        this.load.spritesheet(SPRITE.ROCKET_EFFECT, SPRITE.ROCKET_EFFECT, {
            frameWidth: 256 / 4,
            frameHeight: 128 / 2,
        })

        this.load.spritesheet(SPRITE.ROCKET_ALERT, SPRITE.ROCKET_ALERT, {
            frameWidth: 256 / 4,
            frameHeight: 128 / 2,
        })

        this.load.spritesheet(SPRITE.WORKER_1_BODY, SPRITE.WORKER_1_BODY, {
            frameWidth: 128 / 4,
            frameHeight: 256 / 8,
        })

        this.load.spritesheet(SPRITE.WORKER_2_BODY, SPRITE.WORKER_2_BODY, {
            frameWidth: 128 / 4,
            frameHeight: 256 / 8,
        })

        this.load.spritesheet(SPRITE.WORKER_1_HEAD, SPRITE.WORKER_1_HEAD, {
            frameWidth: 128 / 4,
            frameHeight: 256 / 8,
        })

        this.load.spritesheet(SPRITE.WORKER_2_HEAD, SPRITE.WORKER_2_HEAD, {
            frameWidth: 128 / 4,
            frameHeight: 256 / 8,
        })

        this.load.spritesheet(SPRITE.WORKER_FAT_BODY, SPRITE.WORKER_FAT_BODY, {
            frameWidth: 128 / 4,
            frameHeight: 256 / 8,
        })

        this.load.spritesheet(SPRITE.DAN_SPRITE_SHEET, SPRITE.DAN_SPRITE_SHEET, {
            frameWidth: 364 / 4,
            frameHeight: 103,
        })

        for (let i = 0; i < COIN_PATTERN.length; i++) {
            this.load.text(`pattern${i}`, COIN_PATTERN[i])
        }

        for (const value of Object.values(IMAGE)) {
            this.load.image(value, value)
        }

        for (const value of Object.values(AUDIO)) {
            this.load.audio(value, value)
        }

        this.load.tilemapTiledJSON(TILEMAP.MAP_1, TILEMAP.MAP_1)
        this.load.tilemapTiledJSON(TILEMAP.MAP_2, TILEMAP.MAP_2)
        this.load.tilemapTiledJSON(TILEMAP.MAP_3, TILEMAP.MAP_3)
    }

    public create(): void {
        //console.log('Initialize game objects')
    }

    public update(): void {
        this.scene.start(SCENE.MENU)
    }
}
