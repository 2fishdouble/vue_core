
export enum ModificationRestrictionCode {
    ADDRESS = 0,
    TIME = 1,
}

// 类型保护函数
export function isValidModificationRestrictionCode(code: unknown): code is ModificationRestrictionCode {
    return [0, 1].includes(code as number)
}


// 限制标题
export function getModificationTitle(code: number): string {
    return ModificationRestrictionTitleMap.get(code) ?? '未知'
}

// 限制数量
export function getRestrictionLimit(code: number): number {
    const item = ModificationRestrictionEnum.find(i => i.code === code)
    // equals to: item?.limit !== null && item?.limit !== undefined ? item.limit : 0
    // equals to: (item !== null && item !== undefined && item.limit !== null && item.limit !== undefined)
    //     ? item.limit
    //     : 0
    return item?.limit ?? 0
}

// 枚举值数组
export const ModificationRestrictionEnum = [
    {
        code: ModificationRestrictionCode.ADDRESS,
        title: "地址",
        limit: 1,
    },
    {
        code: ModificationRestrictionCode.TIME,
        title: "时间",
        limit: 1,
    },
]

// 👉 可选 Map：title => code
export const ModificationRestrictionCodeByTitle = new Map<string, ModificationRestrictionCode>(
    ModificationRestrictionEnum.map(item => [item.title, item.code])
)

// 👉 可选 Map：code => title
export const ModificationRestrictionTitleMap = new Map<number, string>(
    ModificationRestrictionEnum.map(item => [item.code, item.title])
)


// 元组类型定义：[code, title, limit]
export type ModificationRestrictionTuple = [code: number, title: string, limit: number]

// 枚举值数组（数据 + 类型双清晰）
export const ModificationRestrictionTitleTupleArray: ModificationRestrictionTuple[] = [
    [0, "地址", 1],
    [1, "时间", 1],
]

// 枚举值对象（数据 + 类型双清晰）
export const ModificationRestrictionRecord: Record<ModificationRestrictionCode, ModificationRestrictionTuple> = {
    [ModificationRestrictionCode.ADDRESS]: [0, "地址", 2],
    [ModificationRestrictionCode.TIME]: [1, "时间", 3],
}

// options 选项数组
export const ModificationRestrictionSelectOptions = ModificationRestrictionEnum.map(i => ({
    label: i.title,
    value: i.code,
}))

// i18n
export const ModificationRestrictionEnumI18n = [
    { code: 0, titleKey: 'enum.modification.address' },
    { code: 1, titleKey: 'enum.modification.time' },
]

// type 只能是0或1
// 索引访问类型 ModificationRestrictionEnum[number] 等同于 ModificationRestrictionTuple

// const fruits = ['apple', 'banana', 'orange'] as const;
// fruits 类型是 readonly ['apple', 'banana', 'orange']
// type Fruit = typeof fruits[number];
// 等价于 'apple' | 'banana' | 'orange'
export type ModificationRestrictionCodeType = typeof ModificationRestrictionEnum[number]['title']