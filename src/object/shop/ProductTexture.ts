import Button from '../../components/Button'
import { FONT_NAME } from '../../const/const'
import Product from './Product'
import { PRODUCT_STATE } from './UserData'

export default class ProductTexture {
    private scene: Phaser.Scene
    private product: Product
    private container: Phaser.GameObjects.Container
    private button: Button

    public constructor(scene: Phaser.Scene, x: number, y: number, product: Product, width: number) {
        this.scene = scene
        this.product = product

        const rect = scene.add
            .rectangle(
                (200 * scene.cameras.main.width) / 3200,
                0,
                (150 * scene.cameras.main.width) / 3200,
                (150 * scene.cameras.main.width) / 3200,
                0x7086a7
            )
            .setOrigin(0.5, 0.5)

        const image = scene.add
            .image((200 * scene.cameras.main.width) / 3200, 0, product.getImageKey())
            .setDisplaySize(
                (75 * scene.cameras.main.width) / 3200,
                (75 * scene.cameras.main.width) / 3200
            )
            .setOrigin(0.5, 0.5)

        const name = scene.add
            .text((500 * scene.cameras.main.width) / 3200, 0, product.getName(), {
                fontSize: '60px',
                fontStyle: 'bold',
                fontFamily: FONT_NAME,
            })
            .setStroke('#000000', (5 * scene.cameras.main.width) / 3200)
            .setOrigin(0.5, 0.5)

        const price = scene.add
            .text(width - (500 * scene.cameras.main.width) / 3200, 0, String(product.getPrice()), {
                fontSize: '60px',
                fontStyle: 'bold',
                fontFamily: FONT_NAME,
                color: '#FFF0C8',
            })
            .setStroke('#000000', (5 * scene.cameras.main.width) / 3200)
            .setOrigin(0.5, 0.5)

        const description = scene.add
            .text(width / 2, 0, product.getDescription(), {
                fontSize: '60px',
                fontFamily: FONT_NAME,
            })
            .setStroke('#000000', (5 * scene.cameras.main.width) / 3200)
            .setOrigin(0.5, 0.5)

        let content: string

        switch (product.getState()) {
            case PRODUCT_STATE.EQUIPPED:
                content = 'UNEQUIP'
                break
            case PRODUCT_STATE.NOT_EQUIPPED:
                content = 'EQUIP'
                break
            case PRODUCT_STATE.HAVE_NOT_BOUGHT_YET:
                content = 'BUY'
                break
        }
        this.button = new Button(
            scene,
            width - (200 * scene.cameras.main.width) / 3200,
            0,
            (200 * scene.cameras.main.width) / 3200,
            (80 * scene.cameras.main.width) / 3200,
            content,
            {
                color: '#ffffff',
                fontSize: '40px',
                fontStyle: 'bold',
                fontFamily: FONT_NAME,
            }
        )
        this.button.setInteractive()

        const line = scene.add
            .rectangle(
                0,
                (120 * scene.cameras.main.width) / 3200,
                width,
                (5 * scene.cameras.main.width) / 3200,
                0xffffff
            )
            .setOrigin(0, 0)

        this.container = scene.add.container(x, y, [
            rect,
            name,
            price,
            description,
            this.button.getRectangle(),
            this.button.getText(),
            this.button.getBlackRect(),
            line,
            image,
        ])
    }

    public isButtonClicked(): boolean {
        if (this.button.getIsPointerDown()) {
            this.button.setIsPointerDown(false)
            return true
        }
        return false
    }

    public setState(state: PRODUCT_STATE): void {
        this.product.setState(state)
        let content: string
        switch (state) {
            case PRODUCT_STATE.EQUIPPED:
                content = 'UNEQUIP'
                break
            case PRODUCT_STATE.NOT_EQUIPPED:
                content = 'EQUIP'
                break
            case PRODUCT_STATE.HAVE_NOT_BOUGHT_YET:
                content = 'BUY'
                break
        }
        this.button.getText().setText(content)
    }
}
