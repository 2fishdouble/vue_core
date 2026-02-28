import {
  message,
  type UploadChangeParam,
  type UploadFile,
  type UploadProps,
} from "ant-design-vue";
import { ref } from "vue";
import { sleep } from "@/utils/Utils.ts";
import type {
  RcFile,
  UploadProgressEvent,
} from "ant-design-vue/es/vc-upload/interface";

export const MOCK_IMAGE_URL =
  "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png";

export const progress: UploadProps["progress"] = {
  strokeColor: {
    "0%": "#ff4d4f",
    "50%": "#faad14",
    "100%": "#52c41a",
  },
  strokeWidth: 4,
  showInfo: true,
  format: (percent) => `${percent?.toFixed(1)}%`,
};

export type UploadFileWithControl = UploadFile & {
  onProgress?: (event: UploadProgressEvent) => void;
  onSuccess?: (body: any, xhr: any) => void;
  resumeFn?: () => void;
  currentChunk?: number;
  uploadedSize?: number;
  isPaused?: boolean;
  timerId?: ReturnType<typeof setTimeout>;
};

export const fileList = ref<UploadFileWithControl[]>([]);
export const uploadFileControlMap = new Map<string, UploadFileControlData>();

type UploadFileControlData = {
  onProgress?: (event: UploadProgressEvent) => void;
  onSuccess?: (body: any, xhr: any) => void;
  // 暂不使用
  resumeFn?: () => void;
  currentChunk?: number;
  uploadedSize?: number;
  isPaused?: boolean;
  size?: number;
};

export const handleChange = (info: UploadChangeParam) => {
  const status = info.file.status;
  if (status === "done") {
    message.success(`${info.file.response.url} 文件上传成功。`);
    uploadFileControlMap.delete(info.file.uid);
  } else if (status === "error") {
    message.error(`${info.file.name} 文件上传失败。`);
    uploadFileControlMap.delete(info.file.uid);
  }
};

export type CustomRequestOptions = Parameters<
  Exclude<UploadProps["customRequest"], undefined>
>[0];

async function uploadSliceFile(chunk: Blob, uid: string, onProgress: any) {
  const cacheFile = uploadFileControlMap.get(uid);
  if (!cacheFile) {
    console.error(`[${uid}] uploadSliceFile: 未找到缓存文件。已经被删除`);
    throw new Error("Upload file not found.");
  }
  if (cacheFile.isPaused) {
    console.log(`[${uid}] uploadSliceFile: 检测到暂停，立即中断。`);
    throw new Error("Upload paused immediately.");
  }

  await sleep(1000);

  cacheFile.currentChunk!++;
  cacheFile.uploadedSize! += chunk.size;

  message.info(
    `正在上传第 ${cacheFile.currentChunk} 片，已上传 ${cacheFile.uploadedSize} / ${cacheFile.size}。`,
  );

  const percent = Number(
    ((cacheFile.uploadedSize! / cacheFile.size!) * 100).toFixed(2),
  );
  onProgress?.({ percent });
}

async function uploadChunk(
  file: UploadFileWithControl,
  onProgress?: any,
  onSuccess?: any,
): Promise<void> {
  const uid = file.uid;
  const CHUNK_SIZE = 1024 * 1024;
  const totalSize = file.size || 0;
  const originFile = file.originFileObj;

  const cacheFile = uploadFileControlMap.get(uid)!;

  if (cacheFile.isPaused) {
    console.log(`[${uid}] uploadChunk: 检测到暂停，不启动。`);
    return;
  }

  try {
    while (cacheFile.uploadedSize! < totalSize) {
      // 循环内部检查暂停状态
      if (cacheFile.isPaused) {
        console.log(`[${uid}] uploadChunk: 循环内部检测到暂停，跳出循环。`);
        break;
      }

      const start = cacheFile.currentChunk! * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, totalSize);
      const chunk = originFile?.slice(start, end);

      try {
        await uploadSliceFile(chunk as Blob, uid, onProgress);
      } catch (e) {
        break;
      }

      if (cacheFile.uploadedSize! >= totalSize) {
        console.log(`[${uid}] uploadChunk: 文件上传完成。`);
        cacheFile.isPaused = true;
        onSuccess?.(
          {
            status: "done",
            url: MOCK_IMAGE_URL,
            data: { path: MOCK_IMAGE_URL },
          },
          undefined,
        );
        return;
      }
    }
  } catch (e: any) {
    // 捕获 uploadSliceFile 抛出的暂停错误
    if (e.message.includes("paused")) {
      console.log(`[${uid}] uploadChunk: 上传因暂停而中断：`, e.message);
      // 此时，isPaused 已经为 true，uploadChunk 循环会自然停止
    } else {
      console.error(`[${uid}] uploadChunk: 上传过程中发生未知错误：`, e);
    }
  } finally {
    console.log(`[${uid}] uploadChunk 结束，isPaused=${cacheFile.isPaused}`);
  }
}

export const customUploadRequest = async (options: CustomRequestOptions) => {
  const { file, onSuccess, onProgress } = options;
  const uid = (file as RcFile).uid;
  // 其他的额外状态都装入map 不需要storage
  uploadFileControlMap.set(uid, {
    onProgress,
    onSuccess,
    currentChunk: 0,
    uploadedSize: 0,
    isPaused: false,
    size: (file as RcFile).size,
  });

  const uploadFile = fileList.value.find(
    (f) => f.uid === uid,
  ) as UploadFileWithControl;
  if (!uploadFile) return;

  if (!uploadFileControlMap.get(uid)!.isPaused) {
    await uploadChunk(uploadFile, onProgress, onSuccess);
  } else {
    console.log(`[${uid}] 文件初始状态为暂停，等待恢复。`);
  }
};

export const togglePause = (file: UploadFileWithControl) => {
  const cacheFile = uploadFileControlMap.get(file.uid)!;
  cacheFile!.isPaused = true;
};

export const toggleResume = async (
  file: UploadFileWithControl,
  actions: any,
  originNode: any,
): Promise<void> => {
  const uid = file.uid;
  const cacheFile = uploadFileControlMap.get(uid);
  cacheFile!.isPaused = false;

  console.log(
    `[${uid}] resumeFn: 准备恢复上传，isPaused=${cacheFile?.isPaused}`,
  );

  await uploadChunk(file, cacheFile!.onProgress, cacheFile!.onSuccess);
};

export function handleDrop() {
  message.success(`文件拖放成功。`);
}

export const previewVisible = ref(false);
export const previewImage = ref("");
export const previewTitle = ref("");

export const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = "";
};
export const handlePreview = async (file: UploadProps["fileList"][number]) => {
  previewImage.value = file.url;
  previewVisible.value = true;
  previewTitle.value =
    file.name || file.url.substring(file.url.lastIndexOf("/") + 1);
};
