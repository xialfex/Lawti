# Lawti MVP 需求文档 v1.0

## 一、目标

在2026年12月中期检查前，完成一个能在本地运行、能部署上线、能收集用户数据的 Lawti 网站 MVP。

## 二、核心流程

首页 → 开始测试 → 12道题 → 提交 → 评分 → 结果页 → 分享海报 → 数据上传云端

## 三、页面清单

| 页面 | 内容 | 优先级 |
|---|---|---|
| 首页 | 项目名、一句话介绍、开始测试按钮、测试版提示 | P0 |
| 测试页 | 题目、选项、进度条、上一题/下一题、测试版提示 | P0 |
| 结果页 | 人格名称、Slogan、画像、成长建议、法条案例、测试版提示 | P0 |
| 分享 | 生成结果海报，可保存 | P1 |
| 数据后台 | 本地记录展示，可导出CSV | P1 |
| 云端后台 | Supabase Table Editor，查看所有用户记录 | P0 |

## 四、技术方案

| 部分 | 方案 |
|---|---|
| 前端 | HTML + CSS + JavaScript |
| 数据存储（本地） | localStorage |
| 数据存储（云端） | Supabase（Postgres 云数据库） |
| 云端接口 | Supabase REST API |
| 大模型 | 暂未接入，使用 personalities.json 兜底文案；预留 Prompt.md |
| 海报 | html2canvas |
| 部署 | Vercel |
| 域名 | lawti-shupl.top（腾讯云购买，DNS 指向 Vercel） |

## 五、文件结构
lawti/
├── index.html
├── test.html
├── result.html
├── data.html
├── data/
│ ├── questions.json
│ └── personalities.json
├── js/
│ ├── api.js ← 含 Supabase 上传
│ ├── scoring.js
│ ├── app.js
│ └── poster.js
├── css/
│ └── style.css
└── docs/
├── scoring.md
├── Prompt.md
├── MVP需求文档 v1.0.md
└── 本地运行手册.md

text

## 六、数据记录字段

### 本地记录（localStorage）

| 字段 | 说明 |
|---|---|
| session_id | 匿名会话ID |
| answers | 答题记录JSON |
| result_code | 四字母代码 |
| result_name | 人格名称 |
| duration | 答题时长 |
| created_at | 测试时间 |

### 云端记录（Supabase: lawti_records）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint | 自增主键 |
| session_id | text | 匿名会话ID |
| answers | jsonb | 答题记录 |
| result_code | text | 四字母代码 |
| result_name | text | 人格名称 |
| duration | int | 答题时长（秒） |
| created_at | timestamptz | 默认 now() |

## 七、验收标准

- [ ] 手机浏览器能正常打开
- [ ] 12道题能完整答完
- [ ] 结果页能正确显示人格
- [ ] 能生成分享海报
- [ ] 本地 data.html 能查看记录、导出CSV
- [ ] 云端 Supabase 能收到记录
- [ ] 线上可访问（Vercel 域名或自定义域名）
- [ ] 每个页面显示测试版提示与免责声明

## 八、当前完成状态

| 项目 | 状态 |
|---|---|
| 网站开发 | ✅ 完成 |
| 本地测试 | ✅ 通过 |
| Vercel 部署 | ✅ 完成 |
| 自定义域名 | ✅ 已绑定 lawti-shupl.top |
| Supabase 接入 | ✅ 完成 |
| 测试版提示 | ✅ 已添加 |
| 大模型接入 | ⏸ 预留（Prompt.md） |
| 内测数据收集 | ⏳ 进行中 |