// API 接口统一管理
import { get, post, put } from '@/utils/request'
import { API_CONFIG } from '@/config/api.config'
import { PlateArticleList, ModeTemplate, GetArticlePhotos, VideoCommentData, GetArticle, InheritorItem, HeritageItem } from '@/models'

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
// 使用 ModeTemplate 结构

export const navModuleApi = {
    // 获取导航模块列表
    async getNavModuleList(): Promise<Response<ModeTemplate>> {
        const response = await get<Response<any>>('/app/modeTemplate', {
            classid: 512025
        })

        // 转换数据格式
        const modeTemplate = new ModeTemplate(response.data)

        return {
            code: response.code,
            msg: response.msg,
            data: modeTemplate,
        }
    },
}

// ========== 非遗项目模块 ==========
export const projectApi = {
    // 获取非遗项目列表
    async getProjectList(classid: number): Promise<Response<ModeTemplate>> {
        const response = await get<Response<any>>('/app/modeTemplate', {
            classid
        })

        const modeTemplate = new ModeTemplate(response.data)

        return {
            code: response.code,
            msg: response.msg,
            data: modeTemplate,
        }
    },
}

// ========== 非遗传承人模块 ==========
export const inheritorApi = {
    async getInheritorPage(pageNum: number = 1, level: string = '', name: string = ''): Promise<Response<InheritorItem[]>> {
        const response = await get<Response<any[]>>('/intangibleheritage/getInheritorPage', {
            pageNum,
            level,
            name,
        })
        const list = (response.data || []).map((item: any) => new InheritorItem(item))
        return {
            code: response.code,
            msg: response.msg,
            data: list,
        }
    },
    async getInheritorTypeNum(): Promise<Response<Array<{ num: number; type: string }>>> {
        const response = await get<Response<any>>('/intangibleheritage/getInheritorTypeNum')
        const list = Array.isArray(response.data) ? response.data : []
        return {
            code: response.code,
            msg: response.msg,
            data: list,
        }
    },
    async getInheritorById(id: string | number): Promise<Response<InheritorItem>> {
        const response = await get<Response<any>>('/intangibleheritage/getInheritorById', { id })
        return {
            code: response.code,
            msg: response.msg,
            data: new InheritorItem(response.data || {}),
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

// ========== 网上展厅子栏目（相册/音乐/展览/视频） ==========
export const articleApi = {
    // 获取栏目文章列表
    async getPlateArticleList(classid: number, pageNum: number = 1, istop: number = 0): Promise<Response<PlateArticleList[]>> {
        const response = await get<Response<any[]>>('/app/listortop2', {
            classid,
            istop,
            pageNum,
        })

        const list = (response.data || []).map((item: any) => new PlateArticleList(item))

        return {
            code: response.code,
            msg: response.msg,
            data: list,
        }
    },
    // 获取文章详情（视频/直播）
    async getArticleDetail(aid: string, type: number = 0): Promise<Response<VideoCommentData>> {
        const r = await get<Response<any>>('/app/article', { aid })
        return {
            code: r.code,
            msg: r.msg,
            data: new VideoCommentData(r.data || {}, type),
        }
    },
    // 获取文章详情（富文本）
    async getArticle(aid: string): Promise<Response<GetArticle>> {
        const r = await get<Response<any>>('/app/article', { aid })
        return {
            code: r.code,
            msg: r.msg,
            data: new GetArticle(r.data || {}),
        }
    },
}

// ========== 图集详情 ==========
export const photoApi = {
    async getArticlePhotos(aid: string): Promise<Response<GetArticlePhotos>> {
        const endpoints = [
            '/photo/photos',
        ]

        const normalizeToPhotoModelJson = (raw: any): any => {
            const imgsRaw =
                raw?.records ||
                raw?.imageDataVec ||
                raw?.images ||
                raw?.imageList ||
                raw?.photos ||
                raw?.list ||
                []
            const records = (imgsRaw || []).map((it: any, idx: number) => ({
                id: String(it?.id ?? idx),
                imgpath: it?.imgpath || it?.path || it?.url || it?.img || '',
                intro: it?.intro || '',
                sort: Number(it?.sort) || 0,
                title: it?.title || raw?.title || '',
            }))
            return {
                title: raw?.title || '',
                articleid: String(raw?.articleid || raw?.id || ''),
                appcode: raw?.appcode || '',
                timestamp: raw?.timestamp || raw?.time || raw?.date || '',
                commsum: Number(raw?.commsum) || 0,
                score: Number(raw?.score) || 0,
                records,
            }
        }

        for (const ep of endpoints) {
            try {
                const r = await get<Response<any>>(ep, { aid })
                return {
                    code: r.code,
                    msg: r.msg,
                    data: new GetArticlePhotos(normalizeToPhotoModelJson(r.data)),
                }
            } catch {
            }
        }

        return {
            code: 500,
            msg: '获取图集失败',
            data: new GetArticlePhotos({
                title: '',
                articleid: '',
                appcode: '',
                timestamp: '',
                commsum: 0,
                score: 0,
                records: [],
            }),
        }
    },
}

// ========== 非遗动态模块 ==========


export const newsApi = {
    async getNewsPage(pageNum: number = 1, name: string = ''): Promise<Response<any[]>> {
        const response = await get<Response<any[]>>('/intangibleheritage/getNewsPage', {
            pageNum,
            name,
        })
        return {
            code: response.code,
            msg: response.msg,
            data: response.data || [],
        }
    },
}

// ========== 非遗项目分页 ==========
export const heritageApi = {
    async getHeritagePage(pageNum: number = 1, category: string = '', level: string = '', name: string = ''): Promise<Response<HeritageItem[]>> {
        const lvl = String(level || '').trim()
        const levelParam = (lvl === '全部' ? '' : lvl)
        const response = await get<Response<any[]>>('/intangibleheritage/getHeritagePage', {
            pageNum,
            category,
            level: levelParam,
            name,
        })
        const list = (response.data || []).map((item: any) => new HeritageItem(item))
        return {
            code: response.code,
            msg: response.msg,
            data: list,
        }
    },
    async getHeritageById(id: string | number): Promise<Response<HeritageItem>> {
        const response = await get<Response<any>>('/intangibleheritage/getHeritageById', {
            id,
        })
        return {
            code: response.code,
            msg: response.msg,
            data: new HeritageItem(response.data || {}),
        }
    },
    async getHeritageTypeNum(category: string): Promise<Response<Array<{ num: number; type: string }>>> {
        const response = await get<Response<any>>('/intangibleheritage/getHeritageTypeNum', { category })
        const list = Array.isArray(response.data) ? response.data : []
        return {
            code: response.code,
            msg: response.msg,
            data: list,
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
    article: articleApi,
    photo: photoApi,
    news: newsApi,
    heritage: heritageApi,
    user: userApi,
    common: commonApi,
    auth: authApi,
}
