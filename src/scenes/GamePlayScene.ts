/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
import * as Phaser from 'phaser'
import { AUDIO, FONT_NAME, IMAGE, SCENE, SPRITE, TILEMAP } from '../const/const'
import Player, { PLAYER_STATE } from '../object/Player'
import Score from '../Score'
import Background from '../object/background/Background'
import { DEPTH } from '../const/depth'
import RocketManager from '../object/obstacle/RocketManager'
import WorkerManager from '../object/WorkerManager'
import ZapCoinManager, { DEFAULT_SAFE_DISTACE } from '../object/ZapCoinManager'
import ObjectPool from '../object/ObjectPool'
import Volume from '../object/Volume'
import TileMap from '../object/background/TileMap'
import UserData from '../object/shop/UserData'

export default class GamePlayScene extends Phaser.Scene {
    private player: Player

    private cursors: {
        left: Phaser.Input.Keyboard.Key
        right: Phaser.Input.Keyboard.Key
        up: Phaser.Input.Keyboard.Key
        down?: Phaser.Input.Keyboard.Key
        space?: Phaser.Input.Keyboard.Key
        shift?: Phaser.Input.Keyboard.Key
    }

    public score: Score
    public rocketManager: RocketManager
    public workerManager: WorkerManager
    public zapCoinManager: ZapCoinManager

    private usingKey: boolean
    private usingTouch: boolean

    private isTweenDead: boolean

    private music:
        | Phaser.Sound.WebAudioSound
        | Phaser.Sound.NoAudioSound
        | Phaser.Sound.HTML5AudioSound

    public ground: MatterJS.BodyType
    public ground2: MatterJS.BodyType

    private tileMap: TileMap

    public constructor() {
        super({
            key: SCENE.GAMEPLAY,
        })
    }

    public preload(): void {
        //
    }

    public create(): void {
        this.tileMap = new TileMap(
            this,
            [TILEMAP.MAP_1, TILEMAP.MAP_2, TILEMAP.MAP_3],
            [0xb0e0e6, 0xfec89a, 0xcccccc]
        )

        this.cameras.main.shake(400, new Phaser.Math.Vector2(0.01, 0.01))

        ObjectPool.init(this)
        this.matter.world.setBounds(
            0,
            0,
            (1000 * this.cameras.main.width) / 3200,
            (1600 * this.cameras.main.width) / 3200,
            (64 * this.cameras.main.width) / 3200,
            false,
            false,
            true,
            true
        )
        this.matter.world.enabled = true

        this.ground = this.matter.add.rectangle(
            0,
            (1500 * this.cameras.main.width) / 3200,
            1e9,
            (120 * this.cameras.main.width) / 3200,
            { isStatic: true }
        )
        this.matter.world.add(this.ground)

        this.ground2 = this.matter.add.rectangle(
            0,
            (100 * this.cameras.main.width) / 3200,
            1e9,
            (120 * this.cameras.main.width) / 3200,
            { isStatic: true }
        )
        this.matter.world.add(this.ground2)

        this.player = new Player(
            this,
            (800 * this.cameras.main.width) / 3200,
            (1250 * this.cameras.main.width) / 3200,
            SPRITE.BARRY_SPRITE_SHEET
        )

        if (this.input.keyboard) this.cursors = this.input.keyboard.createCursorKeys()

        this.rocketManager = new RocketManager(this, 3)
        this.workerManager = new WorkerManager(this, 5)
        this.zapCoinManager = new ZapCoinManager(this, 5)

        this.score = new Score(this)

        this.cameras.main.startFollow(
            this.player,
            undefined,
            undefined,
            0,
            (-800 * this.cameras.main.width) / 3200,
            (450 * this.cameras.main.width) / 3200
        )

        this.input.addPointer(1)
        this.usingKey = this.usingTouch = true

        this.isTweenDead = false

        this.player.loadUserData()
        this.music = this.sound.add(AUDIO.MUSIC_GAMEPLAY, { volume: Volume.value })
        this.music.play()
    }

    public update(_time: number, delta: number): void {
        this.matter.world.update(_time, delta)

        this.tileMap.update()

        this.music.setVolume(Volume.value)
        if (this.cursors.space?.isDown) {
            this.usingKey = true
            this.usingTouch = false
            if (this.usingKey && this.player.visible) {
                this.player.flying()
            }
        } else if (this.cursors.space?.isUp) {
            if (this.usingKey) this.player.falling()
        }

        if (this.cursors.shift?.isDown) {
            this.scene.pause(SCENE.GAMEPLAY)
            this.scene.launch(SCENE.PAUSE, { music: this.music })
        }

        if (this.input.pointer1.isDown) {
            this.usingKey = false
            this.usingTouch = true
            if (this.usingTouch && this.player.visible) this.player.flying()
        } else {
            if (this.usingTouch) this.player.falling()
        }

        this.player.update(delta)

        this.workerManager.update(delta, this.player)
        this.workerManager.handleCollider(this.player)

        this.zapCoinManager.update(delta)
        this.rocketManager.update(delta, this.player)

        this.score.add(delta, this.player.getSpeed() / 10)

        if (!this.music.isPlaying && !this.isTweenDead) this.music.play()

        if (
            this.zapCoinManager.checkCollider(this.player) ||
            this.rocketManager.checkCollider(this.player)
        ) {
            this.player.state = PLAYER_STATE.DEAD
            this.player.getBulletFlash().setVisible(false)

            if (!this.isTweenDead) {
                const dead = this.add
                    .sprite(this.player.x, this.player.y, IMAGE.BARRY_DEAD)
                    .setDepth(DEPTH.OBJECT_HIGH)
                this.player.setVisible(false)
                const sp = this.player.getSpeed()
                this.player.setSpeed(0)
                this.tweens.add({
                    targets: dead,
                    x: this.player.x + 500 * sp,
                    y: (1450 * this.cameras.main.width) / 3200,
                    angle: 90,
                    duration: 500,
                    onComplete: () => {
                        console.log('You die!')
                        this.score.saveHighScore()
                        this.music.stop()
                        UserData.addCoin(this.zapCoinManager.getCoinInRound())
                        UserData.saveCoin()
                        this.scene.pause()
                        this.scene.launch(SCENE.GAMEOVER, {
                            score: this.score.getScore(),
                            coin: this.zapCoinManager.getCoinInRound(),
                        })
                    },
                    onUpdate: () => {
                        this.player.setPosition(dead.x, dead.y)
                    },
                })
                this.isTweenDead = true
            }
        }

        this.zapCoinManager.setNewCoin()

        if (this.score.getScore() > this.score.getLevel()) {
            this.score.setLevel(this.score.getLevel() + 100)
            this.player.setSpeed(
                this.evaluateSpeed(this.score.getScore(), this.player.getDefaultSpeed())
            )
            this.zapCoinManager.setMinSafeDistance(
                (DEFAULT_SAFE_DISTACE * this.cameras.main.width) / 3200 +
                    this.player.getSpeed() * 30
            )
        }
    }

    private evaluateSmokeYPosition(x: number, offset: number, coef: number): number {
        return coef * 0.5 * ((x - 1000) / 100) ** 2 + 1000 + offset
    }

    private evaluateSpeed(score: number, init: number): number {
        return Math.log10((0.5 * score) / 1000 + 1) + init
    }
}
