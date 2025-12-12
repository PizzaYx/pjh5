<template>
    <div class="intangible-heritage-container">
        <!-- 顶部导航栏 -->
        <van-nav-bar title="非遗项目2" fixed placeholder :border="false" @click-left="onClickLeft">
            <template #left>
                <van-icon name="arrow-left" class="back-icon" />
            </template>
        </van-nav-bar>

        <!-- 筛选区域 -->
        <div class="filter-section">
            <div v-for="item in categories" :key="item.id" class="filter-item"
                :class="{ active: currentCategory === item.id }" @click="handleCategoryChange(item.id)">
                <!-- 背景图 -->
                <img :src="currentCategory === item.id ? chooseImg : noChooseImg" class="bg-img" />

                <!-- 内容：数字和文本 -->
                <div class="content">
                    <span class="count">{{ item.count }}</span>
                    <span class="label">{{ item.name }}</span>
                </div>
            </div>
        </div>

        <!-- 搜索框 -->
        <van-search v-model="searchValue" placeholder="请输入搜索关键词" shape="round" background="transparent"
            class="custom-search" @search="onSearch" />

        <!-- 列表 -->
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                <div class="project-list">
                    <div class="project-card" v-for="item in list" :key="item.id" @click="handleDetail(item)">
                        <div class="img-box">
                            <img :src="item.img2" loading="lazy" />
                        </div>
                        <div class="info-box">
                            <div class="title van-ellipsis">{{ item.title }}</div>
                            <div class="tag-row">
                                <span class="tag">{{ item.level || '国家级' }}</span>
                            </div>
                            <div class="address-row">
                                <van-icon name="location-o" />
                                <span class="address">{{ item.address || '山东省' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { showToast } from 'vant';
import api from '@/api/index';

// 导入图片资源
import chooseImg from '@/assets/img/choose.png';
import noChooseImg from '@/assets/img/noChoose.png';

const router = useRouter();

// 列表项类型（根据接口返回进行映射）
interface ProjectCardItem {
    id: string | number
    img2: string
    title: string
    level?: string
    address?: string
}

// 状态
const searchValue = ref('');
const list = ref<ProjectCardItem[]>([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const pageNum = ref(1);
const route = useRoute();
const classid = Number(route.query.id) || 0;
const currentCategory = ref('all');

// 分类数据
const categories = [
    { id: 'all', name: '全部', count: 156 },
    { id: 'national', name: '国家级', count: 42 },
    { id: 'provincial', name: '省级', count: 35 },
    { id: 'city', name: '市级', count: 28 },
    { id: 'district', name: '区县级', count: 51 },
];

const onClickLeft = () => router.back();

const handleCategoryChange = (id: string) => {
    currentCategory.value = id;
    showToast(`切换分类: ${id}`);
    onRefresh();
};

const onSearch = (val: string) => {
    showToast(`搜索: ${val}`);
    onRefresh();
};

const onLoad = async () => {
    try {
        if (refreshing.value) {
            list.value = [];
            refreshing.value = false;
            pageNum.value = 1;
        }

        const response = await api.project.getProjectList(classid);

        if ((response.code === 1200 || response.code === 0) && response.data && response.data.records) {
            const newData: ProjectCardItem[] = (response.data.records as any[]).map((item: any) => ({
                id: item.classid,
                img2: item.imgmax || item.imgmin || '',
                title: item.name || '',
                level: ['国家级', '省级', '市级'][Math.floor(Math.random() * 3)],
                address: ['济南市历下区', '青岛市市南区', '淄博市张店区'][Math.floor(Math.random() * 3)],
            }));

            list.value.push(...newData);
            pageNum.value++;
            finished.value = true;
        } else {
            finished.value = true;
        }
    } catch (error) {
        console.error('获取列表失败:', error);
        finished.value = true;
    } finally {
        loading.value = false;
    }
};

const onRefresh = () => {
    finished.value = false;
    loading.value = true;
    onLoad();
};

const handleDetail = (item: ProjectCardItem) => {
    showToast(`查看详情: ${item.title}`);
};
</script>

<style scoped lang="scss">
@use '@/styles/list-page-common.scss' as common;

.intangible-heritage-container {
    @include common.list-page-container;
}

// 导航栏样式
@include common.navbar-title-lanhu;
@include common.back-icon;

// 筛选区域样式
.filter-section {
    display: flex;
    justify-content: space-between; // 两端对齐，或者使用 flex-start 加 gap
    padding: 0 12px;
    margin-top: 10px;
    overflow-x: auto; // 如果放不下，允许横向滚动
    gap: 8px; // 间距

    // 隐藏滚动条
    &::-webkit-scrollbar {
        display: none;
    }

    .filter-item {
        position: relative;
        width: 68px; // 根据图片尺寸调整
        height: 68px; // 根据图片尺寸调整
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;

        .bg-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
            z-index: 1;
        }

        .content {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .count {
                font-family: "Source Han Serif CN", serif;
                font-weight: bold;
                font-size: 16px;
                color: #6C2701; // 棕红色
                line-height: 1.2;
            }

            .label {
                font-size: 12px;
                color: #6C2701;
                margin-top: 2px;
            }
        }

        // 选中状态下的文字颜色（如果需要不同颜色可以单独设置）
        &.active {

            .count,
            .label {
                color: #FFFFFF; // 选中后文字变白
            }
        }
    }
}

// 搜索框样式
:deep(.custom-search) {
    background: transparent !important;
    padding: 0;
    margin: 15px 12px;
    height: 36px;

    .van-search__content {
        background: #FFFFFF;
        border-radius: 18px;
        padding-left: 10px;

        .van-field__control {
            background: #FFFFFF;
            text-align: left;
        }
    }
}

// 列表样式
.project-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr); // 两列
    gap: 10px;
    padding: 0 12px 20px;

    .project-card {
        background: #FFFFFF;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        display: flex;
        flex-direction: column;

        .img-box {
            width: 100%;
            height: 0;
            padding-bottom: 75%; // 4:3 比例
            position: relative;
            background: #f5f5f5;

            img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        .info-box {
            padding: 8px;

            .title {
                font-size: 14px;
                font-weight: bold;
                color: #333;
                margin-bottom: 6px;
                line-height: 1.4;
            }

            .tag-row {
                margin-bottom: 6px;

                .tag {
                    display: inline-block;
                    font-size: 10px;
                    color: #6C2701;
                    background: rgba(108, 39, 1, 0.1);
                    padding: 2px 6px;
                    border-radius: 4px;
                }
            }

            .address-row {
                display: flex;
                align-items: center;
                color: #999;
                font-size: 11px;

                .van-icon {
                    margin-right: 2px;
                }
            }
        }
    }
}
</style>
