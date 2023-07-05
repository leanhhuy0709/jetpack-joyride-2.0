export default abstract class Obstacle {
    
    protected scene: Phaser.Scene
    protected rect: Phaser.Physics.Matter.Sprite

    public constructor(scene: Phaser.Scene) {
        this.scene = scene
    }

    public update(_delta: number): void {
        //
    }

    public reset(_minX: number): void {
        //
    }

    public maxX(): number {
        return 0
    }

    public maxY(): number {
        return 0
    }

    public minX(): number {
        return 0
    }

    public minY(): number {
        return 0
    }

    public getBody(): Phaser.Types.Physics.Matter.MatterBody[]
    {
        return [this.rect]
    }
}
