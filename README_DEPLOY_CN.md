
# 部署指南（中国大陆可用）

本项目基于 **React + Vite**。原始版本调用 Google Gemini，现已改为 **通义千问 Qwen**，并通过 **Cloudflare Pages Functions** 进行服务端中转，API Key 不会暴露在前端。

## 一、目录结构（新增）
- `/_worker.js` —— Cloudflare Pages 的边缘函数，反向代理到 DashScope
- `/services/geminiService.ts` —— 已改造为调用 `"/api/qwen"` 本地中转，并加入 **QS 前 200** 约束

## 二、开发
```bash
pnpm i   # 或 npm i / yarn
pnpm dev # 或 npm run dev
```

## 三、构建
```bash
pnpm build # 或 npm run build
```

## 四、部署到 Cloudflare Pages（推荐）
1. 新建 Pages 项目，绑定你的仓库
2. Build 命令：`pnpm build`（或 `npm run build`）
3. Build 输出目录：`dist`
4. Functions：自动检测 `/_worker.js`
5. 设置环境变量（非常关键）：
   - `DASHSCOPE_API_KEY` = 你的 DashScope Key

部署完成后，前端会调用 `/api/qwen`，由 `_worker.js` 使用环境变量向 DashScope 转发请求。

## 五、使用说明
- 推荐结果 **严格限制在 QS Top 200**，并要求模型输出 **QS 排名** 与 **城市/国家**
- 输出格式为 JSON，前端已内置解析与兜底处理
- 风格模板为 **M（自然、共情、理性）**

## 六、常见问题
- **403/401**：检查 Pages 环境变量是否正确设置 `DASHSCOPE_API_KEY`
- **模型偶尔不带 QS 排名**：前端会保留结果，但建议重试；我们在 Prompt 里已强制要求带排名
- **需要自定义语气**：修改 `services/geminiService.ts` 里的 `M_STYLE_GUIDE`
