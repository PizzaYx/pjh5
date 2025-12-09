import { imageDealWith } from '@/utils/image'

export class PlateArticleList {
    chatroomid: string = '' // 聊天室ID
    appcode: string = '' // 应用编码
    id: string = '' // 文章ID
    click: number = 0 // 点击量
    commsum: number = 0 // 回复量
    funid: string = '' // 跳转ID
    funname: string = '' // 功能名称
    funtype: number = 0 // 跳转类型 1、内部功能 2、URL链接

    imgpath1: string = ''
    imgpath2: string = ''
    imgpath3: string = ''

    lessonType: string = '' // 课程类型
    intro: string = '' // 简介

    orgimgpath: string = '' // 大图
    orgimgpath2: string = ''
    orgimgpath3: string = ''

    publishtime: number = 0 // 发布时间
    simpletitle: string = '' // 简要标题
    sort: number = 0 // 排序
    timestamp: number = 0 // 时间戳
    friendlyTime: string = ''
    type: number = 0 // 类型
    typelabel: string = '' // 类型标签
    classname: string = '' // 活动类型
    needno: number = 0 // 需要人数
    title: string = '' // 标题
    source: string = '' // 来源
    timestamp1: number = 0 // 时间戳
    msg: string = ''
    videoUrl: string = '' // 视频路径
    directpath: string = '' // 直播路径

    getsarttime: number = 0 // 报名开始时间
    getendtime: number = 0 // 报名结束时间
    servstarttime: number = 0 // 活动开始时间
    servendtime: number = 0 // 活动结束时间

    address: string = '' // 地址
    distance: string = '' // 距离
    lat: string = '' // 经度
    lon: string = '' // 纬度

    direct_time: number = 0
    direct_state: number = 0
    direct_isback: number = 0 // 直播
    estate: number = 0 // 3即将开始 4 开始 5 结束
    countdirect: number = 0 // 课节数量
    lineneednum: number = 0 // 在线报名需要人数
    directtype: number = 0 // 1单场 2系列课

    enterstarttime: number = 0 // 报名开始
    enterendtime: number = 0 // 结束时间
    direct_date: number = 0 // 直播开始时间
    direct_date_end: number = 0 // 直播结束时间
    listTime: number = 0 // 下一场时间
    localAlreadyNum: number = 0 // 已报名人数
    localNeedNum: number = 0 // 本地需要人数
    tags: string = '' // 标签

    // VR美术馆
    vrstarttime: number = 0
    vrendtime: number = 0
    vrstate: number = 0
    vrnumber: number = 0
    vrvediopath: string = ''

    // 视频专题数量
    videolistnum: number = 0
    vediodirection: number = 0
    hiddentitle: number = 0
    publisher: string = ''
    isnormalact: number = 0 // 0不正常
    isPriceLesson: number = 0
    price: number = 0.0
    studentage: string = ''
    isUpLesson: number = 0
    classtime: string = ''
    directTeacherImg: string = ''
    directTeacherName: string = ''
    timg: string = ''
    vname: string = ''
    delintegral: number = 0 // 参与活动扣积分
    isLotteryLesson: number = 0 // 0非抽奖 1抽奖

    constructor(json: any = {}) {
        if (!json) return

        this.chatroomid = json["roomid"] || ""
        this.timg = json['timg'] || ''
        this.vname = json['vname'] || ''
        this.appcode = json["appcode"] || ''
        this.id = json["id"] || ''
        this.isPriceLesson = Number(json["isPriceLesson"]) || 0
        this.studentage = json["studentage"] || ''
        this.price = Number(json["price"]) || 0
        this.click = Number(json["click"]) || 0
        this.funid = json["funid"] || ''
        this.funname = json["funname"] || ''

        // isnormalact 类型转换逻辑保持一致
        if (typeof json['isnormalact'] === 'string') {
            this.isnormalact = parseInt(json['isnormalact'])
        } else {
            this.isnormalact = Number(json['isnormalact']) || 0
        }

        this.lessonType = json['lessonType'] || ''
        this.funtype = Number(json["funtype"]) || 0

        // 图片处理
        this.imgpath1 = imageDealWith(json["imgpath1"] || '')
        this.imgpath2 = imageDealWith(json["imgpath2"] || '')
        this.imgpath3 = imageDealWith(json["imgpath3"] || '')

        this.intro = json["intro"] || ''
        this.hiddentitle = Number(json["hiddentitle"]) || 1

        // 大图处理
        this.orgimgpath = imageDealWith(json["orgimgpath1"] || '')
        this.orgimgpath2 = imageDealWith(json["orgimgpath2"] || '')
        this.orgimgpath3 = imageDealWith(json["orgimgpath3"] || '')

        this.directTeacherImg = json['directTeacherImg'] || ''
        this.directTeacherName = json['directTeacherName'] || ''
        this.publishtime = Number(json["publishtime"]) || 0
        this.simpletitle = json["simpletitle"] || json["title"] || ''
        this.sort = Number(json["sort"]) || 0
        this.timestamp = Number(json["timestamp"]) || 0
        this.friendlyTime = json["friendlyTime"] || ""
        this.type = Number(json["type"]) || 0
        this.publisher = json["publisher"] || ""
        this.typelabel = json["typelabel"] || ''
        this.classname = json["classname"] || ''
        this.needno = Number(json["needno"]) || 0
        this.title = json["title"] || ''
        this.source = json["source"] || ''
        this.timestamp1 = Number(json["timestamp1"]) || 0
        this.msg = json["msg"] || ''

        this.videoUrl = imageDealWith(json["vediopath_m3u8"] || '')
        this.directpath = imageDealWith(json["directpath"] || '')

        this.getsarttime = Number(json["getsarttime"]) || 0
        this.getendtime = Number(json["getendtime"]) || 0
        this.servstarttime = Number(json["servstarttime"]) || 0
        this.servendtime = Number(json["servendtime"]) || 0
        this.address = json["address"] || ''
        this.distance = json["distance"] || ''
        this.lat = json["lat"] || ""
        this.lon = json["lon"] || ""

        this.direct_time = Number(json["direct_time"]) || 0
        this.direct_state = Number(json["direct_state"]) || 0
        this.direct_isback = Number(json["direct_isback"]) || 0
        this.estate = Number(json["estate"]) || 0
        this.countdirect = Number(json["countdirect"]) || 0
        this.lineneednum = Number(json["lineneednum"]) || 0
        this.directtype = Number(json["directtype"]) || 0

        this.enterstarttime = Number(json["enterstarttime"]) || 0
        this.enterendtime = Number(json["enterendtime"]) || 0
        this.direct_date = Number(json["direct_date"]) || 0
        this.direct_date_end = Number(json["direct_date_end"]) || 0
        this.listTime = Number(json["listTime"]) || 0
        this.localAlreadyNum = Number(json["localAlreadyNum"]) || 0
        this.localNeedNum = Number(json["localNeedNum"]) || 0
        this.tags = json["tags"] || ""

        this.vrstarttime = Number(json["vrstarttime"]) || 0
        this.vrendtime = Number(json["vrendtime"]) || 0
        this.vrstate = Number(json["vrstate"]) || 0
        this.vrnumber = Number(json["vrnumber"]) || 0
        this.vrvediopath = imageDealWith(json["vediopath"] || '')

        this.videolistnum = Number(json["videolistnum"]) || 0
        this.vediodirection = Number(json["vediodirection"]) || 0
        this.isUpLesson = Number(json["isUpLesson"]) || 0
        this.classtime = json['classtime'] || ''
        this.delintegral = Number(json['delintegral']) || 0
        this.isLotteryLesson = Number(json['isLotteryLesson']) || 0
    }
}
