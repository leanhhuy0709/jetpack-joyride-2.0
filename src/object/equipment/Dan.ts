import { SPRITE } from '../../const/const'
import Player from '../Player'
import Equipment from './Equipment'

export default class Dan extends Equipment {
    public constructor(player: Player) {
        super(player)
    }

    public init() {
        const key = SPRITE.DAN_SPRITE_SHEET

        this.player.texture.key = SPRITE.DAN_SPRITE_SHEET

        this.player.scene.anims.remove('move')
        this.player.scene.anims.remove('fly')
        this.player.scene.anims.remove('fall')

        this.player.scene.anims.create({
            key: 'move',
            frames: this.player.anims.generateFrameNumbers(key, { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1,
        })

        this.player.scene.anims.create({
            key: 'fly',
            frames: this.player.anims.generateFrameNumbers(key, { start: 2, end: 2 }),
            frameRate: 10,
            repeat: -1,
        })

        this.player.scene.anims.create({
            key: 'fall',
            frames: this.player.anims.generateFrameNumbers(key, { start: 3, end: 3 }),
            frameRate: 10,
            repeat: -1,
        })

        this.player.play('move')
    }

    public remove() {
        const key = SPRITE.BARRY_SPRITE_SHEET
        this.player.texture.key = key

        this.player.scene.anims.remove('move')
        this.player.scene.anims.remove('fly')
        this.player.scene.anims.remove('fall')

        this.player.scene.anims.create({
            key: 'move',
            frames: this.player.anims.generateFrameNumbers(key, { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1,
        })

        this.player.scene.anims.create({
            key: 'fly',
            frames: this.player.anims.generateFrameNumbers(key, { start: 2, end: 2 }),
            frameRate: 10,
            repeat: -1,
        })

        this.player.scene.anims.create({
            key: 'fall',
            frames: this.player.anims.generateFrameNumbers(key, { start: 3, end: 3 }),
            frameRate: 10,
            repeat: -1,
        })
        this.player.play('move')
    }
}
