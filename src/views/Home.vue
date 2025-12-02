<template>
    <div class="home-container">

        <!-- 1. 顶部轮播图 -->
        <div class="banner-wrapper">
            <van-swipe class="my-swipe" :autoplay="3000" :show-indicators="false" @change="onBannerChange">
                <van-swipe-item v-for="item in banners" :key="item.id">
                    <img :src="item.img" alt="banner" class="banner-img" />
                </van-swipe-item>
            </van-swipe>

            <!-- 自定义数字指示器 -->
            <div class="custom-indicator">
                {{ bannerIndicatorText }}
            </div>
        </div>

        <!-- 内容区域（白色卡片，从金刚区开始） -->
        <div class="content-card">
            <!-- 2. 金刚区导航 -->
            <div class="nav-section">
                <div class="nav-item" v-for="item in menus" :key="item.id" @click="handleDetail(item.id)">
                    <!-- 实际项目中把 van-icon 换成 <img :src="item.icon" /> -->
                    <div class="icon-box">
                        <van-icon :name="item.icon" size="28" color="#8B4513" />
                    </div>
                    <span class="nav-name">{{ item.name }}</span>
                </div>
            </div>

            <!-- 3. 非遗项目 -->
            <div class="section">
                <div class="section-header">
                    <h3 class="title">非遗项目</h3>
                    <span class="more" @click="handleMore('非遗项目')">全部 <van-icon name="arrow" /></span>
                </div>
                <div class="project-grid">
                    <div class="project-card" v-for="item in projects" :key="item.id"
                        :style="{ backgroundColor: item.color }">
                        <span class="card-text">{{ item.name }}</span>
                        <!-- 装饰图标 -->
                        <van-icon :name="item.img" class="card-icon" />
                    </div>
                </div>
            </div>

            <!-- 4. 非遗传承人 (横向滚动) -->
            <div class="section">
                <div class="section-header">
                    <h3 class="title">非遗传承人</h3>
                    <span class="more" @click="handleMore('传承人')">全部 <van-icon name="arrow" /></span>
                </div>
                <div class="scroll-container">
                    <div class="inheritor-card" v-for="item in inheritors" :key="item.id">
                        <img :src="item.img" class="inheritor-img" />
                        <div class="overlay">
                            <span>{{ item.title }} {{ item.name }}</span>
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
                <div class="exhibition-grid">
                    <div class="exhibit-card" v-for="item in exhibitions" :key="item.id">
                        <span class="exhibit-name">{{ item.name }}</span>
                        <van-icon :name="item.img" size="40" color="#8B4513" style="opacity: 0.6;" />
                    </div>
                </div>
            </div>

            <!-- 6. 非遗动态 (双列) -->
            <div class="section">
                <div class="section-header">
                    <h3 class="title">非遗动态</h3>
                    <span class="more" @click="handleMore('非遗动态')">全部 <van-icon name="arrow" /></span>
                </div>
                <div class="news-list">
                    <div class="news-card" v-for="item in newsList" :key="item.id">
                        <div class="news-img-box">
                            <img :src="item.img" />
                        </div>
                        <div class="news-info">
                            <p class="news-title van-multi-ellipsis--l2">{{ item.title }}</p>
                            <p class="news-date">
                                <van-icon name="calendar-o" /> {{ item.date }}
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
import { ref, computed } from 'vue';
import { showToast } from 'vant';

// --- 类型定义 (TypeScript) ---
interface BannerItem { id: number; img: string; title: string; }
interface MenuItem { id: number; name: string; icon: string; }
interface ProjectItem { id: number; name: string; img: string; color: string; }
interface InheritorItem { id: number; name: string; title: string; img: string; }
interface ExhibitionItem { id: number; name: string; img: string; type: string; }
interface NewsItem { id: number; title: string; date: string; img: string; }

// --- 模拟数据 (Mock Data) ---

// 1. 顶部轮播图数据
const banners: BannerItem[] = [
    { id: 1, img: 'https://bpic.51yuansu.com/backgd/cover/00/09/67/5b7228b61c32c.jpg?x-oss-process=image/resize,h_300,m_lfit/sharpen,100', title: '非遗文化节' },
    { id: 2, img: 'https://pic.rmb.bdstatic.com/bjh/news/a8365fc6d4f3e633053df2022b010f42.png', title: '博大精深' },
];

// 2. 金刚区导航图标 (建议换成你切好的 SVG 或 PNG)
const menus: MenuItem[] = [
    { id: 1, name: '非遗项目', icon: 'gem-o' }, // 暂时用 Vant 图标代替，实际请用 <img src="...">
    { id: 2, name: '非遗传承人', icon: 'user-o' },
    { id: 3, name: '网上展厅', icon: 'tv-o' },
    { id: 4, name: '非遗动态', icon: 'newspaper-o' },
];

// 3. 非遗项目 (四色卡片)
const projects: ProjectItem[] = [
    { id: 1, name: '曲艺', img: 'music', color: '#8E6E73' },     // 紫色调
    { id: 2, name: '传统体育', img: 'fire', color: '#C5A97D' },  // 金色调
    { id: 3, name: '传统美术', img: 'brush', color: '#BC786D' }, // 红色调
    { id: 4, name: '传统技艺', img: 'star', color: '#9DA268' },  // 绿色调
];

// 4. 传承人 (横向滚动)
const inheritors: InheritorItem[] = [
    { id: 1, name: '张三', title: '木雕传承人', img: 'https://via.placeholder.com/300x200/333/fff?text=木雕' },
    { id: 2, name: '李四', title: '竹编传承人', img: 'https://via.placeholder.com/300x200/444/fff?text=竹编' },
    { id: 3, name: '王五', title: '剪纸传承人', img: 'https://via.placeholder.com/300x200/555/fff?text=剪纸' },
];

// 5. 网上展厅 (2x2)
const exhibitions: ExhibitionItem[] = [
    { id: 1, name: '相册', type: 'album', img: 'photo-o' },
    { id: 2, name: '视频', type: 'video', img: 'play-circle-o' },
    { id: 3, name: '音乐', type: 'music', img: 'music-o' },
    { id: 4, name: '展览', type: 'exhibit', img: 'hotel-o' },
];

// 6. 非遗动态 (瀑布流)
const newsList: NewsItem[] = [
    { id: 1, title: '第六批省级非物质文化遗产...', date: '2025.11.20', img: 'https://via.placeholder.com/300x200/cba/fff' },
    { id: 2, title: '吹糖人技艺展示...', date: '2025.11.20', img: 'https://via.placeholder.com/300x200/abc/fff' },
    { id: 3, title: '川剧变脸艺术...', date: '2025.11.20', img: 'https://via.placeholder.com/300x200/f00/fff' },
    { id: 4, title: '竹编工艺流程...', date: '2025.11.20', img: 'https://via.placeholder.com/300x200/0f0/fff' },
];

// 轮播图当前索引
const currentBanner = ref(0);

// 计算当前页码显示文本
const bannerIndicatorText = computed(() => {
    return `${currentBanner.value + 1}/${banners.length}`;
});

// 轮播图切换事件
const onBannerChange = (index: number) => {
    currentBanner.value = index;
};

// 点击事件
const handleMore = (section: string) => showToast(`查看更多: ${section}`);
const handleDetail = (id: number) => showToast(`查看详情 ID: ${id}`);
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
    height: 180px; // 增加高度，避免被覆盖后显示区域太小
    position: relative;

    // 让 van-swipe 填满容器
    .my-swipe {
        width: 100%;
        height: 100%;
    }

    .banner-img {
        width: 100%;
        height: 100%;
        object-fit: fill; // 强制拉伸填充满容器
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

    .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;

        .icon-box {
            width: 50px;
            height: 50px;
            background: #fff; // 假设有白色背景
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 8px rgba(139, 69, 19, 0.1);
            margin-bottom: 8px;
        }

        .nav-name {
            font-size: 13px;
            color: $text-dark;
            font-weight: 500;
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
            font-size: 18px;
            color: $text-dark;
            font-weight: bold;
            position: relative;
            padding-left: 0;
            // 类似设计图的衬线字体感
            font-family: serif;
        }

        .more {
            font-size: 12px;
            color: $text-light;
            display: flex;
            align-items: center;
        }
    }
}

// 3. 非遗项目 (四格卡片)
.project-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;

    .project-card {
        height: 80px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #fff;
        position: relative;
        overflow: hidden;

        .card-text {
            font-size: 14px;
            font-weight: bold;
            z-index: 2;
            // 竖排文字 (如果需要像原图左1那样)
            // writing-mode: vertical-lr; 
        }

        .card-icon {
            position: absolute;
            bottom: -5px;
            right: -5px;
            font-size: 40px;
            opacity: 0.3;
            transform: rotate(-15deg);
        }
    }
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
        height: 80px;
        background: linear-gradient(135deg, #fdfbf7 0%, #f3efe6 100%);
        border: 1px solid #eaddcf;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;

        .exhibit-name {
            font-size: 16px;
            color: #8B4513;
            font-weight: bold;
            font-family: serif;
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

        .news-img-box {
            width: 100%;
            height: 120px;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        .news-info {
            padding: 10px;

            .news-title {
                font-size: 14px;
                color: #333;
                margin-bottom: 8px;
                line-height: 1.4;
                font-weight: bold;
            }

            .news-date {
                font-size: 12px;
                color: #999;
                display: flex;
                align-items: center;
                gap: 4px;
            }
        }
    }
}
</style>