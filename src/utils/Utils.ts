// utils.ts
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import relativeTime from 'dayjs/plugin/relativeTime'
import validator from 'validator'
import { v4 as uuidv4 } from 'uuid'
import qs from 'qs'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(relativeTime)

//
// 日期工具
//
export const formatDate = (date: string | Date | number, format = 'YYYY-MM-DD HH:mm:ss'): string => {
    return dayjs(date).format(format)
}

export const isBefore = (a: string | Date, b: string | Date): boolean => {
    return dayjs(a).isBefore(dayjs(b))
}

export const isAfter = (a: string | Date, b: string | Date): boolean => {
    return dayjs(a).isAfter(dayjs(b))
}

export const fromNow = (date: string | Date): string => {
    return dayjs(date).fromNow()
}

//
// 校验工具（基于 validator.js）
//
export const isEmail = (value: string): boolean => validator.isEmail(value)
export const isMobile = (value: string): boolean => validator.isMobilePhone(value, 'zh-CN')
export const isURL = (value: string): boolean => validator.isURL(value)

//
// 通用工具
//
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const uuid = (): string => uuidv4()


//
// 对象工具
//
export const isEmptyObject = (obj: object): boolean => Object.keys(obj).length === 0

export const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj))


//
// URL 工具
//
export const serializeQuery = (params: object): string => qs.stringify(params)

export const parseQuery = (query: string): any => qs.parse(query)

// 推断函数返回值类型
export type ReturnTypeInfer<T> = T extends (...args: any[]) => infer R ? R : T;

// 推断Promise返回值类型
export type PromiseReturnType<T extends Promise<any>> = T extends Promise<infer R>? R : T;

// 获取函数第一个参数的类型
export type FirstParamType<T> = T extends (arg: infer P,...args: any[]) => any ? P : T;
