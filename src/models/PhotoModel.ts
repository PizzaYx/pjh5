import { imageDealWith } from '@/utils/image'

export class RecordsData {
    id: string = ''
    imgpath: string = ''
    intro: string = ''
    sort: number = 0
    title: string = ''

    constructor(json: any = {}) {
        if (!json) return
        this.id = json['id'] || ''
        this.imgpath = imageDealWith(json['imgpath'] || '')
        this.intro = json['intro'] || ''
        this.sort = Number(json['sort']) || 0
        this.title = json['title'] || ''
    }
}

export class GetArticlePhotos {
    title: string = ''
    articleid: string = ''
    appcode: string = ''
    timestamp: string = ''
    commsum: number = 0
    score: number = 0
    imageDataVec: RecordsData[] = []

    constructor(json: any = {}) {
        if (!json) return
        this.title = json['title'] || ''
        this.articleid = json['articleid'] || ''
        this.appcode = json['appcode'] || ''
        this.timestamp = json['timestamp'] || ''
        this.commsum = Number(json['commsum']) || 0
        this.score = Number(json['score']) || 0

        if (json && json['records'] && Array.isArray(json['records'])) {
            this.imageDataVec = json['records'].map((v: any) => new RecordsData(v))
        } else {
            this.imageDataVec = []
        }
    }
}
