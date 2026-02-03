# 部署到 Vercel 指南

## 前置准备

1. **GitHub 账号**：需要一个 GitHub 账号来托管代码
2. **Vercel 账号**：访问 https://vercel.com 注册账号（可以用 GitHub 登录）
3. **Supabase 账号**：访问 https://supabase.com 注册账号

## 步骤 1: 配置 Supabase 数据库

### 1.1 创建 Supabase 项目

1. 登录 https://supabase.com
2. 点击 "New Project"
3. 填写项目信息：
   - Name: `coufen-2026`
   - Database Password: 设置一个强密码（请记住）
   - Region: 选择 `Northeast Asia (Tokyo)` 或最近的区域
4. 点击 "Create new project"，等待约 2 分钟初始化完成

### 1.2 创建数据表

1. 在左侧菜单点击 "SQL Editor"
2. 点击 "New query"
3. 复制粘贴以下 SQL：

```sql
-- 创建提交表
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  score INTEGER NOT NULL,
  mode TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  matched_with UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 hour'
);

-- 创建索引
CREATE INDEX idx_submissions_score ON submissions(score);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_mode ON submissions(mode);
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);
```

4. 点击 "Run" 执行 SQL

### 1.3 配置 RLS 策略

1. 在左侧菜单点击 "Authentication" > "Policies"
2. 找到 `submissions` 表，点击 "New Policy"
3. 选择 "Create a policy from scratch"
4. 添加以下三个策略：

**策略 1: 允许匿名读取**
```sql
CREATE POLICY "Allow anonymous read access"
ON submissions FOR SELECT
TO anon
USING (true);
```

**策略 2: 允许匿名插入**
```sql
CREATE POLICY "Allow anonymous insert"
ON submissions FOR INSERT
TO anon
WITH CHECK (true);
```

**策略 3: 允许匿名更新**
```sql
CREATE POLICY "Allow anonymous update"
ON submissions FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);
```

### 1.4 启用 Realtime

1. 在左侧菜单点击 "Database" > "Replication"
2. 找到 `submissions` 表
3. 点击右侧的开关启用 Realtime
4. 确保状态显示为 "Enabled"

### 1.5 获取 API Keys

1. 在左侧菜单点击 "Project Settings"（齿轮图标）
2. 点击 "API"
3. 复制以下信息（稍后需要）：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJxxx...`
   - **service_role**: `eyJxxx...`（保密！）

## 步骤 2: 推送代码到 GitHub

### 2.1 初始化 Git 仓库（如果还没有）

```bash
cd coufen-2026
git init
git add .
git commit -m "Initial commit: 芝麻分凑分网站"
```

### 2.2 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - Repository name: `coufen-2026`
   - Description: `芝麻分凑分 - 智能匹配算法，三人组队凑2026分`
   - 选择 Public 或 Private
3. 点击 "Create repository"

### 2.3 推送代码

```bash
git remote add origin https://github.com/你的用户名/coufen-2026.git
git branch -M main
git push -u origin main
```

## 步骤 3: 部署到 Vercel

### 3.1 导入项目

1. 访问 https://vercel.com
2. 点击 "Add New..." > "Project"
3. 选择 "Import Git Repository"
4. 找到你的 `coufen-2026` 仓库，点击 "Import"

### 3.2 配置项目

1. **Project Name**: `coufen-2026`（或自定义）
2. **Framework Preset**: Next.js（自动检测）
3. **Root Directory**: `./`（默认）
4. **Build Command**: `npm run build`（默认）
5. **Output Directory**: `.next`（默认）

### 3.3 配置环境变量

在 "Environment Variables" 部分添加以下变量：

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | 你的 Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 你的 Supabase anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | 你的 Supabase service_role key |

**重要**：确保所有环境变量都正确填写，否则网站无法正常工作。

### 3.4 部署

1. 点击 "Deploy" 按钮
2. 等待约 2-3 分钟，Vercel 会自动构建和部署
3. 部署成功后，你会看到一个 Vercel 域名，例如：`coufen-2026.vercel.app`

## 步骤 4: 配置自定义域名（可选）

### 4.1 添加域名

1. 在 Vercel 项目页面，点击 "Settings" > "Domains"
2. 输入你的域名：`coufen2026.org`
3. 点击 "Add"

### 4.2 配置 DNS

Vercel 会提供 DNS 配置说明，通常需要添加以下记录：

**方式 1: A 记录（推荐）**
```
Type: A
Name: @
Value: 76.76.21.21
```

**方式 2: CNAME 记录**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 4.3 等待 DNS 生效

DNS 配置通常需要 5-30 分钟生效，最长可能需要 48 小时。

## 步骤 5: 验证部署

### 5.1 访问网站

访问你的 Vercel 域名或自定义域名，检查以下功能：

- ✅ 页面正常加载
- ✅ 提交表单可以输入
- ✅ 实时大厅显示数据
- ✅ 响应式设计正常
- ✅ 深色模式切换正常

### 5.2 测试功能

1. **提交测试**：
   - 输入一个测试口令（例如：`700分 test123`）
   - 选择模式（找队伍/组队伍）
   - 点击"开始匹配"
   - 检查是否成功提交

2. **实时更新测试**：
   - 打开两个浏览器窗口
   - 在一个窗口提交数据
   - 检查另一个窗口是否实时更新

3. **匹配测试**：
   - 提交三个分数相加等于 2026 的口令
   - 检查是否自动匹配成功

## 步骤 6: 更新 sitemap 和 robots

### 6.1 更新 sitemap.ts

编辑 `app/sitemap.ts`，将 `baseUrl` 改为你的实际域名：

```typescript
const baseUrl = 'https://coufen2026.org'; // 或你的 Vercel 域名
```

### 6.2 更新 robots.ts

编辑 `app/robots.ts`，将 `sitemap` 改为你的实际域名：

```typescript
sitemap: 'https://coufen2026.org/sitemap.xml',
```

### 6.3 重新部署

```bash
git add .
git commit -m "Update domain in sitemap and robots"
git push
```

Vercel 会自动检测到代码更新并重新部署。

## 常见问题

### Q1: 构建失败怎么办？

**A**: 检查以下几点：
1. 环境变量是否正确配置
2. Supabase 数据库是否创建成功
3. 查看 Vercel 构建日志，找到具体错误信息

### Q2: 提交后没有反应？

**A**: 检查以下几点：
1. 打开浏览器控制台，查看是否有错误
2. 检查 Supabase RLS 策略是否正确配置
3. 检查环境变量是否正确

### Q3: 实时大厅不更新？

**A**: 检查以下几点：
1. Supabase Realtime 是否启用
2. 浏览器控制台是否有 WebSocket 连接错误
3. 尝试刷新页面

### Q4: 如何查看日志？

**A**:
1. Vercel 日志：在 Vercel 项目页面点击 "Deployments" > 选择部署 > "View Function Logs"
2. Supabase 日志：在 Supabase 项目页面点击 "Logs"

### Q5: 如何更新代码？

**A**:
```bash
# 修改代码后
git add .
git commit -m "描述你的修改"
git push
```

Vercel 会自动检测到更新并重新部署。

## 性能优化建议

1. **启用 Vercel Analytics**：
   - 在 Vercel 项目设置中启用 Analytics
   - 监控网站性能和用户行为

2. **配置缓存**：
   - Vercel 会自动缓存静态资源
   - 可以在 `next.config.ts` 中配置更多缓存策略

3. **监控 Supabase 使用量**：
   - 免费版有 500MB 数据库限制
   - 定期清理过期数据

## 安全建议

1. **保护 Service Role Key**：
   - 永远不要在客户端代码中使用 Service Role Key
   - 只在服务端 API 中使用

2. **定期更新依赖**：
   ```bash
   npm update
   ```

3. **监控异常访问**：
   - 使用 Vercel Analytics 监控流量
   - 配置 Supabase 日志告警

## 完成！

恭喜！你的芝麻分凑分网站已经成功部署到 Vercel。

**你的网站地址**：
- Vercel 域名：`https://coufen-2026.vercel.app`
- 自定义域名：`https://coufen2026.org`（配置后）

如有问题，请查看：
- [Vercel 文档](https://vercel.com/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Next.js 文档](https://nextjs.org/docs)
