import { DEPTH } from '../../const/depth'

export default class Bullet extends Phaser.Physics.Matter.Sprite {
    public constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
        super(scene.matter.world, x, y, key)
        this.setDisplaySize(20 * 1.2, 52 * 1.2)
            .setDepth(DEPTH.OBJECT_LOW)
            .setCollisionGroup(-2)
        scene.add.existing(this)
        this.setAll(scene, x, y, key)
    }

    public setAll(scene: Phaser.Scene, x: number, y: number, key: string) {
        this.setRotation(0)
            .setFixedRotation()
            .setPosition(x + Phaser.Math.Between(-15, 15), y)
            .setTexture(key)

        if (this.body) {
            const vX = Phaser.Math.Between(-5, 15)
            const vY = 30
            this.setVelocityY(vY)
            this.setVelocityX(vX)
            if (vX > 0) this.setRotation(Math.atan(vY / vX) - Math.PI / 2)
            else if (vX < 0) this.setRotation(Math.atan(vY / vX) + Math.PI / 2)
        }
    }
}
