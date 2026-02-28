// auto-discount.ts

export enum UserType {
    NORMAL = 'normal',
    VIP = 'vip',
    ENTERPRISE = 'enterprise',
}

export interface Order {
    userType: UserType
    amount: number
}

export interface DiscountStrategy {
    supportType(): UserType

    getDiscount(order: Order): number
}

// ✅ 工厂：支持自动注册
class DiscountStrategyFactory {
    private static strategyMap: Map<UserType, DiscountStrategy> = new Map()

    static register(strategy: DiscountStrategy) {
        this.strategyMap.set(strategy.supportType(), strategy)
    }

    static getStrategy(userType: UserType): DiscountStrategy {
        const strategy = this.strategyMap.get(userType)
        if (!strategy) {
            throw new Error(`未找到策略：${userType}`)
        }
        return strategy
    }
}

// ✅ 装饰器：自动注册策略类
function RegisterStrategy() {
    return function <T extends new (...args: never[]) => DiscountStrategy>(Ctor: T) {
        const instance = new Ctor()
        DiscountStrategyFactory.register(instance)
    }
}

// ✅ 抽象类
abstract class BaseDiscountStrategy implements DiscountStrategy {
    abstract supportType(): UserType

    @LogExecution
    getDiscount(order: Order): number {
        const rate = this.getDiscountRate(order)
        console.log(`[${this.constructor.name}] 折扣: ${rate * 100}%, 原价: ${order.amount}, 折后: ${order.amount * rate}`)
        return order.amount * rate
    }

    protected abstract getDiscountRate(order: Order): number
}

// ✅ 各策略类，使用装饰器注册
@RegisterStrategy()
export class NormalUserDiscount extends BaseDiscountStrategy {
    supportType(): UserType {
        return UserType.NORMAL
    }

    protected getDiscountRate(): number {
        return 0.98
    }
}

@RegisterStrategy()
export class VipUserDiscount extends BaseDiscountStrategy {
    supportType(): UserType {
        return UserType.VIP
    }

    protected getDiscountRate(): number {
        return 0.9
    }
}

@RegisterStrategy()
export class EnterpriseUserDiscount extends BaseDiscountStrategy {
    supportType(): UserType {
        return UserType.ENTERPRISE
    }

    protected getDiscountRate(order: Order): number {
        return order.amount > 10000 ? 0.7 : 0.85
    }
}

interface AnotherDiscountStrategy {
    calculateDiscount(order: Order): number
}

export class EnterpriseUserDiscountBridge extends EnterpriseUserDiscount {
    public exposeGetDiscountRate(order: Order): number {
        return this.getDiscountRate(order) // ✅ protected 方法可被子类访问
    }
}

export class EnterpriseUserDiscountAdapter implements AnotherDiscountStrategy {
    constructor(private bridge: EnterpriseUserDiscountBridge) {

    }

    calculateDiscount(order: Order): number {
        const rate = this.bridge.exposeGetDiscountRate(order)
        const discountedPrice = order.amount * rate
        console.log(`[Adapter] 折扣率: ${rate * 100}%, 折后价: ${discountedPrice}`)
        return discountedPrice
    }
}



// ✅ 使用
export function calculateFinalAmount(order: Order): number {
    const strategy = DiscountStrategyFactory.getStrategy(order.userType)
    return createProxyStrategy(strategy).getDiscount(order)
}


// 先写一个方法装饰器，实现增强逻辑
export function LogExecution(
    value: (...args: any[]) => any,
    context: ClassMethodDecoratorContext
): (...args: any[]) => any {
    return function (this: any, ...args: any[]) {
        console.log(`[Log] 方法 ${String(context.name)} 开始`)
        const result = value.apply(this, args)
        console.log(`[Log] 方法 ${String(context.name)} 结束，结果: ${result}`)
        return result
    }
}

export function createProxyStrategy<T extends DiscountStrategy>(strategy: T): T {
    return new Proxy(strategy, {
        get(target, prop, receiver) {
            const origMethod = (target as any)[prop]
            if (prop === 'getDiscount' && typeof origMethod === 'function') {
                return function (...args: Parameters<typeof origMethod>): ReturnType<typeof origMethod> {
                    console.log(`[Proxy] 方法 ${String(prop)} 开始`)
                    const result = origMethod.apply(target, args)
                    console.log(`[Proxy] 方法 ${String(prop)} 结束，结果: ${result}`)
                    return result
                }
            }
            return Reflect.get(target, prop, receiver)
        }
    })
}



