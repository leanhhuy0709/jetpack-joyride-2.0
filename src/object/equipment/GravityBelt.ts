import { SPRITE } from '../../const/const'
import { DEPTH } from '../../const/depth'
import Player, { DEFAULT_JUMP_VELO, PLAYER_STATE } from '../Player'
import Equipment from './Equipment'

export default class GravityBelt extends Equipment {
    private gravity_effect: Phaser.GameObjects.Sprite
    private transitionX: number
    private transitionY: number

    public constructor(player: Player) {
        super(player)

        this.gravity_effect = this.player.scene.add
            .sprite(1000, 1000, SPRITE.ROCKET_EFFECT, 5)
            .setDepth(DEPTH.OBJECT_MEDIUM)
            .setScale(3.5)
            .setAngle(-90)
            .setVisible(false)

        if (!this.player.scene.anims.exists('gravity_effect')) {
            this.player.scene.anims.create({
                key: 'gravity_effect',
                frames: this.gravity_effect.anims.generateFrameNumbers(SPRITE.ROCKET_EFFECT, {
                    start: 4,
                    end: 7,
                }),
                frameRate: 10,
                repeat: -1,
            })
        }
        this.gravity_effect.play('gravity_effect')

        this.transitionX = -10
        this.transitionY = 20
    }

    public init() {
        const gravity = this.player.scene.matter.world.localWorld.gravity.y
        this.player.scene.matter.world.setGravity(0, gravity * 2.5)
        this.player.setJumpVelo(DEFAULT_JUMP_VELO * 1.5)
    }

    public update(_delta: number): void {
        this.gravity_effect.setPosition(
            this.player.x + this.transitionX,
            this.player.y + this.transitionY
        )

        if (this.player.playerState != PLAYER_STATE.FALLING || !this.player.visible) this.gravity_effect.setVisible(false)
        else this.gravity_effect.setVisible(true)

        const gravity = this.player.scene.matter.world.localWorld.gravity.y

        const newFlip = gravity < 0

        if (this.gravity_effect.flipX != newFlip) {
            this.player.scene.anims.remove('gravity_effect')
            this.gravity_effect.setFlipX(newFlip)
            this.player.scene.anims.create({
                key: 'gravity_effect',
                frames: this.gravity_effect.anims.generateFrameNumbers(SPRITE.ROCKET_EFFECT, {
                    start: 4,
                    end: 7,
                }),
                frameRate: 10,
                repeat: -1,
            })
            this.gravity_effect.play('gravity_effect')
            if (newFlip) {
                this.transitionX = -15
                this.transitionY = -20
            } else {
                this.transitionX = -15
                this.transitionY = 20
            }
        }
    }

    public remove() {
        const gravity = this.player.scene.matter.world.localWorld.gravity.y
        this.player.scene.matter.world.setGravity(0, gravity / 2)
        this.player.setJumpVelo(DEFAULT_JUMP_VELO)
    }
}
