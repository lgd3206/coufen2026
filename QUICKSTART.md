# 🎯 芝麻分凑分网站 - 快速开始

## ✅ 已完成

### 1. 项目开发 ✓
- ✅ Next.js 14 项目初始化
- ✅ 智能三人匹配算法
- ✅ 实时大厅（Supabase Realtime）
- ✅ 口令解析和验证
- ✅ 模式选择（找队伍/组队伍）
- ✅ 响应式设计 + 深色模式
- ✅ SEO 优化（sitemap、robots）
- ✅ 使用说明 + FAQ

### 2. 代码推送 ✓
- ✅ 代码已推送到 GitHub: https://github.com/lgd3206/coufen2026
- ✅ 分支：main
- ✅ 提交信息：完整的功能实现

## 📋 下一步操作

### 步骤 1: 配置 Supabase 数据库（约 10 分钟）

1. **创建 Supabase 项目**
   - 访问：https://supabase.com
   - 点击 "New Project"
   - 项目名称：`coufen-2026`
   - 区域：选择 `Northeast Asia (Tokyo)`
   - 设置数据库密码（请记住）

2. **创建数据表**
   - 进入 SQL Editor
   - 复制 `SUPABASE_SETUP.md` 中的 SQL
   - 执行创建表和索引

3. **配置 RLS 策略**
   - 添加三个策略（允许匿名读取、插入、更新）
   - 详见 `SUPABASE_SETUP.md`

4. **启用 Realtime**
   - Database > Replication
   - 启用 `submissions` 表的 Realtime

5. **获取 API Keys**
   - Project Settings > API
   - 复制：
     - Project URL
     - anon public key
     - service_role key

### 步骤 2: 部署到 Vercel（约 5 分钟）

1. **导入项目**
   - 访问：https://vercel.com
   - 点击 "Add New..." > "Project"
   - 选择 GitHub 仓库：`lgd3206/coufen2026`

2. **配置环境变量**
   ```
   NEXT_PUBLIC_SUPABASE_URL=你的_Supabase_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_anon_key
   SUPABASE_SERVICE_ROLE_KEY=你的_service_role_key
   ```

3. **部署**
   - 点击 "Deploy"
   - 等待 2-3 分钟
   - 获得 Vercel 域名：`coufen2026.vercel.app`

### 步骤 3: 更新域名配置（可选）

如果你有自定义域名：

1. **更新代码中的域名**
   ```bash
   # 编辑 app/sitemap.ts
   const baseUrl = 'https://你的域名.com';

   # 编辑 app/robots.ts
   sitemap: 'https://你的域名.com/sitemap.xml';
   ```

2. **推送更新**
   ```bash
   cd coufen-2026
   git add .
   git commit -m "Update domain"
   git push
   ```

3. **在 Vercel 配置域名**
   - Settings > Domains
   - 添加你的域名
   - 配置 DNS 记录

## 🚀 功能特性

### 核心功能
- **智能匹配算法**：自动找到三个用户，分数相加正好 2026
- **优先级匹配**：优先匹配"组队伍"模式（两人找一人）
- **实时更新**：使用 Supabase Realtime，新提交立即显示
- **口令解析**：自动识别支付宝口令格式
- **分数验证**：确保分数在 650-800 范围内

### 用户体验
- **响应式设计**：完美适配手机、平板、电脑
- **深色模式**：自动跟随系统主题
- **加载状态**：清晰的加载和错误提示
- **动画效果**：流畅的过渡和交互动画

### SEO 优化
- **完整 Meta 标签**：title、description、keywords
- **Open Graph**：社交媒体分享优化
- **Sitemap**：搜索引擎索引
- **Robots.txt**：爬虫配置

## 📁 项目结构

```
coufen-2026/
├── app/                          # Next.js App Router
│   ├── api/submit/route.ts      # 提交匹配 API
│   ├── globals.css              # 全局样式（CSS Variables）
│   ├── layout.tsx               # 根布局 + SEO
│   ├── page.tsx                 # 首页
│   ├── page.module.css          # 首页样式
│   ├── sitemap.ts               # 站点地图
│   └── robots.ts                # Robots 配置
├── components/                   # React 组件
│   ├── SubmitForm.tsx           # 提交表单
│   ├── RealtimeHall.tsx         # 实时大厅
│   ├── HowToUse.tsx             # 使用说明
│   └── FAQ.tsx                  # 常见问题
├── lib/                         # 工具库
│   ├── supabase.ts              # Supabase 客户端 + 数据库操作
│   ├── parser.ts                # 口令解析器
│   └── matching.ts              # 匹配算法
├── DEPLOYMENT.md                # 详细部署指南
├── SUPABASE_SETUP.md            # Supabase 配置指南
└── README.md                    # 项目说明
```

## 🔧 技术栈

- **前端框架**：Next.js 14 (App Router)
- **UI 库**：React 18
- **类型检查**：TypeScript
- **样式方案**：CSS Modules + CSS Variables
- **数据库**：Supabase (PostgreSQL)
- **实时通信**：Supabase Realtime
- **部署平台**：Vercel

## 📊 匹配算法说明

### 算法逻辑

1. **输入**：用户分数（650-800）、模式（solo/duo）
2. **目标**：找到三个用户，分数相加 = 2026

### 匹配策略

**策略 1：优先匹配 duo 模式**
```
如果有用户选择"组队伍"（duo）：
  计算需要的第三人分数 = 2026 - 当前用户分数 - duo用户分数
  如果第三人分数在 650-800 范围内：
    查找分数匹配的用户
    如果找到 → 匹配成功
```

**策略 2：匹配两个 solo 模式**
```
从所有"找队伍"（solo）用户中：
  遍历第一个用户
  计算需要的第二人分数 = 2026 - 当前用户分数 - 第一个用户分数
  查找分数匹配的第二个用户
  如果找到 → 匹配成功
```

### 示例

**场景 1：三个 solo 用户**
- 用户A：700分（solo）
- 用户B：650分（solo）
- 用户C：676分（solo）
- 结果：700 + 650 + 676 = 2026 ✅

**场景 2：一个 duo + 一个 solo**
- 用户A+B：1350分（duo，两人总分）
- 用户C：676分（solo）
- 结果：1350 + 676 = 2026 ✅

## 🔒 安全性

- ✅ 使用 Supabase RLS 保护数据
- ✅ 验证所有用户输入
- ✅ 防止 SQL 注入
- ✅ 不存储任何个人隐私信息
- ✅ Service Role Key 仅在服务端使用

## 📈 性能优化

- ✅ 数据库索引（score、status、mode、created_at）
- ✅ CSS 模块化避免样式冲突
- ✅ 响应式图片加载
- ✅ 自动清理过期数据（1小时）

## 🐛 故障排查

### 问题 1：构建失败
**原因**：环境变量未配置
**解决**：在 Vercel 中配置三个环境变量

### 问题 2：提交后无反应
**原因**：Supabase RLS 策略未配置
**解决**：按照 `SUPABASE_SETUP.md` 配置策略

### 问题 3：实时大厅不更新
**原因**：Realtime 未启用
**解决**：在 Supabase 中启用 submissions 表的 Realtime

## 📞 支持

- **GitHub 仓库**：https://github.com/lgd3206/coufen2026
- **部署指南**：查看 `DEPLOYMENT.md`
- **Supabase 配置**：查看 `SUPABASE_SETUP.md`

## 🎉 完成检查清单

部署完成后，请检查以下功能：

- [ ] 页面正常加载
- [ ] 可以提交口令
- [ ] 实时大厅显示数据
- [ ] 搜索和筛选功能正常
- [ ] 响应式设计正常
- [ ] 深色模式切换正常
- [ ] 三人匹配算法正确（分数相加 = 2026）

## 🚀 立即开始

1. 访问 https://supabase.com 创建数据库
2. 访问 https://vercel.com 部署网站
3. 配置环境变量
4. 测试功能
5. 分享给用户使用！

---

**预计完成时间**：15-20 分钟
**难度等级**：⭐⭐☆☆☆（简单）

祝你部署顺利！🎊
