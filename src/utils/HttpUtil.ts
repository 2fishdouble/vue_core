import axios, {
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
    type InternalAxiosRequestConfig
} from 'axios'

// 创建实例
const http: AxiosInstance = axios.create({
    // baseURL: import.meta.env.VITE_BASE_API,
    timeout: 10000
})

// 请求拦截器
http.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // 可统一处理参数，比如时间戳、签名等
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
http.interceptors.response.use(
    (response: AxiosResponse) => {
        const {data} = response
        if (response.status === 500) {
            console.error(data.message)
            return Promise.reject(data)
        }
        return data
    },
    (error) => {
        const {response} = error
        if (response) {
            console.log(response.data)
        } else {
            console.error(error)
        }
        return Promise.reject(error)
    }
)

// GET
export const get = <T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
    return http.get(url, {params, ...config})
}

// POST
export const post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return http.post(url, data, config)
}

// PUT
export const put = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return http.put(url, data, config)
}

// DELETE
export const del = <T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
    return http.delete(url, {params, ...config})
}

// 上传文件
export const upload = <T = any>(url: string, file: File, field = 'file', extraData: Record<string, any> = {}): Promise<T> => {
    const formData = new FormData()
    formData.append(field, file)
    Object.entries(extraData).forEach(([key, value]) => {
        formData.append(key, value)
    })

    return http.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export default http
