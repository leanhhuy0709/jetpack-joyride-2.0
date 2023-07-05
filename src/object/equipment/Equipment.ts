import Player from '../Player'

export default abstract class Equipment {
    protected player: Player

    public constructor(player: Player) {
        this.player = player
    }

    public init() {
        //
    }

    public update(_delta: number) {
        //
    }

    public flying() {
        //
    }

    public falling() {
        //
    }

    public moving() {
        //
    }

    public remove() {
        //
    }
}
