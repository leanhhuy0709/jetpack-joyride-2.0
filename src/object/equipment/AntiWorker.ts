import GamePlayScene from '../../scenes/GamePlayScene'
import Equipment from './Equipment'

export default class AntiWorker extends Equipment {
    public init() {
        const glScene = this.player.scene as GamePlayScene
        glScene.workerManager.setNumWorker(0)
    }

    public remove() {
        const glScene = this.player.scene as GamePlayScene
        glScene.workerManager.setNumWorker(10)
    }
}
