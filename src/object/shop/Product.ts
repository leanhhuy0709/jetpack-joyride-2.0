import { PRODUCT_STATE } from './UserData'

export default class Product {
    private imageKey: string
    private name: string
    private price: number
    private state: PRODUCT_STATE
    private description: string

    public constructor(imageKey: string, name: string, price: number, state: PRODUCT_STATE, description = '') {
        this.imageKey = imageKey
        this.name = name
        this.price = price
        this.state = state
        this.description = description
    }

    public getImageKey(): string {
        return this.imageKey
    }

    public getName(): string {
        return this.name
    }

    public getPrice(): number {
        return this.price
    }

    public getState(): PRODUCT_STATE {
        return this.state
    }

    public setState(state: PRODUCT_STATE): void {
        this.state = state
    }

    public getDescription(): string {
        return this.description
    }
}
