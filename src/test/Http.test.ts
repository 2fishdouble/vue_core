// src/utils/request.test.ts
import { describe, it} from 'vitest'
import { get, post, put, del, upload } from '@/utils/HttpUtil.ts'
import {sleep} from "@/utils/Utils.ts";

describe('Axios Util API 测试', () => {
    it('GET 请求: JSONPlaceholder', async () => {
        const res = await get('https://jsonplaceholder.typicode.com/posts/1')
        console.log(res)
        await sleep(2000)
    })

    it('POST 请求: JSONPlaceholder', async () => {
        const res = await post('https://jsonplaceholder.typicode.com/posts', {
            title: 'foo',
            body: 'bar',
            userId: 1,
        })
        console.log(res)
        await sleep(2000)
    })

    it('PUT 请求: JSONPlaceholder', async () => {
        const res = await put('https://jsonplaceholder.typicode.com/posts/1', {
            title: 'updated title',
        })
        console.log(res)
        await sleep(2000)
    })

    it('DELETE 请求: JSONPlaceholder', async () => {
        const res = await del('https://jsonplaceholder.typicode.com/posts/1')
        console.log(res)
        await sleep(2000)
    })

    it('上传请求: httpbin.org', async () => {
        const file = new File(['hello world'], 'hello.txt', { type: 'text/plain' })
        const res = await upload('https://httpbin.org/post', file)
        console.log(res)
        await sleep(1000)
    })
})
