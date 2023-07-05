export default class Background {
    private scene: Phaser.Scene
    private image1: Phaser.GameObjects.Image
    private image2: Phaser.GameObjects.Image
    private image3: Phaser.GameObjects.Image
    private position: number
    private width: number

    public constructor(scene: Phaser.Scene, key: string) {
        //super(scene, x, y, texture, frame)
        //this.setDisplaySize(512 * 1600 / 360, 360 * 1600 / 360).setOrigin(0, 0)
        this.scene = scene
        this.position = 0
        this.image1 = this.scene.add.image(this.position, 0, key).setOrigin(0, 0)
        this.image2 = this.scene.add
            .image(this.position + this.image1.width, 0, key)
            .setOrigin(0, 0)
        this.image3 = this.scene.add
            .image(this.position + this.image1.width, 0, key)
            .setOrigin(0, 0)
        this.width = this.image1.width
    }

    public update(): void {
        if (this.position + this.width <= this.scene.cameras.main.scrollX)
            this.position += this.width

        this.image1.x = this.position
        this.image2.x = this.position + this.width
        this.image3.x = this.image2.x + this.width
    }

    public setImage(
        image1: Phaser.GameObjects.Image,
        image2: Phaser.GameObjects.Image,
        image3: Phaser.GameObjects.Image
    ): void {
        this.image1 = image1
        this.image2 = image2
        this.image3 = image3
        this.position = image1.x
        this.width = image1.width
    }

    public setWidth(width: number): void {
        this.width = width
    }
}
