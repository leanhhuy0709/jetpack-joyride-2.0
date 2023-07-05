import { FONT_NAME, IMAGE, SPRITE } from '../../const/const'
import { DEPTH } from '../../const/depth'

export default class StartBackground {
    public constructor(scene: Phaser.Scene, x: number, isAlarmLightPlay: boolean) {
        scene.add
            .image(x, 0, IMAGE.START_ROOM)
            .setOrigin(0, 200 / 1600)
            .setCrop(0, 200, 1749, 1200)
            .setDisplaySize((1749 * 1600) / 1200, (1600 * 1600) / 1200)
            .setDepth(DEPTH.BACKGROUND_VERYHIGH)

        scene.add
            .image(1600 + x, 600, IMAGE.ALARM_LIGHT)
            .setDepth(DEPTH.BACKGROUND_VERYHIGH)
            .setScale(1.5)
        if (isAlarmLightPlay) {
            const alarmLightSprite = scene.add
                .sprite(1470 + x, 710, SPRITE.ALARM_LIGHT_EFFECT)
                .setDepth(DEPTH.BACKGROUND_VERYHIGH)
                .setScale(1.5)

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
            .image(1200 + x, 1150, IMAGE.BEST_SCREEN)
            .setDepth(DEPTH.BACKGROUND_VERYHIGH)
            .setScale(1.5)

        scene.add
            .image(500 + x, 400, IMAGE.LIGHT)
            .setDepth(DEPTH.BACKGROUND_VERYHIGH)
            .setScale(1.7)

        scene.add
            .image(510 + x, 1365, IMAGE.LIGHT_EFFECT_1)
            .setDepth(DEPTH.BACKGROUND_VERYHIGH)
            .setScale(1.7)
        scene.add
            .image(500 + x, 525, IMAGE.LIGHT_EFFECT_2)
            .setDepth(DEPTH.BACKGROUND_VERYHIGH)
            .setScale(1.7)

        scene.add
            .image(600 + x, 1220, IMAGE.TABLE)
            .setDepth(DEPTH.BACKGROUND_VERYHIGH)
            .setScale(4.4)
        scene.add
            .image(610 + x, 1120, IMAGE.RADIO)
            .setDepth(DEPTH.BACKGROUND_VERYHIGH)
            .setScale(2)

        let highScore = 0
        if (localStorage.getItem('highscore'))
            highScore = parseInt(localStorage.getItem('highscore') as string)

        scene.add
            .text(x + 1200, 1110, `BEST ${highScore}`, {
                fontSize: '40px',
                fontFamily: FONT_NAME,
            })
            .setDepth(DEPTH.OBJECT_MEDIUM)
            .setOrigin(0.5, 0)
    }
}
