<script setup lang="ts">
import {
  Modal,
  Table,
  type TableColumnType,
  Form,
  FormItem,
  Input,
  Image,
  Button,
  InputNumber,
  Select,
  SelectOption,
  Radio,
  Cascader,
  TimeRangePicker,
  RangePicker,
  DatePicker,
  CheckboxGroup,
  RadioGroup,
  Tag,
  message,
  type TablePaginationConfig,
  type FormInstance,
  type CascaderProps,
  Tooltip,
} from "ant-design-vue";
import dayjs, { Dayjs } from "dayjs";
import { computed, h, reactive, ref, watch } from "vue";
import type { Key } from "ant-design-vue/es/_util/type";
import type { ButtonProps } from "ant-design-vue/lib";
import { type Props, type Emits, useDog } from "@/views/Dog.ts";
import {
  type FilterValue,
  type SorterResult,
} from "ant-design-vue/es/table/interface";
import type { Rule } from "ant-design-vue/es/form";

// 狗狗数据类型
class Dog {
  id?: number;
  name?: string;
  breed?: string;
  age?: number;
  gender?: "公" | "母";
  weight?: number;
  vaccinated?: boolean;
  image?: string;
  tags?: string[];
  birthday?: any;
}

// 所有狗狗数据（真实项目可以从 API 加载）
const dogs = ref<Dog[]>([
  {
    id: 1,
    name: "旺财",
    breed: "中华田园犬",
    age: 3,
    gender: "公",
    weight: 20,
    vaccinated: true,
    image:
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  },
  {
    id: 2,
    name: "雪球",
    breed: "萨摩耶",
    age: 2,
    gender: "母",
    weight: 25,
    vaccinated: false,
    image:
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  },
  {
    id: 3,
    name: "小黑",
    breed: "藏獒",
    age: 5,
    gender: "公",
    weight: 45,
    vaccinated: true,
    image:
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  },
  {
    id: 4,
    name: "可可",
    breed: "比熊",
    age: 1,
    gender: "母",
    weight: 8,
    vaccinated: true,
    image:
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  },
  {
    id: 5,
    name: "Tommy",
    breed: "拉布拉多",
    age: 4,
    gender: "公",
    weight: 30,
    vaccinated: true,
    image:
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  },
  {
    id: 6,
    name: "Lucky",
    breed: "金毛",
    age: 2,
    gender: "母",
    weight: 28,
    vaccinated: false,
    image:
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  },
  {
    id: 7,
    name: "贝贝",
    breed: "贵宾犬",
    age: 3,
    gender: "母",
    weight: 10,
    vaccinated: true,
    image:
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  },
  {
    id: 8,
    name: "Max",
    breed: "哈士奇",
    age: 4,
    gender: "公",
    weight: 33,
    vaccinated: true,
    image:
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  },
  {
    id: 9,
    name: "小虎",
    breed: "柴犬",
    age: 2,
    gender: "公",
    weight: 16,
    vaccinated: false,
    image:
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  },
  {
    id: 10,
    name: "Coco",
    breed: "边牧",
    age: 5,
    gender: "母",
    weight: 22,
    vaccinated: true,
    image:
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  },
]);

const options: CascaderProps["options"] = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [
          {
            value: "xihu",
            label: "West Lake",
          },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [
          {
            value: "zhonghuamen",
            label: "Zhong Hua Men",
          },
        ],
      },
    ],
  },
];
const cascaderValue = ref<string[]>([]);

// 显示弹窗
function showModal(dog: Dog) {
  selectedDog.value = JSON.parse(JSON.stringify(dog)); // 深拷贝
  modalVisible.value = true;
}

// 弹窗的显示状态
const modalVisible = ref(false);

// 弹窗的取消
function handleCancel() {
  modalVisible.value = false;
  resetSelectedDog();
  formRef.value?.resetFields(); // 清除校验提示
  // 处理dates
  formModel.rangeDate = [] as [Dayjs, Dayjs] | [];
  cascaderValue.value = [];
}

// 重置选中的狗狗
function resetSelectedDog() {
  selectedDog.value = new Dog();
}

// 选中的狗狗
const selectedDog = ref<Dog>(new Dog());

// 表格分页
const currentPage = ref(1);
// 表格每页显示条数
const pageSize = ref(9);

// 关键点：computed 以响应式 total
const pagination = computed(() => ({
  current: currentPage.value,
  pageSize: pageSize.value,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ["9", "18", "27", "36"],
  total: dogs.value.length,
  showTotal: (total: number) => `共 ${total} 条数据`,
  onChange: (page: number, size: number) => {
    currentPage.value = page;
    pageSize.value = size;
  },
  onShowSizeChange: (size: number) => {
    currentPage.value = 1;
    pageSize.value = size;
  },
}));

const columns: TableColumnType[] = [
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
    sorter: true,
    fixed: "left",
    width: 150,
  },
  {
    title: "图片",
    dataIndex: "image",
    key: "image",
    width: 150,
    customRender: ({ record }) => {
      return h(Image, {
        src: record.image,
        width: 50,
        height: 50,
        alt: record.name,
        preview: true,
      });
    },
  },
  { title: "品种", dataIndex: "breed", key: "breed", sorter: true, width: 150 },
  { title: "年龄", dataIndex: "age", key: "age", sorter: true, width: 150 },
  {
    title: "出生日期",
    dataIndex: "birthday",
    key: "birthday",
    sorter: true,
    width: 150,
  },
  {
    title: "标签",
    dataIndex: "tag",
    key: "tag",
    sorter: true,
    width: 150,
    customRender: ({ record }) => {
      const tags = record.tags || [];
      return tags.map((tag) =>
        h(Tag, { color: "geekblue", style: { marginRight: "4px" } }, () => tag),
      );
    },
  },
  {
    title: "性别",
    dataIndex: "gender",
    width: 150,
    key: "gender",
    customRender: ({ text }: { text: "公" | "母" }) => {
      const color = text === "公" ? "blue" : "pink";
      return h(Tag, { color }, () => text);
    },
  },
  {
    title: "体重(kg)",
    dataIndex: "weight",
    key: "weight",
    sorter: true,
    width: 150,
    customRender: ({ text }) => {
      const isOverweight = text > 20;
      const tip = isOverweight ? "已超重" : "体重正常";
      return h(
        Tooltip,
        { title: tip },
        {
          default: () => text + " kg",
        },
      );
    },
  },
  { title: "毛色", dataIndex: "color", key: "color", sorter: true, width: 150 },
  { title: "闹钟", dataIndex: "alarm", key: "alarm", width: 150 },
  { title: "鸣叫", dataIndex: "bark", key: "bark", width: 150 },
  {
    title: "是否接种",
    dataIndex: "vaccinated",
    key: "vaccinated",
    width: 150,
    customRender: ({ value }) => (value ? "✅ 是" : "❌ 否"),
  },
  {
    title: "操作",
    key: "actions",
    fixed: "right",
    width: 150,
    customRender: ({ record }: { record: Dog }) => {
      return h("div", { style: "display: flex; gap: 8px" }, [
        h(
          "a",
          {
            style: "color: #52c41a; cursor: pointer;",
            onClick: () => showModal(record),
          },
          "编辑",
        ),
      ]);
    },
  },
];

// 自定义行
function customRow(record: Dog) {
  return {
    onDblclick: () => {
      showModal(record);
    },
  };
}

function onTableChange(
  pagination: TablePaginationConfig,
  filters: Record<string, FilterValue>,
  sorter: SorterResult<any> | SorterResult<any>[],
) {
  message.info("分页信息：" + JSON.stringify(pagination));
  message.info("过滤信息：" + JSON.stringify(filters));
  message.info("排序信息：" + JSON.stringify(sorter));
}

// 选中行
const selectedRowKeys = ref<Key[]>([]);
// 选中的行数据
const selectedRows = ref<Dog[]>([]);
// 选中行变化
const onSelectChange = (keys: Key[], rows: Dog[]) => {
  selectedRowKeys.value = keys;
  selectedRows.value = rows;
};

// 表单引用
const formRef = ref<FormInstance>();

// 校验模型
const formModel = reactive({
  name: "",
  breed: "",
  age: null,
  weight: null,
  gender: "",
  vaccinated: null,
  tags: [],
  birthday: undefined,
  rangeDate: [] as [Dayjs, Dayjs] | [],
});

// 校验规则

const formRules: Record<string, Rule[]> = {
  name: [
    { required: true, message: "请输入姓名", trigger: "blur" },
    {
      pattern: /^[\u4e00-\u9fa5a-zA-Z\s]{2,20}$/,
      message: "姓名仅支持2~20位中英文字符",
      trigger: "blur",
    },
  ],
  breed: [{ required: true, message: "请选择品种", trigger: "change" }],
  age: [
    { required: true, type: "number", message: "请输入年龄", trigger: "blur" },
    {
      validator: (_, value) => {
        if (value >= 0 && value <= 200) return Promise.resolve();
        return Promise.reject("年龄必须在 0 ~ 200 之间");
      },
      trigger: "blur",
    },
  ],
  weight: [
    { required: true, type: "number", message: "请输入体重", trigger: "blur" },
    {
      validator: (_, value) => {
        if (value >= 1 && value <= 200) return Promise.resolve();
        return Promise.reject("体重必须在 1 ~ 200 kg 之间");
      },
      trigger: "blur",
    },
  ],
  gender: [{ required: true, message: "请选择性别", trigger: "change" }],
  vaccinated: [
    { required: true, message: "请选择是否接种", trigger: "change" },
  ],
};

watch(
  () => selectedDog.value,
  (dog) => {
    formModel.name = dog.name || "";
    formModel.breed = dog.breed || "";
    formModel.age = dog.age || null;
    formModel.weight = dog.weight || null;
    formModel.gender = dog.gender || "";
    formModel.vaccinated = dog.vaccinated ?? null;
    formModel.tags = dog.tags;
    formModel.birthday = dog.birthday || null;
  },
  { immediate: true },
);

// 🔍 搜索条件
const search = ref({
  name: "",
  breed: "",
});

// 筛选后的狗列表
const filteredDogs = computed(() => {
  return dogs.value.filter((dog) => {
    const matchesName = search.value.name
      ? dog.name?.includes(search.value.name)
      : true;
    const matchesBreed = search.value.breed
      ? dog.breed === search.value.breed
      : true;
    return matchesName && matchesBreed;
  });
});

function handleSearch() {
  // 由于 filteredDogs 是 computed，所以会自动更新，无需额外处理
}

function resetSearch() {
  search.value.name = "";
  search.value.breed = "";
}

function handleAdd() {
  selectedDog.value = new Dog();
  modalVisible.value = true;
}

function handleSave() {
  formRef.value
    ?.validate()
    .then(() => {
      // ✅ 将 formModel 同步回 selectedDog
      selectedDog.value.name = formModel.name;
      selectedDog.value.breed = formModel.breed;
      selectedDog.value.age = formModel.age;
      selectedDog.value.weight = formModel.weight;
      selectedDog.value.gender = formModel.gender as "公" | "母";
      selectedDog.value.vaccinated = formModel.vaccinated;
      selectedDog.value.tags = formModel.tags;
      selectedDog.value.birthday = formModel.birthday;

      if (formModel.rangeDate.length === 2) {
        message.info(
          formModel.rangeDate
            .map((date) => date.format("YYYY-MM-DD"))
            .join(" 至 "),
        );
      }

      if (!selectedDog.value.id) {
        // 新增逻辑
        const maxId = dogs.value.reduce(
          (max, dog) => (dog.id && dog.id > max ? dog.id : max),
          0,
        );
        selectedDog.value.id = maxId + 1;
        dogs.value.push({ ...selectedDog.value });
      } else {
        // 编辑逻辑
        const index = dogs.value.findIndex(
          (d) => d.id === selectedDog.value.id,
        );
        if (index !== -1) {
          dogs.value[index] = { ...selectedDog.value };
        }
      }

      modalVisible.value = false;
      resetSelectedDog();
      formRef.value?.resetFields();
    })
    .catch(() => {
      message.error("表单校验失败");
    });
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const { fetchDog } = useDog(props, emits);

function randomAdd() {
  fetchDog().then((dogImage) => {
    const dog = new Dog();
    dog.id = dogs.value.length + 1;
    dog.name = `狗狗${dog.id}`;
    dog.image = dogImage;
    dog.breed = "中华田园犬";
    dog.age = 3;
    dog.gender = "公";
    dog.weight = 20;
    dog.vaccinated = true;
    dogs.value.push({ ...dog });
    message.success("随机添加一条狗成功！");
  });
}

const buttonTypeRef = ref<ButtonProps["type"]>("primary");

type RangeValue = [Dayjs, Dayjs] | [];

const dates = ref<RangeValue>([]);

// 相当于选中某一个后, 当前面板的所有日期都会传入判断是否可以选择
const disabledDate = (current: Dayjs) => {
  if (!dates.value || dates.value.length === 0) {
    return false;
  }
  const start = dayjs(dates.value[0], "YYYY-MM-DD");
  const end = dayjs(dates.value[1], "YYYY-MM-DD");
  const currentDate = current.startOf("day");

  if (start && currentDate.isAfter(start.add(7, "day"))) {
    return true;
  }

  if (end && currentDate.isBefore(end.subtract(7, "day"))) {
    return true;
  }

  return false;
};

// 禁用时间的函数，区分开始和结束，限制结束时间不能超过开始时间+7天具体时刻
const disabledTime = (currentDate: Dayjs | null) => {
  if (currentDate === null) {
    return {
      disabledHours: () => [],
      disabledMinutes: () => [],
      disabledSeconds: () => [],
    };
  }
  const start = dates.value[0];
  if (start === null || start === undefined) {
    return {
      disabledHours: () => [],
      disabledMinutes: () => [],
      disabledSeconds: () => [],
    };
  }
  const maxTime = start.add(7, "day");
  if (currentDate.isSame(maxTime, "day")) {
    const maxHour = maxTime.hour();
    const maxMinute = maxTime.minute();
    const maxSecond = maxTime.second();

    return {
      disabledHours: () =>
        Array.from({ length: 24 }, (_, i) => (i > maxHour ? i : -1)).filter(
          (i) => i !== -1,
        ),
      disabledMinutes: (selectedHour) =>
        selectedHour === maxHour
          ? Array.from({ length: 60 }, (_, i) =>
              i > maxMinute ? i : -1,
            ).filter((i) => i !== -1)
          : [],
      disabledSeconds: (selectedHour, selectedMinute) =>
        selectedHour === maxHour && selectedMinute === maxMinute
          ? Array.from({ length: 60 }, (_, i) =>
              i > maxSecond ? i : -1,
            ).filter((i) => i !== -1)
          : [],
    };
  }

  return {
    disabledHours: () => [],
    disabledMinutes: () => [],
    disabledSeconds: () => [],
  };
};

function onOpenChange(open: boolean) {
  if (open) {
    dates.value = [];
  }
}

// 两个时间都确定后
function onChange(val: RangeValue) {
  formModel.rangeDate = val;
}

// 任意一个时间确认后
function onCalendarChange(val: RangeValue) {
  dates.value = val;
}
</script>

<template>
  <div style="padding: 20px" class="dog-page">
    <h2 style="text-align: center" class="dog-title">🐶 狗狗列表</h2>
    <!--    <CommonTitle :showMarker="true" :light="false" title="Dogs" style="margin-top: 20px;" />-->

    <!--    动态切换组件-->
    <!--    <component :is="currentComponent" title="基本信息" :showMarker="true" />-->
    <!-- 🔍 搜索区域 -->
    <Form layout="inline" style="margin-bottom: 16px">
      <FormItem label="姓名">
        <Input v-model:value="search.name" placeholder="请输入狗狗姓名" />
      </FormItem>
      <FormItem label="品种">
        <Select
          v-model:value="search.breed"
          placeholder="请选择品种"
          allowClear
          style="width: 160px"
        >
          <SelectOption value="中华田园犬">中华田园犬</SelectOption>
          <SelectOption value="萨摩耶">萨摩耶</SelectOption>
          <SelectOption value="藏獒">藏獒</SelectOption>
          <SelectOption value="拉布拉多">拉布拉多</SelectOption>
          <SelectOption value="金毛">金毛</SelectOption>
          <SelectOption value="贵宾犬">贵宾犬</SelectOption>
          <SelectOption value="哈士奇">哈士奇</SelectOption>
          <SelectOption value="柴犬">柴犬</SelectOption>
          <SelectOption value="边牧">边牧</SelectOption>
        </Select>
      </FormItem>
      <FormItem>
        <Button :type="buttonTypeRef" @click="handleSearch">查询</Button>
        <Button type="primary" style="margin-left: 8px" @click="resetSearch"
          >重置</Button
        >
        <Button type="primary" style="margin-left: 8px" @click="handleAdd"
          >新增</Button
        >
        <Button type="primary" style="margin-left: 8px" @click="randomAdd"
          >随机添加一条狗</Button
        >
      </FormItem>
    </Form>

    <Table
      :columns="columns"
      :data-source="filteredDogs"
      :pagination="pagination"
      :loading="false"
      :row-key="(record) => record.id"
      :scroll="{ x: 2000, y: 450 }"
      :custom-row="customRow"
      :on-change="onTableChange"
      size="large"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
        type: 'checkbox',
        getCheckboxProps: (record: Dog) => ({
          disabled: !record.vaccinated,
          name: record.name,
        }),
      }"
    />

    <Modal
      v-model:open="modalVisible"
      title="🐾 狗狗详情（可编辑）"
      @cancel="modalVisible = false"
      @close="selectedDog = new Dog()"
    >
      <template #footer>
        <Button @click="handleCancel">取消</Button>
        <Button type="primary" style="margin-left: 8px" @click="handleSave"
          >保存</Button
        >
      </template>

      <template v-if="formModel">
        <Form
          layout="horizontal"
          :model="formModel"
          :rules="formRules"
          ref="formRef"
        >
          <FormItem label="姓名" name="name">
            <Input v-model:value="formModel.name" />
          </FormItem>

          <FormItem label="品种" name="breed">
            <Select v-model:value="formModel.breed" placeholder="请选择品种">
              <SelectOption value="中华田园犬">中华田园犬</SelectOption>
              <SelectOption value="萨摩耶">萨摩耶</SelectOption>
              <SelectOption value="藏獒">藏獒</SelectOption>
              <SelectOption value="拉布拉多">拉布拉多</SelectOption>
              <SelectOption value="金毛">金毛</SelectOption>
              <SelectOption value="贵宾犬">贵宾犬</SelectOption>
              <SelectOption value="哈士奇">哈士奇</SelectOption>
              <SelectOption value="柴犬">柴犬</SelectOption>
              <SelectOption value="边牧">边牧</SelectOption>
            </Select>
          </FormItem>

          <FormItem label="年龄" name="age">
            <InputNumber v-model:value="formModel.age" :min="0" />
          </FormItem>

          <FormItem label="体重 (kg)" name="weight">
            <InputNumber v-model:value="formModel.weight" :min="0" />
          </FormItem>

          <FormItem label="性别" name="gender">
            <RadioGroup v-model:value="formModel.gender">
              <Radio value="公">公</Radio>
              <Radio value="母">母</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem label="是否接种" name="vaccinated">
            <RadioGroup v-model:value="formModel.vaccinated">
              <Radio :value="true">是 ✅</Radio>
              <Radio :value="false">否 ❌</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="标签">
            <CheckboxGroup
              v-model:value="formModel.tags"
              :options="['c1', 'c2', 'c3']"
            />
          </FormItem>

          <FormItem label="图片">
            <Image
              :src="selectedDog.image"
              :width="80"
              :placeholder="true"
              :preview="true"
            ></Image>
          </FormItem>
          <FormItem label="出生日期" name="birthday">
            <DatePicker
              placeholder="出生日期"
              v-model:value="formModel.birthday"
              :disabled-date="
                (current) => current && current > dayjs().endOf('day')
              "
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
            />
          </FormItem>

          <FormItem label="日期选择范围">
            <RangePicker
              :format="'YYYY-MM-DD HH:mm:ss'"
              :placeholder="['开始日期', '结束日期']"
              :value="formModel.rangeDate as [Dayjs, Dayjs]"
              :show-time="true"
              :disabled-date="disabledDate"
              :disabled-time="disabledTime"
              @change="(values, dateString) => onChange(values as RangeValue)"
              @openChange="onOpenChange"
              @calendarChange="(values, formatString, info) => onCalendarChange(values as RangeValue)"
            />
          </FormItem>
          <FormItem label="工作时间">
            <TimeRangePicker :format="'HH:mm:ss'"> </TimeRangePicker>
          </FormItem>
          <FormItem label="省市区">
            <Cascader
              v-model:value="cascaderValue"
              :options="options"
              placeholder="Please select"
              expandTrigger="hover"
              :multiple="true"
              showCheckedStrategy="SHOW_CHILD"
            />
          </FormItem>
        </Form>
      </template>
    </Modal>
  </div>
</template>

<style scoped></style>
