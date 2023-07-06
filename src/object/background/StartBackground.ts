import { FONT_NAME, IMAGE, SPRITE } from '../../const/const'
import { DEPTH } from '../../const/depth'

export default class StartBackground {
    public constructor(scene: Phaser.Scene, x: number, isAlarmLightPlay: boolean) {
        scene.add
            .image(x, 0, IMAGE.START_ROOM)
            .setOrigin(0, 200 / 1600)
            .setCrop(
                0,
                200,
                (1749 * scene.cameras.main.width) / 3200,
                (1200 * scene.cameras.main.height) / 1600
            )
            .setDisplaySize(
                (((1749 * 1600) / 1200) * scene.cameras.main.width) / 3200,
                (((1600 * 1600) / 1200) * scene.cameras.main.height) / 1600
            )
            .setDepth(DEPTH.BACKGROUND_VERYHIGH)

        scene.add
            .image(
                scene.cameras.main.width / 2 + x,
                (600 / 1600) * scene.cameras.main.height,
                IMAGE.ALARM_LIGHT
            )
            .setDepth(DEPTH.BACKGROUND_VERYHIGH)
            .setScale((1.5 / 1600) * scene.cameras.main.height)
        if (isAlarmLightPlay) {
            const alarmLightSprite = scene.add
                .sprite(
                    (1470 * scene.cameras.main.width) / 3200 + x,
                    (710 * scene.cameras.main.height) / 1600,
                    SPRITE.ALARM_LIGHT_EFFECT
                )
                .setDepth(DEPTH.BACKGROUND_VERYHIGH)
                .setScale((1.5 / 1600) * scene.cameras.main.height)

            if (!scene.anims.exists('alarm-light-turn'))
                scene.anims.create({
                    key: 'alarm-light-turn',
                    frames: scene.anims.generateFrameNumbers(SPRITE.ALARM_LIGHT_EFFECT, {
                        start: 0,
                        end: 5,
                    }),
                    frameRate: 5,
                    repeat: -1,
                })
            alarmLightSprite.play('alarm-light-turn')
        }

        scene.add
            .image(
                (1200 / 3200) * scene.cameras.main.width + x,
                (1150 / 1600) * scene.cameras.main.height,
                IMAGE.BEST_SCREEN
            )
            .setDepth(DEPTH.BACKGROUND_VERYHIGH)
            .setScale((1.5 * scene.cameras.main.height) / 1600)

        scene.add
            .image(
                (500 * scene.cameras.main.width) / 3200 + x,
                (400 * scene.cameras.main.height) / 1600,
                IMAGE.LIGHT
            )
            .setDepth(DEPTH.BACKGROUND_VERYHIGH)
            .setScale((1.7 * scene.cameras.main.height) / 1600)

        scene.add
            .image(
                (510 * scene.cameras.main.width) / 3200 + x,
                (1365 * scene.cameras.main.height) / 1600,
                IMAGE.LIGHT_EFFECT_1
            )
            .setDepth(DEPTH.BACKGROUND_VERYHIGH)
            .setScale((1.7 * scene.cameras.main.height) / 1600)
        scene.add
            .image(
                (500 * scene.cameras.main.width) / 3200 + x,
                (525 * scene.cameras.main.height) / 1600,
                IMAGE.LIGHT_EFFECT_2
            )
            .setDepth(DEPTH.BACKGROUND_VERYHIGH)
            .setScale((1.7 * scene.cameras.main.height) / 1600)

        scene.add
            .image(
                (600 * scene.cameras.main.width) / 3200 + x,
                (1220 * scene.cameras.main.height) / 1600,
                IMAGE.TABLE
            )
            .setDepth(DEPTH.BACKGROUND_VERYHIGH)
            .setScale((4.4 * scene.cameras.main.height) / 1600)
        scene.add
            .image(
                (610 * scene.cameras.main.width) / 3200 + x,
                (1120 * scene.cameras.main.height) / 1600,
                IMAGE.RADIO
            )
            .setDepth(DEPTH.BACKGROUND_VERYHIGH)
            .setScale((2 * scene.cameras.main.height) / 1600)

        let highScore = 0
        if (localStorage.getItem('highscore'))
            highScore = parseInt(localStorage.getItem('highscore') as string)

        scene.add
            .text(
                x + (1200 * scene.cameras.main.width) / 3200,
                (1110 * scene.cameras.main.height) / 1600,
                `BEST ${highScore}`,
                {
                    fontSize: '40px',
                    fontFamily: FONT_NAME,
                }
            )
            .setDepth(DEPTH.OBJECT_MEDIUM)
            .setOrigin(0.5, 0)
    }
}
