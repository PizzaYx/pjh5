<template>
    <div class="exhibition-list-container">
        <!-- 顶部导航栏 -->
        <van-nav-bar title="非遗传承人" fixed placeholder :border="false" @click-left="onClickLeft">
            <template #left>
                <van-icon name="arrow-left" class="back-icon" />
            </template>
        </van-nav-bar>

        <!-- 列表 -->
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list v-model:loading="loading" :finished="finished" finished-text="" @load="onLoad">
                <div class="inheritor-grid">
                    <div class="inheritor-item" v-for="item in list" :key="item.id" @click="handleDetail(item)">
                        <div class="img-box">
                            <img :src="item.img" :alt="item.title" loading="lazy" />
                        </div>
                        <div class="info">
                            <h3 class="title">{{ item.title }}</h3>
                        </div>
                    </div>
                </div>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import api, { type InheritorItem } from '@/api/index';

const router = useRouter();

const list = ref<InheritorItem[]>([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const pageNum = ref(1);
const pageSize = 20;

const onClickLeft = () => router.back();

const onLoad = async () => {
    try {
        if (refreshing.value) {
            list.value = [];
            refreshing.value = false;
            pageNum.value = 1;
        }

        const response = await api.inheritor.getInheritorList(pageNum.value, pageSize);

        if (response.code === 200 && response.data) {
            const newData = response.data.list;
            list.value.push(...newData);
            pageNum.value++;
            if (newData.length < pageSize) finished.value = true;
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
    onLoad();
};

const handleDetail = (item: InheritorItem) => {
    showToast(`查看详情: ${item.title}`);
};
</script>

<style scoped lang="scss">
@use '@/styles/list-page-common.scss' as common;


.exhibition-list-container {
    @include common.list-page-container;
}

// 使用蓝湖样式的导航栏
@include common.navbar-title-lanhu;

// 返回按钮
@include common.back-icon;

.inheritor-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 12px;

    .inheritor-item {
        background: #fff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

        .img-box {
            width: 100%;
            height: 0;
            padding-bottom: 100%; // 1:1 比例
            position: relative;

            img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        .info {
            padding: 10px;
            text-align: center;

            .title {
                font-size: 15px;
                color: #333;
                margin: 0;
                font-weight: bold;
            }
        }
    }
}
</style>
