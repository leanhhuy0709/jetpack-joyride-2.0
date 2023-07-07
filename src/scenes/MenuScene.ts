import * as Phaser from 'phaser'
import { SCENE, IMAGE, FONT_NAME, AUDIO, TILEMAP } from '../const/const'
import Button from '../components/Button'
import { DEPTH } from '../const/depth'
import UserData from '../object/shop/UserData'
import Volume from '../object/Volume'

export const tileMaps: string[] = []
export const colors: number[] = []

export default class MenuScene extends Phaser.Scene {
    private cursors: {
        left: Phaser.Input.Keyboard.Key
        right: Phaser.Input.Keyboard.Key
        up: Phaser.Input.Keyboard.Key
        down?: Phaser.Input.Keyboard.Key
        space?: Phaser.Input.Keyboard.Key
        shift?: Phaser.Input.Keyboard.Key
    }

    private logo: Phaser.GameObjects.Image
    private logoGlow: Phaser.GameObjects.Image

    private rect: Phaser.GameObjects.Rectangle
    private coinRect: Button
    private settingBtn: Button

    private isSpaceClicked: boolean

    private adsBtn: Button
    private shopBtn: Button
    private powerUpBtn: Button
    private costumesBtn: Button
    private halfBrickBtn: Button

    private playBtn: Button

    private music:
        | Phaser.Sound.WebAudioSound
        | Phaser.Sound.NoAudioSound
        | Phaser.Sound.HTML5AudioSound

    public constructor() {
        super({
            key: SCENE.MENU,
        })
    }

    public create(): void {
        this.logoGlow = this.add
            .image(
                (1750 * this.cameras.main.width) / 3200,
                (830 * this.cameras.main.width) / 3200,
                IMAGE.TITLE_GLOW
            )
            .setDepth(DEPTH.BACKGROUND_VERYHIGH)
            .setScale((3 * this.cameras.main.width) / 3200)

        this.logo = this.add
            .image(
                (1800 * this.cameras.main.width) / 3200,
                (800 * this.cameras.main.width) / 3200,
                IMAGE.TITLE
            )
            .setDepth(DEPTH.BACKGROUND_VERYHIGH)
            .setScale((1.5 * this.cameras.main.width) / 3200)

        if (this.input.keyboard) this.cursors = this.input.keyboard.createCursorKeys()

        this.add
            .rectangle(
                0,
                0,
                (500 * this.cameras.main.width) / 3200,
                (1600 * this.cameras.main.width) / 3200,
                0x01234
            )
            .setOrigin(0, 0)

        this.adsBtn = new Button(
            this,
            (315 * this.cameras.main.width) / 3200,
            (100 * this.cameras.main.width) / 3200,
            (300 * this.cameras.main.width) / 3200,
            (100 * this.cameras.main.width) / 3200,
            'ADS',
            {
                fontSize: (50 * this.cameras.main.width) / 3200,
                fontStyle: 'bold',
                fontFamily: FONT_NAME,
            }
        )

        this.adsBtn.setInteractive()

        this.shopBtn = new Button(
            this,
            (315 * this.cameras.main.width) / 3200,
            (300 * this.cameras.main.width) / 3200,
            (300 * this.cameras.main.width) / 3200,
            (100 * this.cameras.main.width) / 3200,
            'SHOP',
            {
                fontSize: (50 * this.cameras.main.width) / 3200,
                fontStyle: 'bold',
                fontFamily: FONT_NAME,
            }
        )

        this.shopBtn.setInteractive()

        this.powerUpBtn = new Button(
            this,
            (315 * this.cameras.main.width) / 3200,
            (500 * this.cameras.main.width) / 3200,
            (300 * this.cameras.main.width) / 3200,
            (100 * this.cameras.main.width) / 3200,
            'POWER-UPS',
            {
                fontSize: (50 * this.cameras.main.width) / 3200,
                fontStyle: 'bold',
                fontFamily: FONT_NAME,
            }
        )

        this.powerUpBtn.setInteractive()

        this.costumesBtn = new Button(
            this,
            (315 * this.cameras.main.width) / 3200,
            (700 * this.cameras.main.width) / 3200,
            (300 * this.cameras.main.width) / 3200,
            (100 * this.cameras.main.width) / 3200,
            'COSTUMES',
            {
                fontSize: (50 * this.cameras.main.width) / 3200,
                fontStyle: 'bold',
                fontFamily: FONT_NAME,
            }
        )

        this.costumesBtn.setInteractive()

        this.halfBrickBtn = new Button(
            this,
            (315 * this.cameras.main.width) / 3200,
            (900 * this.cameras.main.width) / 3200,
            (300 * this.cameras.main.width) / 3200,
            (100 * this.cameras.main.width) / 3200,
            'HALFBRICK',
            {
                fontSize: (50 * this.cameras.main.width) / 3200,
                fontStyle: 'bold',
                fontFamily: FONT_NAME,
            }
        )

        this.halfBrickBtn.setInteractive()

        this.playBtn = new Button(
            this,
            (1800 * this.cameras.main.width) / 3200,
            (1300 * this.cameras.main.width) / 3200,
            (300 * this.cameras.main.width) / 3200,
            (100 * this.cameras.main.width) / 3200,
            'PLAY',
            {
                fontSize: (50 * this.cameras.main.width) / 3200,
                fontStyle: 'bold',
                fontFamily: FONT_NAME,
            }
        )

        this.playBtn.setInteractive()

        this.rect = this.add
            .rectangle(
                (2400 * this.cameras.main.width) / 3200,
                0,
                (600 * this.cameras.main.width) / 3200,
                (125 * this.cameras.main.width) / 3200,
                0x01234
            )
            .setOrigin(0, 0)
            .setDepth(DEPTH.OBJECT_LOW)

        const allCoin = UserData.getAllCoin()

        this.coinRect = new Button(
            this,
            (2580 * this.cameras.main.width) / 3200,
            (62.5 * this.cameras.main.width) / 3200,
            (300 * this.cameras.main.width) / 3200,
            (100 * this.cameras.main.width) / 3200,
            String(allCoin),
            {
                fontSize: (50 * this.cameras.main.width) / 3200,
                fontStyle: 'bold',
                fontFamily: FONT_NAME,
                color: '#FFF0C8',
            }
        )

        this.settingBtn = new Button(
            this,
            (2880 * this.cameras.main.width) / 3200,
            (62.5 * this.cameras.main.width) / 3200,
            (200 * this.cameras.main.width) / 3200,
            (100 * this.cameras.main.width) / 3200,
            'Setting',
            {
                fontSize: (50 * this.cameras.main.width) / 3200,
                fontStyle: 'bold',
                fontFamily: FONT_NAME,
            }
        )

        this.settingBtn.setInteractive()

        this.isSpaceClicked = false
        this.input.addPointer(1)

        this.music = this.sound.add(AUDIO.MUSIC_MENU, { volume: Volume.value })
        this.music.play()

        tileMaps.length = 0
        colors.length = 0
        const arr = [1, 2, 3]

        arr.sort((_a, _b) => Math.random() - 0.5)

        for (let i = 0; i < 3; i++) {
            switch (arr[i]) {
                case 1:
                    tileMaps.push(TILEMAP.MAP_1)
                    colors.push(0xb0e0e6)
                    break
                case 2:
                    tileMaps.push(TILEMAP.MAP_2)
                    colors.push(0xfec89a)
                    break
                case 3:
                    tileMaps.push(TILEMAP.MAP_3)
                    colors.push(0xcccccc)
                    break
            }
        }

        const map = this.make.tilemap({ key: tileMaps[0] })
        const tileset = map.addTilesetImage('ground', IMAGE.TILESET)

        this.add
            .rectangle(
                500,
                0,
                (16000 * this.cameras.main.width) / 3200,
                (1600 * this.cameras.main.height) / 1600,
                colors[0]
            )
            .setOrigin(0, 0)
            .setDepth(DEPTH.BACKGROUND_LOW)

        if (tileset)
            map.createLayer('T1', tileset, 500, 0)
                ?.setDepth(DEPTH.BACKGROUND_MEDIUM)
                .setOrigin(0, 0)
                .setScale((1600 * this.cameras.main.height) / 1600 / 180)

        let tmp = Number(localStorage.getItem('highscore'))

        if (!tmp) tmp = 0

        this.add
            .text(2500, 300, `Best: ${Math.floor(tmp)}`, {
                fontFamily: FONT_NAME,
                fontSize: 60,
                color: '#ffffff',
                fontStyle: 'bold',
            })
            .setDepth(DEPTH.OBJECT_LOW)
            .setStroke('#000000', 5)
    }

    public update(): void {
        //Check button first ... else ...
        this.music.setVolume(Volume.value)

        this.coinRect.getText().setText(String(UserData.getAllCoin()))

        if (this.adsBtn.getIsPointerDown()) {
            this.adsBtn.setIsPointerDown(false)
            window.open('https://www.youtube.com/watch?v=Jzxi8nid9BQ', '_blank')
            return
        }

        if (this.halfBrickBtn.getIsPointerDown()) {
            this.halfBrickBtn.setIsPointerDown(false)
            window.open('https://www.halfbrick.com/', '_blank')
            return
        }

        if (this.shopBtn.getIsPointerDown()) {
            this.shopBtn.setIsPointerDown(false)
            this.scene.pause(SCENE.MENU)
            this.scene.launch(SCENE.SHOP, { type: 'product' })
            return
        }

        if (this.costumesBtn.getIsPointerDown()) {
            this.costumesBtn.setIsPointerDown(false)
            this.scene.pause(SCENE.MENU)
            this.scene.launch(SCENE.SHOP, { type: 'costume' })
            return
        }

        if (this.settingBtn.getIsPointerDown()) {
            this.settingBtn.setIsPointerDown(false)
            this.scene.pause(SCENE.MENU)
            this.scene.launch(SCENE.SETTING, { scene: SCENE.MENU, music: this.music })
            return
        }

        if (this.playBtn.getIsPointerDown() && !this.isSpaceClicked) {
            this.isSpaceClicked = true
            this.music.stop()
            this.tweens.add({
                targets: this.logo,
                alpha: 0,
                duration: 300,
            })
            this.tweens.add({
                targets: this.logoGlow,
                alpha: 0,
                duration: 300,
            })
            this.tweens.add({
                targets: this.rect,
                y: -150,
                duration: 300,
            })
            this.tweens.add({
                targets: this.coinRect.getText(),
                y: ((62.5 - 150) * this.cameras.main.width) / 3200,
                duration: 300,
            })
            this.tweens.add({
                targets: this.coinRect.getRectangle(),
                y: ((100 / 2 + 12.5 - 150) * this.cameras.main.width) / 3200,
                duration: 300,
            })
            this.tweens.add({
                targets: this.settingBtn.getText(),
                y: ((100 / 2 + 12.5 - 150) * this.cameras.main.width) / 3200,
                duration: 300,
            })
            this.tweens.add({
                targets: this.settingBtn.getRectangle(),
                y: ((100 / 2 + 12.5 - 150) * this.cameras.main.width) / 3200,
                duration: 300,
            })
            this.tweens.add({
                targets: this.playBtn.getRectangle(),
                alpha: 0,
                duration: 300,
            })
            this.tweens.add({
                targets: this.playBtn.getText(),
                alpha: 0,
                duration: 300,
            })

            this.tweens.add({
                targets: this.cameras.main,
                scrollX: (500 * this.cameras.main.width) / 3200,
                duration: 500,
                onComplete: () => {
                    this.music.stop()
                    this.scene.start(SCENE.GAMEPLAY)
                },
            })
        }
    }
}
