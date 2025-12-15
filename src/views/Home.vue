<template>
    <div class="home-container">

        <!-- 1. 顶部轮播图 -->
        <div class="banner-wrapper">
            <!-- 加载中 -->
            <div v-if="loading" class="banner-loading">
                <van-loading type="spinner" color="#fff">加载中...</van-loading>
            </div>

            <!-- 轮播图 -->
            <van-swipe v-else-if="banners.length > 0" class="my-swipe" :autoplay="3000" :show-indicators="false"
                @change="onBannerChange">
                <van-swipe-item v-for="item in banners" :key="item.id">
                    <img :src="item.imgpath1" :alt="item.title" class="banner-img" />
                </van-swipe-item>
            </van-swipe>

            <!-- 空状态 -->
            <div v-else class="banner-empty">
                <van-empty description="暂无轮播图" />
            </div>

            <!-- 自定义数字指示器 -->
            <div v-if="banners.length > 0" class="custom-indicator">
                {{ bannerIndicatorText }}
            </div>
        </div>

        <!-- 内容区域（白色卡片，从金刚区开始） -->
        <div class="content-card">
            <!-- 2. 金刚区导航 -->
            <div class="nav-section">
                <!-- 加载中 -->
                <div v-if="navLoading" class="nav-loading">
                    <van-loading size="20">加载中...</van-loading>
                </div>

                <!-- 导航图标 -->
                <div v-else-if="navModules.length > 0" class="nav-item" v-for="item in navModules" :key="item.classid"
                    @click="handleBtn(item.classid, item.name)">
                    <div class="icon-box">
                        <img :src="item.imgmin" :alt="item.name" class="nav-icon" />
                    </div>
                    <span class="nav-name">{{ item.name }}</span>
                </div>

                <!-- 空状态 -->
                <div v-else class="nav-empty">暂无导航</div>
            </div>

            <!-- 3. 非遗项目 -->
            <div class="section">
                <div class="section-header">
                    <h3 class="title">非遗项目</h3>
                    <span class="more" @click="handleMore('非遗项目')">全部 <van-icon name="arrow" /></span>
                </div>

                <div v-if="projectLoading" class="loading-box">
                    <van-loading size="24px">加载中...</van-loading>
                </div>

                <div v-else class="project-grid">
                    <div class="project-card" v-for="item in projects" :key="item.classid"
                        @click="handleDetail(item.classid)">
                        <!-- 使用 imgmin 作为背景图或直接显示 -->
                        <img :src="item.imgmin" :alt="item.name" class="card-bg" />
                        <span class="card-text">{{ item.name }}</span>
                    </div>
                </div>
            </div>

            <!-- 4. 非遗传承人 (横向滚动) -->
            <div class="section">
                <div class="section-header">
                    <h3 class="title">非遗传承人</h3>
                    <span class="more" @click="handleMore('非遗传承人')">全部 <van-icon name="arrow" /></span>
                </div>

                <div v-if="inheritorLoading" class="loading-box">
                    <van-loading size="24px">加载中...</van-loading>
                </div>

                <div v-else class="scroll-container">
                    <div class="inheritor-card" v-for="item in inheritors" :key="item.id"
                        @click="handleInheritorDetail(item)">
                        <img :src="item.image" class="inheritor-img" />
                        <div class="overlay">
                            <span>{{ item.name }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 5. 网上展厅 -->
            <div class="section">
                <div class="section-header">
                    <h3 class="title">网上展厅</h3>
                    <span class="more" @click="handleMore('网上展厅')">全部 <van-icon name="arrow" /></span>
                </div>

                <div v-if="exhibitionLoading" class="loading-box">
                    <van-loading size="24px">加载中...</van-loading>
                </div>

                <div v-else class="exhibition-grid">
                    <div class="exhibit-card" v-for="item in exhibitions" :key="item.classid"
                        @click="handleExhibitionDetail(item)">
                        <span class="exhibit-name">{{ item.name }}</span>
                        <!-- 使用图片 -->
                        <img :src="item.imgmin" class="exhibit-img" />
                    </div>
                </div>
            </div>

            <!-- 6. 非遗动态 (双列) -->
            <div class="section">
                <div class="section-header">
                    <h3 class="title">非遗动态</h3>
                    <span class="more" @click="handleMore('非遗动态')">全部 <van-icon name="arrow" /></span>
                </div>

                <div v-if="newsLoading" class="loading-box">
                    <van-loading size="24px">加载中...</van-loading>
                </div>

                <div v-else class="news-list">
                    <div class="news-card" v-for="item in newsList" :key="item.id" @click="handleNewsDetail(item)">
                        <div class="news-img-box">
                            <img :src="formatImg(item.imgpath1)" loading="lazy" />
                        </div>
                        <div class="news-info">
                            <p class="news-title van-multi-ellipsis--l2">{{ item.title }}</p>
                            <p class="news-date">
                                <van-icon name="calendar-o" /> {{ formatNewsDate(item.publishtime) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 底部留白，防止被 Tabbar 遮挡 -->
            <div style="height: 50px;"></div>

        </div> <!-- content-card 结束 -->

    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import api from '../api/index';
import { InheritorItem } from '@/models';
import { imageDealWith } from '@/utils/image';
import { PlateArticleList, Records } from '@/models';

const router = useRouter();

// 硬编码 classid（便于统一修改）
const FY_CLASSID = 512026; // 非遗项目
const WSZT_CLASSID = 512028; // 网上展厅


// --- 数据定义 ---

// 1. 顶部轮播图数据（从后台获取）
const banners = ref<PlateArticleList[]>([]);
const loading = ref(true);

// 2. 金刚区导航图标（从后台获取）
const navModules = ref<Records[]>([]);
const navLoading = ref(true);

// 3. 非遗项目（从后台获取）
const projects = ref<Records[]>([]);
const projectLoading = ref(true);

// 4. 传承人 (横向滚动)
const inheritors = ref<InheritorItem[]>([]);
const inheritorLoading = ref(true);

// 5. 网上展厅 (2x2)
const exhibitions = ref<Records[]>([]);
const exhibitionLoading = ref(true);

// 6. 非遗动态 (瀑布流)
const newsList = ref<any[]>([]);
const newsLoading = ref(true);

// 轮播图当前索引
const currentBanner = ref(0);

// 计算当前页码显示文本
const bannerIndicatorText = computed(() => {
    return `${currentBanner.value + 1}/${banners.value.length}`;
});

// 轮播图切换事件
const onBannerChange = (index: number) => {
    currentBanner.value = index;
};

// 点击事件
const handleMore = (section: string) => {

    if (section === '非遗项目') {
        router.push({ path: '/project-list', query: { classid: String(FY_CLASSID) } });
    } else if (section === '网上展厅') {
        router.push({ path: '/exhibition-list', query: { classid: String(WSZT_CLASSID) } });
    } else if (section === '非遗传承人') {
        router.push('/inheritor-list');
    } else if (section === '非遗动态') {
        router.push('/news-list');
    }
};
const handleBtn = (id: string | number, section: string) => {

    if (section === '非遗项目') {
        // 点击金刚区某项时，将该项的 classid 传给 project-list
        router.push({ path: '/project-list', query: { classid: String(id) } });
    } else if (section === '网上展厅') {
        router.push({ path: '/exhibition-list', query: { classid: String(id) } });
    } else if (section === '非遗传承人') {
        router.push('/inheritor-list');
    } else if (section === '非遗动态') {
        router.push('/news-list');
    }
};

const handleDetail = (id: string | number) => {
    // 将项 id 传给详情页，避免未使用参数的 lint 报错
    router.push({ path: '/intangible-heritage-list', query: { id: String(id) } });
}

// 传承人卡片点击事件
const handleInheritorDetail = (item: InheritorItem) => {
    const id = String(item?.id || '');
    if (!id) return;
    router.push({ path: '/inheritor-detail', query: { id, title: item.name } });
}

// 展厅卡片点击事件
const handleExhibitionDetail = (item: Records) => {
    // 根据 name 判断跳转到哪个子页面
    let path = '/exhibition-album'; // 默认相册

    if (item.name.includes('音乐')) {
        path = '/exhibition-music';
    } else if (item.name.includes('展览')) {
        path = '/exhibition-show';
    } else if (item.name.includes('视频')) {
        path = '/exhibition-video';
    } else if (item.name.includes('相册')) {
        path = '/exhibition-album';
    }

    // 跳转到子页面，传递 classid 参数
    router.push({ path, query: { classid: String(item.classid) } });
}

// --- API 调用（Java 标准格式，拦截器自动处理 NocoDB 转换） ---

// 获取 Banner 数据
const fetchBanners = async () => {
    try {
        loading.value = true;
        const response = await api.banner.getBannerList();

        if (response.code === 1200 && response.data && response.data.length > 0) {
            banners.value = response.data;
            console.log('Banner 数据:', response.data);
        }
    } catch (error) {
        console.error('获取 Banner 失败:', error);
        showToast('获取轮播图失败');
    } finally {
        loading.value = false;
    }
};


// 获取导航模块数据
const fetchNavModules = async () => {
    try {
        navLoading.value = true;
        const response = await api.navModule.getNavModuleList();

        if ((response.code === 1200) && response.data && response.data.records) {
            navModules.value = response.data.records;
            console.log('导航模块数据:', response.data.records);

        }
    } catch (error) {
        console.error('获取导航模块失败:', error);
        showToast('获取导航失败');
    } finally {
        navLoading.value = false;
    }
};

// 获取非遗项目
const fetchProjects = async () => {
    try {
        projectLoading.value = true;
        // 临时使用硬编码 FY_CLASSID 进行测试
        const response = await api.project.getProjectList(FY_CLASSID);

        if (response.code === 1200 && response.data && response.data.records) {
            // 只取前4个展示在首页
            projects.value = response.data.records.slice(0, 4);
        }
    } catch (error) {
        console.error('获取非遗项目失败:', error);
    } finally {
        projectLoading.value = false;
    }
};

// 获取非遗传承人
const fetchInheritors = async () => {
    try {
        inheritorLoading.value = true;
        // 获取第一页
        const response = await api.inheritor.getInheritorPage(1, '', '');
        if (response.code === 1200 && Array.isArray(response.data)) {
            inheritors.value = response.data.slice(0, 8);
        }
    } catch (error) {
        console.error('获取非遗传承人失败:', error);
    } finally {
        inheritorLoading.value = false;
    }
};

// 获取网上展厅
const fetchExhibitions = async () => {
    try {
        exhibitionLoading.value = true;
        // 临时使用硬编码 WSZT_CLASSID 进行测试
        const response = await api.project.getProjectList(WSZT_CLASSID);

        if (response.code === 1200 && response.data && response.data.records) {
            // 只取前4个展示在首页
            exhibitions.value = (response.data.records as any).slice(0, 4);
        }
    } catch (error) {
        console.error('获取网上展厅失败:', error);
    } finally {
        exhibitionLoading.value = false;
    }
};

// 获取非遗动态
const fetchNews = async () => {
    try {
        newsLoading.value = true;
        const response = await api.news.getNewsPage(1, '');
        if (response.code === 1200 && response.data) {
            newsList.value = (response.data || []).slice(0, 4);
        }
    } catch (error) {
        console.error('获取非遗动态失败:', error);
    } finally {
        newsLoading.value = false;
    }
};

const handleNewsDetail = (item: any) => {
    router.push({ path: '/news-detail', query: { aid: String(item.id || ''), title: item.title || '' } });
};

const formatImg = (p?: string) => {
    return imageDealWith(p || '');
};
const formatNewsDate = (ts?: number) => {
    if (!ts) return '';
    const d = new Date(ts);
    if (isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
};

// 页面加载时获取数据
onMounted(() => {
    fetchBanners();
    fetchNavModules();
    fetchProjects(); // 临时使用硬编码 classid 请求首页预览
    fetchInheritors();
    fetchExhibitions();
    fetchNews();
});
</script>

<style scoped lang="scss">
// 变量：提取设计图的主要配色
$bg-color: #FCF9F2; // 整体米色背景
$text-dark: #4A2E16; // 深褐色标题
$text-light: #8B7E75; // 浅褐色副标题
$primary-color: #8B4513; // 主题色

.home-container {
    background-color: #FFFAF0;
    min-height: 100vh;
    padding-bottom: 20px;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

// 1. 轮播图
.banner-wrapper {
    width: 100%;
    height: 180px;
    position: relative;
    // background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

    // Loading 状态
    .banner-loading {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    // 空状态
    .banner-empty {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f5f5;
    }

    // 让 van-swipe 填满容器
    .my-swipe {
        width: 100%;
        height: 100%;
    }

    .banner-img {
        width: 100%;
        height: 100%;
        object-fit: fill;
    }

    // 自定义数字指示器（右下角，避开被覆盖区域）
    .custom-indicator {
        position: absolute;
        right: 10px;
        bottom: 30px; // 从 10px 改为 30px，避开被覆盖的 20px 区域

        // 容器样式
        width: 30px;
        height: 15px;
        background: rgba(0, 0, 0, 0.898);
        border-radius: 20px;
        opacity: 0.5;

        // 文字样式
        font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;
        font-weight: 300;
        font-size: 12px;
        color: #FFFFFF;
        line-height: 15px; // 与容器高度一致，实现垂直居中
        text-align: center;

        // 确保文字清晰显示
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

// 内容卡片（从金刚区开始到底部）
.content-card {
    background: #FFFAF0; // 和整体背景一样的颜色
    border-radius: 10px 10px 0px 0px;
    margin-top: -20px; // 向上覆盖 banner，让圆角可见
    position: relative;
    z-index: 10; // 确保在 banner 上方
}

// 2. 金刚区导航
.nav-section {
    display: flex;
    justify-content: space-around;
    padding: 20px 10px;
    background: transparent;
    min-height: 90px;

    // 加载状态
    .nav-loading {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    // 空状态
    .nav-empty {
        width: 100%;
        text-align: center;
        color: #999;
        font-size: 14px;
    }

    .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;

        .icon-box {
            width: 50px;
            height: 50px;
            background: transparent; // 改为透明，原为 #fff
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            // box-shadow: 0 4px 8px rgba(139, 69, 19, 0.1); // 去掉阴影
            margin-bottom: 8px;
            overflow: hidden;

            .nav-icon {
                width: 100%;
                height: 100%;
                object-fit: contain; // 保持图片比例
                // padding: 8px; // 去掉内边距，让图片更大
            }
        }

        .nav-name {
            // 蓝湖样式
            font-family: $font-family-serif; // 使用变量
            font-weight: 500;
            font-size: 13px;
            color: #6C2701;
            line-height: 19px;
            text-align: center;
            font-style: normal;
            text-transform: none;

            margin-top: 4px; // 增加一点上间距
        }

        // 点击效果
        &:active {
            opacity: 0.7;
        }
    }
}

// 通用 Section 样式
.section {
    padding: 0 16px;
    margin-bottom: 24px;

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .title {
            // 蓝湖样式
            font-family: $font-family-serif;
            font-weight: 700;
            font-size: 16px;
            color: #6C2701;
            line-height: 23px;
            text-align: center;
            font-style: normal;
            text-transform: none;

            position: relative;
            padding-left: 0;
        }

        .more {
            // 蓝湖样式
            font-family: $font-family-serif;
            font-weight: 400;
            font-size: 12px;
            color: #6C2701;
            line-height: 17px;
            text-align: center;
            font-style: normal;
            text-transform: none;

            display: flex;
            align-items: center;
            gap: 0px; // 文字和箭头之间的间距

            .van-icon {
                font-size: 10px; // 缩小箭头
                transform: translateY(1px); // 稍微往下移一点
            }
        }
    }
}

// 3. 非遗项目 (四格卡片)
.project-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr); // 改为 4 列，或根据需要调整
    gap: 10px;

    .project-card {
        height: 100px;
        width: 80px;
        border-radius: 2px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start; // 改为顶部对齐
        padding-top: 15px; // 顶部留出间距
        color: #fff;
        position: relative;
        overflow: hidden;
        background: #f0f0f0;

        .card-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 1;
            filter: brightness(0.8);
        }

        .card-text {
            // 蓝湖样式
            font-family: $font-family-serif;
            font-weight: 700;
            font-size: 16px;
            color: #FFFFFF;
            line-height: 23px;
            text-align: center;
            font-style: normal;
            text-transform: none;

            z-index: 2;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);

            // 强制一行两个字 (32px 正好是 2个16px字符宽)
            width: 2.2em; // 稍微给多一点点余量防止换行bug，或者用 34px
            word-break: break-all;
            white-space: pre-wrap;
        }
    }
}

.loading-box {
    display: flex;
    justify-content: center;
    padding: 20px 0;
}

// 4. 传承人 (横向滚动)
.scroll-container {
    display: flex;
    overflow-x: auto;
    gap: 12px;
    padding-bottom: 5px;

    // 隐藏滚动条
    &::-webkit-scrollbar {
        display: none;
    }

    .inheritor-card {
        flex: 0 0 240px; // 卡片固定宽度
        height: 140px;
        border-radius: 10px;
        overflow: hidden;
        position: relative;

        .inheritor-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
            padding: 10px;
            color: #fff;
            font-size: 14px;
            text-align: center;
        }
    }
}

// 5. 网上展厅 (2x2)
.exhibition-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;

    .exhibit-card {
        width: 100%; // 占满网格单元
        height: 80px; // 保持高度，或者根据需要调整
        background: transparent; // 没有背景框
        border: none; // 没有边框
        border-radius: 10px; // 假设圆角是 10px，如果是 100px 请改为 100px
        display: flex;
        align-items: center;
        justify-content: flex-start; // 左对齐
        position: relative;
        overflow: hidden;

        .exhibit-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 1;
            border-radius: 10px; // 图片圆角
        }

        .exhibit-name {
            position: relative;
            z-index: 2;
            margin-left: 10px; // 靠左 10px

            // 蓝湖样式
            // width: 40px; // 限制宽度会导致换行，建议去掉或 auto
            font-family: "Source Han Serif CN", "Songti SC", serif;
            font-weight: 500;
            font-size: 18px;
            color: #6C2701;
            line-height: 26px;
            text-align: left;
            font-style: normal;
            text-transform: none;
        }
    }
}

// 6. 非遗动态 (瀑布流/Grid)
.news-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;

    .news-card {
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        display: flex;
        flex-direction: column; // 保证卡片内容垂直排列
        height: 100%; // 确保卡片占满网格高度

        .news-img-box {
            width: 100%;
            height: 120px;
            flex-shrink: 0; // 防止图片被压缩

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        .news-info {
            padding: 10px;
            flex: 1; // 占满剩余空间
            display: flex;
            flex-direction: column;
            justify-content: space-between; // 上下分开，标题在上，日期在下

            .news-title {
                margin: 0; // 去掉 margin-bottom，靠 flex 布局控制间距
                line-height: 1.4;
                font-weight: bold;
                width: 151px;
                font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
                font-weight: 500;
                font-size: 14px;
                color: #3D3D3D;
                line-height: 20px;
                text-align: left;
                font-style: normal;
                text-transform: none;
            }

            .news-date {
                font-size: 12px;
                color: #999;
                display: flex;
                align-items: center;
                gap: 4px;
                margin-top: 8px; // 保证标题很长时，和日期也有最小间距
            }
        }
    }
}
</style>
