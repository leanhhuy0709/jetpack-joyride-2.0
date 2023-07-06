import * as Phaser from 'phaser'
import { FONT_NAME, SCENE } from '../const/const'
import Button from '../components/Button'
import Product from '../object/shop/Product'
import ProductTexture from '../object/shop/ProductTexture'
import {
    productListDescription,
    productListKey,
    productListName,
    productListPrice,
} from '../object/shop/product-list'
import UserData, { PRODUCT_STATE } from '../object/shop/UserData'
import {
    costumeListKey,
    costumeListName,
    costumeListPrice,
    costumeListDescription,
} from '../object/shop/costume-list'

export default class ShopScene extends Phaser.Scene {
    private backBtn: Button
    private productTexture: ProductTexture[]

    private keyList: string[]
    private nameList: string[]
    private priceList: number[]
    private descriptionList: string[]
    private index: number

    public constructor() {
        super({
            key: SCENE.SHOP,
        })
    }

    public init(data: { type: string }): void {
        if (data.type == 'product') {
            this.keyList = productListKey
            this.nameList = productListName
            this.priceList = productListPrice
            this.descriptionList = productListDescription
            this.index = 0
        } else if (data.type == 'costume') {
            this.keyList = costumeListKey
            this.nameList = costumeListName
            this.priceList = costumeListPrice
            this.descriptionList = costumeListDescription
            this.index = productListKey.length
        }
    }

    public create(): void {
        this.add
            .rectangle(
                0,
                0,
                (3200 * this.cameras.main.width) / 3200,
                (1600 * this.cameras.main.width) / 3200,
                0x0000
            )
            .setOrigin(0, 0)
            .setAlpha(0.8)

        this.backBtn = new Button(
            this,
            (300 * this.cameras.main.width) / 3200,
            (100 * this.cameras.main.width) / 3200,
            (200 * this.cameras.main.width) / 3200,
            (80 * this.cameras.main.width) / 3200,
            'BACK',
            {
                color: '#ffffff',
                fontSize: '40px',
                fontStyle: 'bold',
                fontFamily: FONT_NAME,
            }
        )
        this.backBtn.setInteractive()

        this.add
            .text(
                (1600 * this.cameras.main.width) / 3200,
                (20 * this.cameras.main.width) / 3200,
                'SHOP',
                {
                    fontSize: '110px',
                    fontStyle: 'bold',
                    fontFamily: FONT_NAME,
                }
            )
            .setStroke('#000000', (10 * this.cameras.main.width) / 3200)
            .setOrigin(0.5, 0)

        this.add
            .rectangle(
                (1600 * this.cameras.main.width) / 3200,
                (200 * this.cameras.main.width) / 3200,
                (2800 * this.cameras.main.width) / 3200,
                (1200 * this.cameras.main.width) / 3200,
                0x1f2944
            )
            .setOrigin(0.5, 0)
        this.productTexture = []
        let tmp = (300 * this.cameras.main.width) / 3200
        for (let i = 0; i < this.keyList.length; i++) {
            const p1 = new Product(
                this.keyList[i],
                this.nameList[i],
                this.priceList[i],
                UserData.getProductState(i + this.index),
                this.descriptionList[i]
            )
            this.productTexture.push(
                new ProductTexture(
                    this,
                    (200 * this.cameras.main.width) / 3200,
                    tmp,
                    p1,
                    (2800 * this.cameras.main.width) / 3200
                )
            )
            tmp += (220 * this.cameras.main.width) / 3200
        }
    }

    public update(_time: number, _delta: number): void {
        if (this.backBtn.getIsPointerDown()) {
            this.scene.stop(SCENE.SHOP)
            this.scene.resume(SCENE.MENU)
        }

        for (let i = 0; i < this.productTexture.length; i++) {
            if (this.productTexture[i].isButtonClicked()) {
                switch (UserData.getProductState(i + this.index)) {
                    case PRODUCT_STATE.EQUIPPED:
                        UserData.unequip(i + this.index)
                        break
                    case PRODUCT_STATE.NOT_EQUIPPED:
                        UserData.equip(i + this.index)
                        break
                    case PRODUCT_STATE.HAVE_NOT_BOUGHT_YET:
                        if (UserData.canBuyProduct(i + this.index)) {
                            UserData.buy(i + this.index, this.priceList[i])
                        }
                        break
                }
                this.productTexture[i].setState(UserData.getProductState(i + this.index))
            }
        }
    }
}
