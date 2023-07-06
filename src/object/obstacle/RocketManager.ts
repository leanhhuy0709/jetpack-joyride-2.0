import GamePlayScene from '../../scenes/GamePlayScene'
import ObjectPool from '../ObjectPool'
import Player from '../Player'
import Rocket from './Rocket'

export default class RocketManager {
    private scene: Phaser.Scene
    private rockets: Rocket[]
    private rocketIdx: number[]
    private minDistance: number

    public constructor(scene: Phaser.Scene, numIdx: number) {
        this.scene = scene
        this.rockets = []

        this.minDistance = (3500 * scene.cameras.main.width) / 3200
        this.rocketIdx = []
        let tmp = Phaser.Math.Between(this.minDistance, this.minDistance * 2)
        for (let i = 0; i < numIdx; i++) {
            this.rocketIdx.push(tmp)
            tmp += Phaser.Math.Between(this.minDistance, this.minDistance * 2)
        }
    }

    public checkCollider(player: Player): boolean {
        for (let i = 0; i < this.rockets.length; i++) {
            if (this.scene.matter.overlap(player, this.rockets[i].getBody())) {
                return true
            }
        }
        return false
    }

    public update(delta: number, player: Player): void {
        if (this.rocketIdx[0] < this.scene.cameras.main.scrollX + 3200) {
            let numRocket = 0
            const chance = [0, 50, 20, 10, 10, 10]
            const random = Phaser.Math.Between(1, 100)
            let sum = 0
            for (let i = 0; i < chance.length; i++) {
                sum += chance[i]
                if (random <= sum) {
                    numRocket = i
                    break
                }
            }
            for (let i = 0; i < numRocket; i++) {
                const rocket = ObjectPool.getRocket(this.scene, 0, 0)
                rocket.reset(this.rocketIdx[0])
                rocket.startAlert()
                this.rockets.push(rocket)
            }
            this.rocketIdx.splice(0, 1)
            this.rocketIdx.push(
                this.rocketIdx[this.rocketIdx.length - 1] +
                    Phaser.Math.Between(this.minDistance, this.minDistance * 2)
            )
        }

        let numCanRemove = 0

        for (let i = 0; i < this.rockets.length; i++) {
            this.rockets[i].update(delta, player)
            if (this.rockets[i].maxX() < this.scene.cameras.main.scrollX) {
                numCanRemove++
            }
        }

        if (numCanRemove == this.rockets.length) {
            for (let i = 0; i < this.rockets.length; i++) {
                ObjectPool.removeRocket(this.rockets[i])
            }
            this.rockets = []
        }
        const gpScene = this.scene as GamePlayScene
        this.evaluateMinDistance(gpScene.score.getScore())
    }

    public evaluateMinDistance(score: number, init = 4500): void {
        this.minDistance =
            init -
            (Math.log10((0.5 * score) / 923 + 1) * 1300 * this.scene.cameras.main.width) / 3200
        if (this.minDistance < init - 2000)
            this.minDistance = ((init - 2000) * this.scene.cameras.main.width) / 3200
    }
}
