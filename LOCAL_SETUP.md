# ⚠️ 本地开发环境配置

## 当前问题

你看到的错误是因为 `.env.local` 中使用了占位符配置：
```
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...placeholder
```

## 快速解决方案

### 选项 1: 创建真实的 Supabase 项目（推荐）

#### 步骤 1: 创建 Supabase 项目（5分钟）

1. **访问 Supabase**
   ```
   打开浏览器访问: https://supabase.com
   点击 "Start your project"
   使用 GitHub 账号登录（推荐）
   ```

2. **创建新项目**
   ```
   点击 "New Project"

   填写信息:
   - Organization: 选择你的组织（或创建新的）
   - Name: coufen-2026
   - Database Password: 设置一个强密码（请记住！）
   - Region: Northeast Asia (Tokyo) 或 Southeast Asia (Singapore)
   - Pricing Plan: Free（免费版足够使用）

   点击 "Create new project"
   等待约 2 分钟初始化完成
   ```

3. **创建数据表**
   ```
   项目创建完成后，点击左侧菜单 "SQL Editor"
   点击 "New query"
   复制粘贴以下 SQL:
   ```

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

   ```
   点击 "Run" 执行 SQL
   看到 "Success. No rows returned" 表示成功
   ```

4. **配置 RLS 策略**
   ```
   点击左侧菜单 "Authentication" > "Policies"
   找到 "submissions" 表
   点击 "New Policy"
   选择 "Create a policy from scratch"
   ```

   **策略 1: 允许匿名读取**
   ```sql
   Policy name: Allow anonymous read access
   Policy command: SELECT
   Target roles: anon
   USING expression: true
   ```

   **策略 2: 允许匿名插入**
   ```sql
   Policy name: Allow anonymous insert
   Policy command: INSERT
   Target roles: anon
   WITH CHECK expression: true
   ```

   **策略 3: 允许匿名更新**
   ```sql
   Policy name: Allow anonymous update
   Policy command: UPDATE
   Target roles: anon
   USING expression: true
   WITH CHECK expression: true
   ```

5. **启用 Realtime**
   ```
   点击左侧菜单 "Database" > "Replication"
   找到 "submissions" 表
   点击右侧的开关，启用 Realtime
   确保状态显示为 "Enabled"
   ```

6. **获取 API Keys**
   ```
   点击左侧菜单 "Project Settings"（齿轮图标）
   点击 "API"

   你会看到:
   - Project URL: https://xxxxx.supabase.co
   - anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   - service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   复制这三个值（稍后需要）
   ```

#### 步骤 2: 更新本地环境变量

1. **编辑 `.env.local` 文件**
   ```bash
   # 在项目根目录打开 .env.local
   # 替换为你刚才复制的真实值
   ```

   ```env
   # Supabase 配置
   NEXT_PUBLIC_SUPABASE_URL=https://你的项目ID.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_anon_public_key
   SUPABASE_SERVICE_ROLE_KEY=你的_service_role_key
   ```

2. **重启开发服务器**
   ```bash
   # 停止当前服务器 (Ctrl+C)
   # 重新启动
   npm run dev
   ```

3. **测试功能**
   ```
   访问 http://localhost:3000
   应该不再看到警告信息
   尝试提交一个测试口令
   检查实时大厅是否正常显示
   ```

---

### 选项 2: 仅测试 UI（不推荐）

如果你只想快速查看 UI 效果，可以暂时禁用数据库功能：

1. **修改 `components/RealtimeHall.tsx`**
   ```typescript
   // 注释掉 loadSubmissions 调用
   useEffect(() => {
     // loadSubmissions(); // 暂时禁用
   }, []);
   ```

2. **修改 `components/SubmitForm.tsx`**
   ```typescript
   // 在 handleSubmit 中添加模拟数据
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setSuccess('✅ UI 测试模式：提交成功！');
     return; // 暂时返回，不调用 API
     // ... 原有代码
   };
   ```

**注意**: 这种方式只能看到 UI，无法测试实际功能。

---

## 📋 配置检查清单

完成 Supabase 配置后，请检查：

- [ ] Supabase 项目已创建
- [ ] submissions 表已创建
- [ ] 4个索引已创建
- [ ] 3个 RLS 策略已配置
- [ ] Realtime 已启用
- [ ] API Keys 已复制
- [ ] .env.local 已更新为真实值
- [ ] 开发服务器已重启
- [ ] 浏览器控制台无错误
- [ ] 可以成功提交数据
- [ ] 实时大厅正常显示

---

## 🎯 验证配置是否成功

### 1. 检查浏览器控制台

打开浏览器控制台（F12），应该：
- ✅ 没有 "⚠️ 警告：未配置 Supabase 环境变量" 的警告
- ✅ 没有 WebSocket 连接失败的错误
- ✅ 没有 "加载数据失败" 的错误

### 2. 测试提交功能

1. 在输入框中输入测试口令：`700分 test123`
2. 选择模式：找队伍
3. 点击"开始匹配"
4. 应该看到：✅ 提交成功！正在等待匹配...

### 3. 测试实时大厅

1. 打开两个浏览器窗口
2. 在第一个窗口提交数据
3. 第二个窗口应该立即显示新数据（无需刷新）

### 4. 检查 Supabase 数据库

1. 访问 Supabase 项目
2. 点击 "Table Editor"
3. 选择 "submissions" 表
4. 应该能看到刚才提交的测试数据

---

## 🐛 常见问题

### Q1: 创建表时报错 "permission denied"
**A**: 确保你使用的是项目所有者账号，或者有足够的权限

### Q2: RLS 策略配置后仍然无法访问
**A**: 检查策略的 Target roles 是否设置为 "anon"

### Q3: Realtime 无法启用
**A**: 确保表已经创建成功，刷新页面后重试

### Q4: API Keys 在哪里找？
**A**: Project Settings > API，在页面中间位置

### Q5: 忘记数据库密码怎么办？
**A**: 可以在 Project Settings > Database 中重置密码

---

## 📞 需要帮助？

如果遇到问题：

1. **检查 Supabase 状态**
   - 访问 https://status.supabase.com
   - 确认服务正常运行

2. **查看 Supabase 日志**
   - 在 Supabase 项目中点击 "Logs"
   - 查看是否有错误信息

3. **查看浏览器控制台**
   - 按 F12 打开开发者工具
   - 查看 Console 和 Network 标签

4. **参考官方文档**
   - Supabase 文档: https://supabase.com/docs
   - Next.js 文档: https://nextjs.org/docs

---

## ✅ 配置完成后

配置成功后，你就可以：

1. ✅ 在本地开发和测试所有功能
2. ✅ 提交真实数据到 Supabase
3. ✅ 测试实时匹配算法
4. ✅ 准备部署到 Vercel

**下一步**: 完成本地测试后，按照 `DEPLOYMENT.md` 部署到 Vercel。

---

**预计配置时间**: 10-15 分钟
**难度等级**: ⭐⭐☆☆☆（简单）

祝你配置顺利！🚀
