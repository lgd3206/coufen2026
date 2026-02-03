# 芝麻分凑分 - 部署指南

## 项目简介

这是一个帮助支付宝用户快速找到合适队友，三人组队凑2026分的智能匹配网站。

## 技术栈

- **前端**: Next.js 14 (App Router) + React 18 + TypeScript
- **样式**: CSS Modules + CSS Variables
- **后端**: Next.js API Routes
- **数据库**: Supabase (PostgreSQL)
- **实时通信**: Supabase Realtime
- **部署**: Vercel

## 本地开发

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local` 文件并填入 Supabase 配置：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. 配置 Supabase 数据库

请参考 `SUPABASE_SETUP.md` 文件完成数据库配置。

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 部署到 Vercel

### 方式一：通过 GitHub（推荐）

1. 将代码推送到 GitHub 仓库
2. 访问 [Vercel](https://vercel.com)
3. 点击 "Import Project"
4. 选择你的 GitHub 仓库
5. 配置环境变量（与本地相同）
6. 点击 "Deploy"

### 方式二：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel
```

## 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 项目 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 匿名密钥
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase 服务端密钥

## 功能特性

- ✅ 智能三人匹配算法
- ✅ 实时大厅显示
- ✅ 口令自动解析
- ✅ 模式选择（找队伍/组队伍）
- ✅ 响应式设计
- ✅ 深色模式支持
- ✅ SEO 优化

## 项目结构

```
coufen-2026/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   └── submit/        # 提交匹配 API
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   ├── sitemap.ts         # 站点地图
│   └── robots.ts          # robots.txt
├── components/            # React 组件
│   ├── SubmitForm.tsx     # 提交表单
│   ├── RealtimeHall.tsx   # 实时大厅
│   ├── HowToUse.tsx       # 使用说明
│   └── FAQ.tsx            # 常见问题
├── lib/                   # 工具库
│   ├── supabase.ts        # Supabase 客户端
│   ├── parser.ts          # 口令解析器
│   └── matching.ts        # 匹配算法
└── public/                # 静态资源
```

## 核心算法

### 三人匹配算法

1. **优先匹配"组队伍"模式**：如果有两人组队，优先为他们找第三人
2. **匹配两个"找队伍"模式**：从单人用户中找到两个，分数相加等于目标值
3. **实时更新**：使用 Supabase Realtime 实现实时匹配通知

### 分数验证

- 芝麻分必须在 650-800 之间
- 三人分数相加必须正好等于 2026

## 性能优化

- 使用数据库索引提升查询速度
- 实现客户端缓存
- 响应式图片加载
- CSS 模块化避免样式冲突

## 安全性

- 使用 Supabase RLS 保护数据
- 验证所有用户输入
- 防止 SQL 注入
- 不存储任何个人隐私信息

## 许可证

MIT License

## 联系方式

如有问题或建议，欢迎提交 Issue。
