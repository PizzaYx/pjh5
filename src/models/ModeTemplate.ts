import { imageDealWith } from '@/utils/image'

export class Records {
    classid: number = 0
    funurl: string = ''
    haschild: number = 0
    imgmax: string = ''
    imgmin: string = ''
    name: string = ''
    sort: number = 0
    template: string = ''
    cx: number = 0.0
    cy: number = 0.0
    cw: number = 0.0
    ch: number = 0.0
    maxheight: number = 0.0
    timestamp: string = ''
    childtype: number = 0
    horizontal: number = 0
    styleType: number = 0
    ishome: number = 0
    news: number = 0
    records: any = null
    isShow: boolean = false

    constructor(json: any = {}) {
        if (!json) return

        this.classid = Number(json['classid']) || 0
        this.funurl = json['funurl'] || ''
        this.haschild = Number(json['haschild']) || 0

        this.imgmax = json['imgmax'] ? imageDealWith(json['imgmax']) : ''
        this.imgmin = json['imgmin'] ? imageDealWith(json['imgmin']) : ''

        this.name = json['name'] || ''
        this.sort = Number(json['sort']) || 0
        this.template = json['template'] || ''
        this.cx = Number(json['cx']) || 0.0
        this.cy = Number(json['cy']) || 0.0
        this.cw = Number(json['cw']) || 0.0
        this.ch = Number(json['ch']) || 0.0
        this.maxheight = Number(json['maxheight']) || 0.0
        this.timestamp = json['timestamp'] || ''
        this.childtype = Number(json['childtype']) || 0
        this.horizontal = Number(json['horizontal']) || 0
        this.styleType = Number(json['styleType']) || 0
        this.ishome = Number(json['ishome']) || 0
        this.news = Number(json['news']) || 0
        this.records = json['records']
        this.isShow = json['is_show'] || false
    }
}

export class ModeTemplate {
    classid: number = 0
    funurl: string = ''
    haschild: number = 0
    imgmax: string = ''
    imgmin: string = ''
    name: string = ''
    sort: number = 0
    template: string = ''
    cx: number = 0.0
    cy: number = 0.0
    cw: number = 0.0
    ch: number = 0.0
    maxheight: number = 0.0
    timestamp: string = ''
    childtype: number = 0
    horizontal: number = 0
    styleType: number = 0
    ishome: number = 0
    news: number = 0
    records: Records[] = []
    isShow: boolean = false

    constructor(json: any = {}) {
        if (!json) return

        this.classid = Number(json['classid']) || 0
        this.funurl = json['funurl'] || ''
        this.haschild = Number(json['haschild']) || 0

        this.imgmax = json['imgmax'] ? imageDealWith(json['imgmax']) : ''
        this.imgmin = json['imgmin'] ? imageDealWith(json['imgmin']) : ''

        this.name = json['name'] || ''
        this.sort = Number(json['sort']) || 0
        this.template = json['template'] || ''
        this.cx = Number(json['cx']) || 0.0
        this.cy = Number(json['cy']) || 0.0
        this.cw = Number(json['cw']) || 0.0
        this.ch = Number(json['ch']) || 0.0
        this.maxheight = Number(json['maxheight']) || 0.0
        this.timestamp = json['timestamp'] || ''
        this.childtype = Number(json['childtype']) || 0
        this.horizontal = Number(json['horizontal']) || 0
        this.styleType = Number(json['styleType']) || 0
        this.ishome = Number(json['ishome']) || 0
        this.news = Number(json['news']) || 0

        this.records = []
        if (json['records'] && Array.isArray(json['records'])) {
            this.records = json['records'].map((v: any) => new Records(v))
        }

        this.isShow = json['is_show'] || false
    }
}
