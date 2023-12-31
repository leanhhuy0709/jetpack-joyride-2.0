import { IMAGE } from '../../const/const'
import { DEPTH } from '../../const/depth'

export default class TileMap {
    private scene: Phaser.Scene

    private maps: Phaser.Tilemaps.Tilemap[]
    private tilesets: Phaser.Tilemaps.Tileset[]
    private layers: Phaser.Tilemaps.TilemapLayer[]
    private rects: Phaser.GameObjects.Rectangle[]

    private position = 0

    constructor(scene: Phaser.Scene, maps: string[], bgColor: number[]) {
        this.scene = scene

        this.maps = []
        this.tilesets = []
        this.layers = []
        this.rects = []

        for (let i = 0; i < maps.length; i++) {
            this.maps.push(this.scene.make.tilemap({ key: maps[i] }))

            const tmp = this.maps[i].addTilesetImage('ground', IMAGE.TILESET)
            if (tmp) this.tilesets.push(tmp)
            const rect = scene.add
                .rectangle(
                    this.position,
                    0,
                    (16000 * scene.cameras.main.width) / 3200,
                    (1600 * scene.cameras.main.height) / 1600,
                    bgColor[i]
                )
                .setOrigin(0, 0)
                .setDepth(DEPTH.BACKGROUND_LOW)

            this.rects.push(rect)

            const layer = this.maps[i].createLayer('T1', this.tilesets[i], this.position, 0)

            if (layer) {
                layer
                    .setDepth(DEPTH.BACKGROUND_MEDIUM)
                    .setOrigin(0, 0)
                    .setScale((1600 * scene.cameras.main.height) / 1600 / 180)

                this.layers.push(layer)
            }

            this.position += (100 * 160 * scene.cameras.main.width) / 3200

            
            for (let i = 0; i < maps.length; i++) {
                const scene = this.scene as unknown as AnimatedScene
                if (this.maps[i])
                    scene.animatedTiles.init(this.maps[i])
            }
        }
    }

    public update(): void {
        for (let i = 0; i < this.layers.length; i++) {
            if (
                this.layers[i].x + (16000 * this.scene.cameras.main.width) / 3200 <
                this.scene.cameras.main.scrollX
            ) {
                this.layers[i].x = this.position
                this.rects[i].x = this.position
                this.position += (16000 * this.scene.cameras.main.width) / 3200
            }

            if (
                this.layers[i].x >
                    this.scene.cameras.main.scrollX + this.scene.cameras.main.width &&
                this.layers[i].visible
            ) {
                this.layers[i].setVisible(false)
                this.rects[i].setVisible(false)
            } else if (!this.layers[i].visible) {
                this.layers[i].setVisible(true)
                this.rects[i].setVisible(true)
            }
        }
    }
}
