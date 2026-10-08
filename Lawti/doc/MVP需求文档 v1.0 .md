Lawti MVP 需求文档 v1.0
一、目标
在2026年12月中期检查前，完成一个能在本地运行、能演示、能收集数据的Lawti网站MVP。

二、核心流程
text
首页 → 开始测试 → 12道题 → 提交 → 评分 → 结果页 → 分享海报
三、页面清单
页面	内容	优先级
首页	项目名、一句话介绍、开始测试按钮	P0
测试页	题目、选项、进度条、上一题/下一题	P0
结果页	人格名称、Slogan、画像、成长建议、法条案例	P0
分享页	生成结果海报，可保存	P1
后台	记录答题数据，可导出CSV	P1
四、技术方案
部分	方案
前端	HTML + CSS + JavaScript（单页应用）
后端	Python Flask
数据库	SQLite
大模型	DeepSeek API（失败时用兜底模板）
海报	html2canvas
部署	本地 localhost，后期Render
五、文件结构
text
lawti/
├── app.py
├── questions.json
├── personalities.json
├── templates/
│   ├── index.html
│   ├── test.html
│   └── result.html
├── static/
│   ├── style.css
│   ├── script.js
│   └── poster.js
└── lawti.db
六、数据记录字段
字段	说明
session_id	匿名会话ID
answers	答题记录JSON
result_code	四字母代码
result_name	人格名称
created_at	测试时间
duration	答题时长
七、验收标准
手机浏览器能正常打开

12道题能完整答完

结果页能正确显示人格

大模型能生成个性化建议（失败有兜底）

能生成分享海报

后台能导出数据