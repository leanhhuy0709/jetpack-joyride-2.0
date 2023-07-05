import { COIN_PATTERN, IMAGE, SPRITE } from '../const/const'
import Worker from './Worker'
import Bullet from './bullet/Bullet'
import Explosion from './bullet/Explosion'
import Coin from './coin/Coin'
import Obstacle from './obstacle/Obstacle'
import Rocket from './obstacle/Rocket'
import Zap from './obstacle/Zap'

export default class ObjectPool {
    private static bullets: Bullet[] = []
    private static explosions: Explosion[] = []
    private static zaps: Zap[] = []
    public static count = 0 //use to check
    public static coins: Coin[] = []
    public static rockets: Rocket[] = []
    public static workers: Worker[] = []

    public static init(scene: Phaser.Scene): void {
        ObjectPool.clear()
        for (let i = 0; i < 5; i++) {
            ObjectPool.removeBullet(new Bullet(scene, 100, 100, IMAGE.BULLET))
            ObjectPool.removeExplosion(new Explosion(scene, 100, 100, SPRITE.EXPLOSION))
            ObjectPool.removeZap(new Zap(scene, -100, -100, -100, -100))
            ObjectPool.removeRocket(new Rocket(scene, -100, -100))
        }

        const randomPattern = []

        for (let i = 0; i < COIN_PATTERN.length; i++) {
            randomPattern.push(i)
        }

        randomPattern.sort((_a, _b) => Math.random() - 0.5)

        for (let i = 0; i < COIN_PATTERN.length; i++) {
            const coin = new Coin(scene, 110, 110, randomPattern[i]).setVisible(false)
            ObjectPool.coins.push(coin)
        }
    }

    public static getBullet(scene: Phaser.Scene, x: number, y: number, key: string): Bullet {
        if (ObjectPool.bullets.length > 0) {
            const bullet = ObjectPool.bullets.pop() as Bullet
            bullet.setVisible(true).setAll(scene, x, y, key)
            return bullet
        }
        ObjectPool.count++
        return new Bullet(scene, x, y, key)
    }

    public static removeBullet(bullet: Bullet): void {
        bullet.setVisible(false)
        ObjectPool.bullets.push(bullet)
    }

    public static getExplosion(scene: Phaser.Scene, x: number, y: number, key: string): Explosion {
        if (ObjectPool.explosions.length > 0) {
            const explosion = ObjectPool.explosions.pop() as Explosion
            explosion.setVisible(true).setAll(scene, x, y, key)
            return explosion
        }
        ObjectPool.count++
        return new Explosion(scene, x, y, key)
    }

    public static removeExplosion(explosion: Explosion): void {
        explosion.setVisible(false)
        ObjectPool.explosions.push(explosion)
    }

    public static getZap(scene: Phaser.Scene, x1: number, y1: number, x2: number, y2: number): Zap {
        if (ObjectPool.zaps.length > 0) {
            const zap = ObjectPool.zaps.pop() as Zap
            zap.setAll(scene, x1, y1, x2, y2)
            return zap
        }
        ObjectPool.count++
        return new Zap(scene, x1, y1, x2, y2)
    }

    public static removeZap(zap: Zap): void {
        ObjectPool.zaps.push(zap)
    }

    public static removeObstacle(obstacle: Obstacle): void {
        if (obstacle instanceof Zap) {
            ObjectPool.removeZap(obstacle)
        }
        //...
    }

    public static clear(): void {
        ObjectPool.bullets = []
        ObjectPool.explosions = []
        ObjectPool.count = 0
        ObjectPool.rockets = []
        ObjectPool.zaps = []
        ObjectPool.coins = []
        ObjectPool.workers = []
    }

    public static getCoin(scene: Phaser.Scene, x: number, y: number): Coin {
        if (ObjectPool.coins.length > 0) {
            const coin = ObjectPool.coins.pop() as Coin
            coin.setAll(scene, x, y)
            return coin
        }
        ObjectPool.count++
        return new Coin(scene, x, y, 0)
    }

    public static removeCoin(coin: Coin): void {
        ObjectPool.coins.push(coin)
    }

    public static getRocket(scene: Phaser.Scene, x: number, y: number): Rocket {
        if (ObjectPool.rockets.length > 0) {
            const rocket = ObjectPool.rockets.pop() as Rocket
            rocket.setAll(scene, x, y)
            return rocket
        }
        ObjectPool.count++
        return new Rocket(scene, x, y)
    }

    public static removeRocket(rocket: Rocket): void {
        ObjectPool.rockets.push(rocket)
    }

    public static getWorker(scene: Phaser.Scene, x: number, y: number): Worker {
        let headKey = SPRITE.WORKER_1_HEAD,
            bodyKey = SPRITE.WORKER_1_BODY
        if (Phaser.Math.Between(0, 1) % 2) headKey = SPRITE.WORKER_1_HEAD
        else headKey = SPRITE.WORKER_2_HEAD

        switch (Phaser.Math.Between(0, 2))
        {
            case 0: 
                bodyKey = SPRITE.WORKER_1_BODY
                break
            case 1:
                bodyKey = SPRITE.WORKER_2_BODY
                break
            case 2: 
                bodyKey = SPRITE.WORKER_FAT_BODY
                break
        }
        
        if (ObjectPool.workers.length > 0) {
            const worker = ObjectPool.workers.pop() as Worker
            worker.setAll(scene, x, y, headKey, bodyKey)
            worker.setVisible(true)
            return worker
        }
        ObjectPool.count++
        return new Worker(scene, x, y, headKey, bodyKey)
    }

    public static removeWorker(worker: Worker): void {
        ObjectPool.workers.push(worker)
        worker.setVisible(false)
    }
}
