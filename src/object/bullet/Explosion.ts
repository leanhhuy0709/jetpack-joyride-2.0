import { DEPTH } from '../../const/depth'

export default class Explosion extends Phaser.GameObjects.Sprite {
    public constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
        super(scene, x, y, key)
        this.setDepth(DEPTH.OBJECT_MEDIUM).setDisplaySize(
            (110 * scene.cameras.main.width) / 3200,
            (92 * scene.cameras.main.height) / 1600
        )
        scene.add.existing(this)

        if (!this.scene.anims.exists('explosion'))
            this.scene.anims.create({
                key: 'explosion',
                frames: this.anims.generateFrameNumbers(key, { start: 0, end: 3 }),
                frameRate: 40,
                repeat: 1,
            })

        this.setAll(scene, x, y, key)
    }

    public setAll(scene: Phaser.Scene, x: number, y: number, key: string) {
        this.setPosition(x, y + (Phaser.Math.Between(-10, 20) * scene.cameras.main.height) / 1600)
            .setTexture(key)
            .setAlpha(1)
        scene.add.existing(this)

        this.anims.play('explosion')

        scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 100,
        })
    }
}
