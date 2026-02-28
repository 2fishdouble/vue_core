<script setup lang="ts">
import { Tree, UploadDragger } from "ant-design-vue";
import type { TreeProps } from "ant-design-vue";
import { ref } from "vue";
import { InboxOutlined } from "@ant-design/icons-vue";
import { Modal, Progress } from "ant-design-vue";

import {
  customUploadRequest,
  fileList,
  uploadFileControlMap,
  handleCancel,
  handleChange,
  handleDrop,
  handlePreview,
  previewImage,
  previewTitle,
  previewVisible,
  progress,
  togglePause,
  toggleResume,
} from "@/views/Cat.ts";

import { Drawer } from "ant-design-vue";

const drawerVisible = ref(false);
const selectedNode = ref<any>(null);

const handleSelect: TreeProps["onSelect"] = (info: any) => {
  if (info.selected) {
    selectedNode.value = info.node; // 获取选中节点数据
    drawerVisible.value = true;
  }
};

const closeDrawer = () => {
  drawerVisible.value = false;
  selectedNode.value = null;
};

const treeData = ref([
  {
    title: "猫科动物",
    key: "0",
    children: [
      {
        title: "家猫",
        key: "0-0",
        children: [
          { title: "橘猫", key: "0-0-0" },
          { title: "狸花猫", key: "0-0-1" },
          { title: "奶牛猫", key: "0-0-2" },
        ],
      },
      {
        title: "野猫",
        key: "0-1",
        children: [
          { title: "豹猫", key: "0-1-0" },
          { title: "狞猫", key: "0-1-1" },
        ],
      },
      {
        title: "大型猫科",
        key: "0-2",
        children: [
          { title: "狮子", key: "0-2-0" },
          { title: "老虎", key: "0-2-1" },
          { title: "豹子", key: "0-2-2" },
        ],
      },
    ],
  },
]);

// 工具函数：根据 key 查找节点并移除
function findAndRemoveNode(
  data: any[],
  key: string,
): { node: any; rest: any[] } {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    if (node.key === key) {
      const copy = [...data];
      copy.splice(i, 1);
      return { node, rest: copy };
    }
    if (node.children) {
      const result = findAndRemoveNode(node.children, key);
      if (result.node) {
        node.children = result.rest;
        return { node: result.node, rest: data };
      }
    }
  }
  return { node: null, rest: data };
}

// 工具函数：根据 key 查找插入点
function insertNode(data: any[], key: string, node: any, dropPosition: number) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].key === key) {
      const parent = data;
      const index = dropPosition >= 0 ? i + 1 : i;
      parent.splice(index, 0, node);
      return true;
    }
    if (data[i].children) {
      const inserted = insertNode(data[i].children, key, node, dropPosition);
      if (inserted) return true;
    }
  }
  return false;
}

const onDrop: TreeProps["onDrop"] = (info) => {
  const dropPos = info.dropPosition;

  const { node, rest } = findAndRemoveNode(
    treeData.value,
    info.dragNode.key as string,
  );
  if (!node) return;

  if (info.dropToGap) {
    insertNode(rest, info.node.key as string, node, dropPos);
  } else {
    const parentNode = findNodeByKey(treeData.value, info.node.key as string);
    if (!parentNode.children) parentNode.children = [];
    parentNode.children.push(node);
  }

  treeData.value = [...rest];
};

// 查找节点
function findNodeByKey(data: any[], key: string): any {
  for (const node of data) {
    if (node.key === key) return node;
    if (node.children) {
      const result = findNodeByKey(node.children, key);
      if (result) return result;
    }
  }
  return null;
}

import { type UseDraggableReturn } from "vue-draggable-plus";

const list = ref([
  {
    name: "Joao",
    id: 1,
  },
  {
    name: "Jean",
    id: 2,
  },
  {
    name: "Johanna",
    id: 3,
  },
  {
    name: "Juan",
    id: 4,
  },
]);

const el = ref<UseDraggableReturn>();
const disabled = ref(false);
</script>

<template>
  <h2 style="text-align: center" class="cat-title">🐱 Cat Tree</h2>
  <Tree
    :tree-data="treeData"
    :default-expand-all="true"
    :show-line="true"
    block-node
    checkable
    draggable
    multiple
    @drop="onDrop"
    @select="handleSelect"
  />

  <Drawer
    :title="selectedNode?.title"
    placement="right"
    :visible="drawerVisible"
    width="300"
    @close="closeDrawer"
    destroyOnClose
    keyboard
  >
    <p><strong>标题：</strong> {{ selectedNode?.title }}</p>
    <p><strong>Key：</strong> {{ selectedNode?.key }}</p>
  </Drawer>

  <UploadDragger
    v-model:fileList="fileList"
    :progress="progress"
    name="file"
    :multiple="true"
    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
    @change="handleChange"
    @drop="handleDrop"
    :customRequest="customUploadRequest"
    @preview="handlePreview"
  >
    <p class="ant-upload-drag-icon">
      <inbox-outlined></inbox-outlined>
    </p>
    <p class="ant-upload-text">Click or drag file to this area to upload</p>
    <p class="ant-upload-hint">
      Support for a single or bulk upload. Strictly prohibit from uploading
      company data or other band files
    </p>

    <template #itemRender="{ originNode, file, actions }">
      <div
        style="
          display: flex;
          flex-direction: column;
          padding: 8px;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          margin-bottom: 8px;
        "
      >
        <!-- 顶部：文件名 + 操作按钮 -->
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div
            style="
              flex: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            "
          >
            文件：{{ file.name }}
          </div>
          <div style="display: flex; gap: 8px">
            <button
              style="
                padding: 4px 12px;
                border: none;
                background-color: #1890ff;
                color: white;
                border-radius: 3px;
                cursor: pointer;
              "
              @click="
                uploadFileControlMap.get(file.uid)!.isPaused
                  ? toggleResume(file, actions, originNode)
                  : togglePause(file)
              "
              v-if="file.status !== 'done'"
            >
              {{
                uploadFileControlMap.get(file.uid)!.isPaused ? "恢复" : "暂停"
              }}
            </button>
            <button
              style="
                padding: 4px 12px;
                border: none;
                background-color: #ff4d4f;
                color: white;
                border-radius: 3px;
                cursor: pointer;
              "
              @click="
                () => {
                  actions.remove(file);
                  uploadFileControlMap.delete(file.uid);
                }
              "
            >
              删除
            </button>
          </div>
        </div>

        <!-- 下方进度条 -->
        <Progress
          :percent="file.percent"
          :stroke-color="progress?.strokeColor"
          :stroke-width="progress?.strokeWidth"
          :show-info="progress?.showInfo"
          :format="progress?.format"
          :status="
            file.status === 'error'
              ? 'exception'
              : file.status === 'done'
                ? 'success'
                : 'active'
          "
          style="margin-top: 8px"
        />
      </div>
    </template>
  </UploadDragger>

  <Modal
    v-model:open="previewVisible"
    :title="previewTitle"
    :footer="null"
    @cancel="handleCancel"
  >
    <img alt="example" style="width: 100%" :src="previewImage" />
  </Modal>

  <!-- 拖拽区域固定在页面底部 -->
  <!--    <VueDraggable-->
  <!--        ref="el"-->
  <!--        v-model="list"-->
  <!--        :disabled="disabled"-->
  <!--        :animation="150"-->
  <!--        :horizontal="true"-->
  <!--        ghostClass="ghost"-->
  <!--    >-->
  <!--      <Card-->
  <!--          v-for="item in list"-->
  <!--          :key="item.id"-->
  <!--          class="cursor-move w-40 text-center"-->
  <!--          hoverable-->
  <!--          size="small"-->
  <!--          style="border: 2px solid #1890ff;"-->
  <!--      >-->
  <!--        {{ item.name }}-->
  <!--      </Card>-->
  <!--    </VueDraggable>-->
</template>

<style scoped>
.cat-title {
  font-size: 24px;
  margin-bottom: 16px;
}
</style>
