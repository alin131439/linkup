# LinkUp

发现值得长期连接的人 —— 一款帮助参与者在小型活动中建立深度连接的 Web 应用。

## 功能特性

- 🏠 **双入口首页**：创建房间 / 加入房间
- 🌡️ **破冰前热身**：心情晴雨表、你是否愿意... 两种热身游戏
- 🗺️ **同频地图**：展示参与者的兴趣标签与同频度
- 💡 **留灯连接**：暗色主题 + 灯泡点亮动画，3次/日限制
- 💬 **平台聊天**：互留后生成平台内聊天窗口
- 📝 **连接笔记**：AI 标签生成的个人印象记录

## 技术栈

- React 18 + TypeScript
- Vite 6
- Tailwind CSS 3
- Zustand（状态管理 + localStorage 持久化）
- React Router DOM 7

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 项目结构

```
src/
├── components/       # 可复用组件
├── pages/            # 页面组件
│   ├── Home.tsx          # 首页（创建/加入房间）
│   ├── RoomLobby.tsx     # 房间大厅
│   ├── Warmup.tsx        # 热身游戏
│   ├── FrequencyMap.tsx # 同频地图
│   ├── Connections.tsx   # 留灯连接
│   ├── Chat.tsx          # 平台聊天
│   └── ConnectionNotes.tsx # 连接笔记
├── store/            # Zustand 状态管理
└── index.css         # 全局样式
```

## 部署

项目已配置 GitHub Pages 自动部署。推送到 `main` 分支即可触发部署流程。

## 文档

- [产品需求文档](.trae/documents/PRD.md)
- [技术架构文档](.trae/documents/TechnicalArchitecture.md)