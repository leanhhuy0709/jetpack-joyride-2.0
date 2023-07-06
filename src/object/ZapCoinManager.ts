import { FONT_NAME } from '../const/const'
import { DEPTH } from '../const/depth'
import ObjectPool from './ObjectPool'
import Player from './Player'
import Coin from './coin/Coin'
import Zap from './obstacle/Zap'

export const DEFAULT_SAFE_DISTACE = 800
export default class ZapCoinManager {
    private zaps: Zap[]
    private coins: Coin[]
    private numObject: number

    private scene: Phaser.Scene
    private minSafeDistance: number = DEFAULT_SAFE_DISTACE

    private coinInRound = 0
    private coinInRoundText: Phaser.GameObjects.Text

    public constructor(scene: Phaser.Scene, numObject: number) {
        this.scene = scene
        this.numObject = numObject
        this.zaps = []
        this.coins = []
        this.minSafeDistance = DEFAULT_SAFE_DISTACE *this.scene.cameras.main.width / 3200

        let tmp = 3500*this.scene.cameras.main.width / 3200
        for (let i = 0; i < numObject; i++) {
            if (Phaser.Math.Between(0, 99) < 30) {
                const coin = ObjectPool.getCoin(scene, tmp, Phaser.Math.Between(400, 800)*this.scene.cameras.main.width / 3200)
                this.coins.push(coin)
                tmp = coin.getMaxX() + Phaser.Math.Between(300, 600)*this.scene.cameras.main.width / 3200
            } else {
                const zap = ObjectPool.getZap(scene, 0, 0, 0, 0).setVisible(false)
                zap.reset(tmp)
                this.zaps.push(zap)
                tmp =
                    zap.maxX() +
                    Phaser.Math.Between(this.minSafeDistance, this.minSafeDistance + 500*this.scene.cameras.main.width / 3200)
            }
        }

        this.coinInRound = 0
        this.coinInRoundText = this.scene.add.text(10*this.scene.cameras.main.width / 3200, 150*this.scene.cameras.main.width / 3200, '0')
        this.coinInRoundText.setFontSize('70px')
        this.coinInRoundText.setAlign('right')
        this.coinInRoundText.setColor('#ffe599')
        this.coinInRoundText.setFontFamily(FONT_NAME)
        this.coinInRoundText.setStroke('#000000', 5*this.scene.cameras.main.width / 3200)
        this.coinInRoundText.setDepth(DEPTH.OBJECT_VERYLOW)
    }

    public checkCollider(player: Player): boolean {
        for (let i = 0; i < this.coins.length; i++) {
            this.coins[i].handleColliderWithPlayer(player, this)
        }

        for (let i = 0; i < this.zaps.length; i++) {
            if (this.scene.matter.overlap(player, this.zaps[i].getBody())) {
                return true
            }
            if (this.zaps[i].minX() > player.x + player.width / 2) break
        }

        return false
    }

    public update(delta: number): void {
        let numRemoved = 0
        for (let i = 0; i < this.zaps.length; i++) {
            if (this.zaps[i].minX() < this.scene.cameras.main.scrollX + this.scene.cameras.main.width)
            {
                this.zaps[i].setVisible(true)
            }
            this.zaps[i].update(delta)
        }
        for (let i = 0; i < this.zaps.length; i++) {
            if (this.zaps[i].maxX() + 75*this.scene.cameras.main.width / 3200 < this.scene.cameras.main.scrollX) {
                ObjectPool.removeZap(this.zaps[i])
                numRemoved++
            } else break
        }

        if (numRemoved) this.zaps.splice(0, numRemoved)

        for (let i = 0; i < this.coins.length; i++) {
            if (this.coins[i].getMinX() < this.scene.cameras.main.scrollX + this.scene.cameras.main.width) {
                this.coins[i].setVisible(true)
            }
            if (this.coins[i].getMaxX() < this.scene.cameras.main.scrollX) {
                ObjectPool.removeCoin(this.coins[i])
                this.coins.splice(i, 1)
                i--
                numRemoved++
            }
        }

        let tmp = this.scene.cameras.main.scrollX + this.scene.cameras.main.width

        if (this.zaps.length > 0) tmp = Math.max(tmp, this.zaps[this.zaps.length - 1].maxX())
        if (this.coins.length > 0) tmp = Math.max(tmp, this.coins[this.coins.length - 1].getMaxX())

        tmp += Phaser.Math.Between(this.minSafeDistance, this.minSafeDistance + 500*this.scene.cameras.main.width / 3200)
        for (let i = 0; i < numRemoved; i++) {
            if (Phaser.Math.Between(0, 99) < 30) {
                const coin = ObjectPool.getCoin(this.scene, tmp, Phaser.Math.Between(400, 800)*this.scene.cameras.main.width / 3200)
                this.coins.push(coin)
                tmp = coin.getMaxX() + Phaser.Math.Between(300, 600)*this.scene.cameras.main.width / 3200
            } else {
                const zap = ObjectPool.getZap(this.scene, 0, 0, 0, 0)
                zap.reset(tmp)
                this.zaps.push(zap)
                tmp =
                    zap.maxX() +
                    Phaser.Math.Between(this.minSafeDistance, this.minSafeDistance + 500*this.scene.cameras.main.width / 3200)
            }
        }
    }

    public setMinSafeDistance(d: number): void {
        this.minSafeDistance = d
    }

    public getMinSafeDistance(): number {
        return this.minSafeDistance
    }

    public setNewCoin(): void {
        this.coinInRoundText.setText(`${this.coinInRound}`)
        this.coinInRoundText.x = this.scene.cameras.main.scrollX + 150
    }

    public resetCoin(): void {
        this.coinInRound = 0
    }

    public addCoin(coeff = 1): void {
        this.coinInRound += coeff
    }

    public getCoinInRound(): number {
        return this.coinInRound
    }
}
