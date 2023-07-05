import Player from '../Player'
import { DEPTH } from '../../const/depth'
import { AUDIO, COIN_PATTERN, SPRITE } from '../../const/const'
import ZapCoinManager from '../ZapCoinManager'
import Volume from '../Volume'

export default class Coin {
    private scene: Phaser.Scene
    private coins: Phaser.Physics.Matter.Sprite[]
    private minX: number
    private maxX: number
    private minY: number
    private maxY: number
    private coinPatternIdx: number
    private static sound1: Phaser.Sound.WebAudioSound | Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound
    private static sound2: Phaser.Sound.WebAudioSound | Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound
    private static sound3: Phaser.Sound.WebAudioSound | Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound

    public constructor(scene: Phaser.Scene, x: number, y: number, coinPatternIdx = 1) {
        this.scene = scene
        this.coinPatternIdx = coinPatternIdx
        if (coinPatternIdx >= COIN_PATTERN.length) coinPatternIdx = 0
        const coinPattern = this.scene.cache.text.get(`pattern${coinPatternIdx}`)
        let row = 0,
            col = 0
        const d = 70

        const temp = this.scene.add.sprite(-20, -20, SPRITE.COIN_SPRITE)
        if (!this.scene.anims.exists('turn'))
            this.scene.anims.create({
                key: 'turn',
                frames: temp.anims.generateFrameNumbers(SPRITE.COIN_SPRITE, { start: 0, end: 7 }),
                frameRate: 10,
                repeat: -1,
            })

        this.coins = []
        this.minX = x
        this.maxX = x
        this.minY = y
        this.maxY = y

        for (let i = 0; i < coinPattern.length; i++) {
            if (coinPattern[i] == '\n') {
                row++
                col = 0
                continue
            }
            if (coinPattern[i] == '1') {
                this.coins.push(
                    this.scene.matter.add
                        .sprite(x + col * d, y + row * d, SPRITE.COIN_SPRITE, 0, { isStatic: true })
                        .setDisplaySize(50, 50)
                        .play('turn')
                        .setCollisionGroup(-2)
                        .setDepth(DEPTH.OBJECT_LOW)
                )
                this.minX = Math.min(this.minX, x + col * d)
                this.maxX = Math.max(this.maxX, x + col * d)
                this.minY = Math.min(this.minY, y + row * d)
                this.maxY = Math.max(this.maxY, y + row * d)
            }
            col++
        }
        if (!Coin.sound1) Coin.sound1 = this.scene.sound.add(AUDIO.COIN_COLLECT_1)
        if (!Coin.sound2) Coin.sound2 = this.scene.sound.add(AUDIO.COIN_COLLECT_2)
        if (!Coin.sound3) Coin.sound3 = this.scene.sound.add(AUDIO.COIN_COLLECT_3)
        Coin.sound1.stop()
        Coin.sound2.stop()
        Coin.sound3.stop()
    }

    public handleColliderWithPlayer(player: Player, coinManager: ZapCoinManager): void {
        const diff = 100
        if (
            player.x - diff > this.maxX + this.coins[0].width / 2 ||
            player.x + diff < this.minX - this.coins[0].width / 2 ||
            player.y + diff < this.minY - this.coins[0].height / 2 ||
            player.y - diff > this.maxY + this.coins[0].height / 2
        )
            return
        for (let i = 0; i < this.coins.length; i++) {
            if (this.scene.matter.overlap(player, [this.coins[i]])) {
                if (this.coins[i].visible) {
                    this.coins[i].setVisible(false)
                    coinManager.addCoin()

                    Coin.playSound()
                }
            }
        }
    }

    public getMinX(): number {
        return this.minX
    }

    public getMaxX(): number {
        return this.maxX
    }

    public getMinY(): number {
        return this.minY
    }

    public getMaxY(): number {
        return this.maxY
    }

    public setVisible(isVisible: boolean): Coin {
        for (let i = 0; i < this.coins.length; i++) {
            this.coins[i].setVisible(isVisible)
        }
        return this
    }

    public setAll(scene: Phaser.Scene, x: number, y: number): Coin {
        this.scene = scene
        const coinPattern = this.scene.cache.text.get(`pattern${this.coinPatternIdx}`)
        let row = 0,
            col = 0
        const d = 70

        this.minX = x
        this.maxX = x
        this.minY = y
        this.maxY = y

        let idx = 0

        for (let i = 0; i < coinPattern.length; i++) {
            if (coinPattern[i] == '\n') {
                row++
                col = 0
                continue
            }
            if (coinPattern[i] == '1') {
                this.coins[idx++]
                    .setPosition(x + col * d, y + row * d)
                    .play('turn')
                    .setCollisionGroup(-2)
                    .setVisible(true)

                this.minX = Math.min(this.minX, x + col * d)
                this.maxX = Math.max(this.maxX, x + col * d)
                this.minY = Math.min(this.minY, y + row * d)
                this.maxY = Math.max(this.maxY, y + row * d)
            }
            col++
        }
        return this
    }

    public static playSound(): void {
        Coin.sound1.setVolume(Volume.value)
        Coin.sound1.play()
        //Coin.sound2.play()
        //Coin.sound3.play()
    }
}
