// API 接口统一管理
import { get, post, put } from '@/utils/request'
import { API_CONFIG } from '@/config/api.config'
import { PlateArticleList } from '@/models'

// ========== 响应数据类型 ==========
export interface Response<T = any> {
    code: number
    msg: string
    data: T
}

// 分页响应类型
export interface PageResponse<T = any> {
    list: T[]
    pageNum: number
    pageSize: number
}

// ========== 认证模块 ==========
export const authApi = {
    // 获取 Token
    async getToken() {
        // query parameters: appcode, secret
        const params = {
            appcode: API_CONFIG.APP_CODE,
            secret: API_CONFIG.APP_SECRET
        }

        // 注意：根据 Dart 代码，这里是 GET 请求
        // 接口地址：auth/getToken
        const response = await get<Response<{ access_token: string }>>('/auth/getToken', params)

        // 如果请求成功，保存 token
        if (response.code === 200 || response.code === 0) {
            const token = response.data?.access_token
            if (token) {
                localStorage.setItem('token', token)
            }
        }

        return response
    }
}

// ========== Banner 模块 ==========
// 已切换为 PlateArticleList 模型
// 原始 BannerRaw 和 BannerItem 接口已废弃，直接使用 PlateArticleList

export const bannerApi = {
    // 获取 Banner 列表
    async getBannerList(): Promise<Response<PlateArticleList[]>> {
        // 假设 type=2 是首页轮播图，如果需要其他类型请修改
        const response = await get<Response<any[]>>('/app/listortop2', {
            classid: 512022, istop: 1
        })

        // 转换数据格式
        const banners = (response.data || []).map((item: any) => new PlateArticleList(item))

        return {
            code: response.code,
            msg: response.msg,
            data: banners,
        }
    },
}

// ========== 导航模块（金刚区） ==========
// 后端返回的数据结构
interface NavModuleRaw {
    id: string
    title: string
    Img: string // 注意：字段名是大写 I
    collectionId: string
    collectionName: string
}

// 前端使用的数据结构
export interface NavModuleItem {
    id: string
    title: string
    img: string // 完整图片 URL
}

// 转换函数
function transformNavModule(raw: NavModuleRaw): NavModuleItem {
    // PocketBase 图片路径格式（测试环境）
    // 格式：http://baseURL/api/files/{collectionName}/{id}/{filename}
    const imgUrl = `${API_CONFIG.baseURL}/api/files/${raw.collectionName}/${raw.id}/${raw.Img}`

    return {
        id: raw.id,
        title: raw.title,
        img: imgUrl,
    }
}

export const navModuleApi = {
    // 获取导航模块列表
    async getNavModuleList(): Promise<Response<NavModuleItem[]>> {
        const response = await get<Response<PageResponse<NavModuleRaw>>>('/java/list/homeFunModules')

        // 转换数据格式
        const modules = response.data.list.map(transformNavModule)

        return {
            code: response.code,
            msg: response.msg,
            data: modules,
        }
    },
}

// ========== 非遗项目模块 ==========
interface ProjectRaw {
    id: string
    title: string
    img1: string // 首页展示用
    img2: string // 列表页展示用
    collectionId: string
    collectionName: string
    [key: string]: any
}

export interface ProjectItem {
    id: string
    title: string
    img1: string
    img2: string
}

function transformProject(raw: ProjectRaw): ProjectItem {
    return {
        id: raw.id,
        title: raw.title,
        // img1 完整路径
        img1: `${API_CONFIG.baseURL}/api/files/${raw.collectionName}/${raw.id}/${raw.img1}`,
        // img2 完整路径
        img2: `${API_CONFIG.baseURL}/api/files/${raw.collectionName}/${raw.id}/${raw.img2}`,
    }
}

export const projectApi = {
    // 获取非遗项目列表
    async getProjectList(pageNum: number = 1, pageSize: number = 20): Promise<Response<PageResponse<ProjectItem>>> {
        const response = await get<Response<PageResponse<ProjectRaw>>>('/java/list/homefypj', {
            pageNum,
            pageSize,
        })

        const projects = response.data.list.map(transformProject)

        return {
            code: response.code,
            msg: response.msg,
            data: {
                list: projects,
                pageNum: response.data.pageNum,
                pageSize: response.data.pageSize,
            },
        }
    },
}

// ========== 非遗传承人模块 ==========
interface InheritorRaw {
    id: string
    title: string
    img: string
    collectionId: string
    collectionName: string
    [key: string]: any
}

export interface InheritorItem {
    id: string
    title: string
    img: string
}

function transformInheritor(raw: InheritorRaw): InheritorItem {
    return {
        id: raw.id,
        title: raw.title,
        img: `${API_CONFIG.baseURL}/api/files/${raw.collectionName}/${raw.id}/${raw.img}`,
    }
}

export const inheritorApi = {
    async getInheritorList(pageNum: number = 1, pageSize: number = 20): Promise<Response<PageResponse<InheritorItem>>> {
        const response = await get<Response<PageResponse<InheritorRaw>>>('/java/list/homefyccr', {
            pageNum,
            pageSize,
        })
        const list = response.data.list.map(transformInheritor)
        return {
            code: response.code,
            msg: response.msg,
            data: {
                list: list,
                pageNum: response.data.pageNum,
                pageSize: response.data.pageSize,
            },
        }
    },
}

// ========== 网上展厅模块 ==========
interface ExhibitionRaw {
    id: string
    title: string
    img1: string // 首页展示图
    img2: string // 列表页展示图
    collectionId: string
    collectionName: string
    [key: string]: any
}

export interface ExhibitionItem {
    id: string
    title: string
    img1: string
    img2: string
}

function transformExhibition(raw: ExhibitionRaw): ExhibitionItem {
    return {
        id: raw.id,
        title: raw.title,
        img1: `${API_CONFIG.baseURL}/api/files/${raw.collectionName}/${raw.id}/${raw.img1}`,
        // 如果没有 img2，回退到 img1
        img2: raw.img2
            ? `${API_CONFIG.baseURL}/api/files/${raw.collectionName}/${raw.id}/${raw.img2}`
            : `${API_CONFIG.baseURL}/api/files/${raw.collectionName}/${raw.id}/${raw.img1}`,
    }
}

export const exhibitionApi = {
    // 获取列表（支持分页）
    async getExhibitionList(pageNum: number = 1, pageSize: number = 20): Promise<Response<PageResponse<ExhibitionItem>>> {
        const response = await get<Response<PageResponse<ExhibitionRaw>>>('/java/list/homewszt', {
            pageNum,
            pageSize,
        })

        const list = response.data.list.map(transformExhibition)

        return {
            code: response.code,
            msg: response.msg,
            data: {
                list: list,
                pageNum: response.data.pageNum,
                pageSize: response.data.pageSize,
            },
        }
    },
}

// ========== 非遗动态模块 ==========
interface NewsRaw {
    id: string
    title: string
    time: string
    img: string
    collectionId: string
    collectionName: string
    [key: string]: any
}

export interface NewsItem {
    id: string
    title: string
    date: string
    img: string
    address?: string
}

function transformNews(raw: NewsRaw): NewsItem {
    // 格式化日期：2025-12-05 03:18... -> 2025.12.05
    let dateStr = ''
    if (raw.time) {
        const date = new Date(raw.time)
        if (!isNaN(date.getTime())) {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            dateStr = `${year}.${month}.${day}`
        } else {
            dateStr = raw.time.substring(0, 10) // 降级处理
        }
    } else if (raw.friendlyTime) {
        dateStr = raw.friendlyTime
    }

    let imgUrl = ''
    const rawImg = raw.img || raw.imgpath1 || ''
    if (rawImg && (rawImg.startsWith('http') || rawImg.startsWith('//'))) {
        imgUrl = rawImg
    } else {
        imgUrl = `${API_CONFIG.baseURL}/api/files/${raw.collectionName}/${raw.id}/${rawImg}`
    }

    return {
        id: raw.id,
        title: raw.title || raw.simpletitle || '',
        date: dateStr,
        img: imgUrl,
        address: raw.address || ''
    }
}

export const newsApi = {
    async getNewsList(pageNum: number = 1, pageSize: number = 20): Promise<Response<PageResponse<NewsItem>>> {
        const response = await get<Response<PageResponse<NewsRaw>>>('/java/list/homefydt', {
            pageNum,
            pageSize,
        })
        const list = response.data.list.map(transformNews)
        return {
            code: response.code,
            msg: response.msg,
            data: {
                list: list,
                pageNum: response.data.pageNum,
                pageSize: response.data.pageSize,
            },
        }
    },
}

// 示例：用户相关 API
export const userApi = {
    // 登录
    login(data: { username: string; password: string }) {
        return post<Response<{ token: string; userInfo: any }>>('/user/login', data)
    },

    // 获取用户信息
    getUserInfo() {
        return get<Response<any>>('/user/info')
    },

    // 更新用户信息
    updateUserInfo(data: any) {
        return put<Response<any>>('/user/info', data)
    },
}

// 示例：通用 API
export const commonApi = {
    // 获取配置
    getConfig() {
        return get<Response<any>>('/config')
    },

    // 上传文件
    upload(file: File) {
        const formData = new FormData()
        formData.append('file', file)
        return post<Response<{ url: string }>>('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    },
}

// 导出所有 API
export default {
    banner: bannerApi,
    navModule: navModuleApi,
    project: projectApi,
    inheritor: inheritorApi,
    exhibition: exhibitionApi,
    news: newsApi,
    user: userApi,
    common: commonApi,
    auth: authApi,
}

