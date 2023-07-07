interface AnimatedScene extends Phaser.Scene {
    animatedTiles: {
        updateAnimatedTiles: () => void
        init: (tilemap: Phaser.Tilemaps.Tilemap) => void
    }
}
