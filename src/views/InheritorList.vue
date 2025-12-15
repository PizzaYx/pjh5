<template>
    <div class="intangible-heritage-container">
        <!-- 顶部导航栏 -->
        <van-nav-bar title="非遗传承人" fixed placeholder :border="false" @click-left="onClickLeft">
            <template #left>
                <van-icon name="arrow-left" class="back-icon" />
            </template>
        </van-nav-bar>

        <!-- 筛选区域 -->
        <div class="filter-section">
            <div v-for="item in categories" :key="item.id" class="filter-item"
                :class="{ active: currentCategory === item.id }" @click="handleCategoryChange(item.id)">
                <img :src="currentCategory === item.id ? chooseImg : noChooseImg" class="bg-img" />
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
            <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false"
                @load="onLoad">
                <div class="project-list">
                    <div class="project-card" v-for="item in list" :key="item.id" @click="handleDetail(item)">
                        <div class="img-box">
                            <img :src="formatImg(item.image)" loading="lazy" />
                        </div>
                        <div class="info-box">
                            <div class="title van-ellipsis">{{ item.name }}</div>
                            <div class="tag-row">
                                <span class="tag">{{ item.level }}</span>
                            </div>
                            <div class="address-row">
                                <img :src="localIcon" class="addr-icon" />
                                <span class="address">{{ item.region }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import api from '@/api/index';
import { imageDealWith } from '@/utils/image';
import { InheritorItem } from '@/models';
import localIcon from '@/assets/img/local.png';
import chooseImg from '@/assets/img/choose.png';
import noChooseImg from '@/assets/img/noChoose.png';
type CategoryItem = { id: string; name: string; count: number };

const router = useRouter();

const list = ref<InheritorItem[]>([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const fromRefresh = ref(false);
const pageNum = ref(1);
const searchValue = ref('');
const currentCategory = ref('all');
const categories = ref<CategoryItem[]>([
    { id: 'all', name: '全部', count: 0 },
    { id: 'national', name: '国家级', count: 0 },
    { id: 'provincial', name: '省级', count: 0 },
    { id: 'city', name: '市级', count: 0 },
    { id: 'district', name: '区县级', count: 0 },
]);
const currentLevelName = computed(() => {
    const hit = categories.value.find((c) => c.id === currentCategory.value);
    return hit ? hit.name : '全部';
});

const onClickLeft = () => router.back();

const handleCategoryChange = (id: string) => {
    currentCategory.value = id;
    showToast(`切换分类: ${id}`);
    onRefresh();
};

const onLoad = async () => {
    try {
        if (fromRefresh.value && !refreshing.value && pageNum.value > 1) {
            loading.value = false;
            fromRefresh.value = false;
            return;
        }
        if (refreshing.value) {
            list.value = [];
            refreshing.value = false;
            pageNum.value = 1;
        }

        const lvl = currentLevelName.value === '全部' ? '' : currentLevelName.value;
        const response = await api.inheritor.getInheritorPage(pageNum.value, lvl, searchValue.value);
        if (response.code === 1200 && Array.isArray(response.data)) {
            const newData = response.data || [];
            list.value.push(...newData);
            pageNum.value++;
            if (newData.length === 0) finished.value = true;
        } else {
            finished.value = true;
        }
    } catch (error) {
        console.error('获取传承人列表失败:', error);
        finished.value = true;
    } finally {
        loading.value = false;
    }
};

const onRefresh = () => {
    finished.value = false;
    loading.value = true;
    refreshing.value = true;
    fromRefresh.value = true;
    onLoad();
};

const handleDetail = (item: any) => {
    const id = String((item as InheritorItem).id || '');
    if (!id) return;
    router.push({ path: '/inheritor-detail', query: { id } });
};

const formatImg = (p?: string) => imageDealWith(p || '');

const onSearch = (val: string) => {
    showToast(`搜索: ${val}`);
    onRefresh();
};

const fetchCategoryCounts = async () => {
    try {
        const r = await api.inheritor.getInheritorTypeNum();
        if (r.code === 1200 && Array.isArray(r.data)) {
            const typeMap: Record<string, string> = {
                '国家级': 'national',
                '省级': 'provincial',
                '市级': 'city',
                '区县级': 'district',
            };
            const counts: Record<string, number> = {};
            for (const it of r.data) {
                const key = typeMap[String(it.type)];
                if (key) counts[key] = Number(it.num || 0);
            }
            const total = ['national', 'provincial', 'city', 'district'].reduce((sum, k) => sum + Number(counts[k] || 0), 0);
            categories.value = categories.value.map((it) => {
                if (it.id === 'all') return { ...it, count: total };
                return { ...it, count: Number(counts[it.id] || 0) };
            });
        }
    } catch (e) {
        console.error('获取分类数量失败:', e);
    }
};

onMounted(() => {
    fetchCategoryCounts();
    onRefresh();
});
</script>

<style scoped lang="scss">
@use '@/styles/list-page-common.scss' as common;
@use '@/styles/variables.scss' as *;


.intangible-heritage-container {
    @include common.list-page-container;
}

// 使用蓝湖样式的导航栏
@include common.navbar-title-lanhu;

// 返回按钮
@include common.back-icon;

:deep(.custom-search) {
    background: #FFFFFF !important;
    height: 32px;
    padding: 0 0;
    margin: 0 12px;
    text-align: left;

    .van-search__content {
        background: #FFFFFF;
        border-radius: 8px;

        .van-field__control {
            background: #FFFFFF;
            text-align: left;
        }
    }
}

.filter-section {
    display: flex;
    justify-content: space-between;
    padding: 16px 12px;
    margin-top: 10px;
    overflow-x: auto;
    gap: 8px;

    &::-webkit-scrollbar {
        display: none;
    }

    .filter-item {
        position: relative;
        width: 52px;
        height: 52px;
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

            .count {
                font-family: "Source Han Serif CN", serif;
                font-weight: bold;
                font-size: 16px;
                color: #6C2701;
                line-height: 1.2;
            }

            .label {
                font-size: 12px;
                color: #6C2701;
                margin-top: 2px;
            }
        }

        &.active {

            .count,
            .label {
                color: #FFFFFF;
            }
        }
    }
}

:deep(.custom-search) {
    background: #FFFFFF !important;
    height: 32px;
    padding: 0 0;
    margin: 0 12px;
    text-align: left;

    .van-search__content {
        background: #FFFFFF;
        border-radius: 8px;

        .van-field__control {
            background: #FFFFFF;
            text-align: left;
        }
    }
}

.project-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 0 12px 20px;
    margin-top: 10px;

    .project-card {
        width: 171px;
        height: 185px;
        background: #FFFFFF;
        box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-self: center;

        .img-box {
            width: calc(100% - 20px);
            height: 86px;
            margin: 10px 10px 0 10px;
            background: #f5f5f5;
            border-radius: 4px;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        .info-box {
            padding: 8px 8px 12px;
            flex: 1;
            display: flex;
            flex-direction: column;

            .title {
                width: 141px;
                height: 19px;
                font-family: $font-family-serif;
                font-weight: 500;
                font-size: 14px;
                color: #3D3D3D;
                margin-bottom: 6px;
                line-height: 20px;
                text-align: left;
                font-style: normal;
                text-transform: none;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }

            .tag-row {
                margin-top: 5px;
                margin-bottom: 5px;
                display: flex;
                gap: 6px;

                .tag {
                    display: inline-flex;
                    align-items: center;
                    justify-content: flex-start;
                    height: 15px;
                    background: #D5A85A;
                    border-radius: 2px;
                    font-family: $font-family-serif;
                    font-weight: 400;
                    font-size: 10px;
                    color: #FFFFFF;
                    line-height: 14px;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                    padding: 2px 6px;
                    white-space: nowrap;
                }
            }

            .address-row {
                display: flex;
                align-items: center;
                margin-top: auto;

                .addr-icon {
                    width: 12px;
                    height: 12px;
                    margin-right: 2px;
                    display: inline-block;
                }

                .address {
                    width: 36px;
                    height: 17px;
                    font-family: $font-family-serif;
                    font-weight: 500;
                    font-size: 12px;
                    color: rgba(61, 61, 61, 0.5);
                    line-height: 17px;
                    text-align: left;
                    font-style: normal;
                    text-transform: none;
                }
            }
        }
    }
}
</style>
