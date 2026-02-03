# Supabase 数据库配置指南

## 1. 创建 Supabase 项目

1. 访问 https://supabase.com 并注册/登录
2. 点击 "New Project"
3. 填写项目信息：
   - Name: coufen-2026
   - Database Password: 设置一个强密码（请记住）
   - Region: 选择最近的区域（如 Northeast Asia (Tokyo)）
4. 点击 "Create new project" 并等待初始化完成（约2分钟）

## 2. 创建数据表

1. 在左侧菜单点击 "SQL Editor"
2. 点击 "New query"
3. 复制粘贴以下 SQL 并点击 "Run"：

```sql
-- 创建提交表
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,              -- 口令
  score INTEGER NOT NULL,          -- 分数
  mode TEXT NOT NULL,              -- 'solo' | 'duo'
  status TEXT DEFAULT 'pending',   -- 'pending' | 'matched' | 'expired'
  matched_with UUID[],             -- 匹配的其他用户ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 hour'
);

-- 创建索引以提升查询性能
CREATE INDEX idx_submissions_score ON submissions(score);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_mode ON submissions(mode);
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);

-- 创建自动清理过期记录的函数
CREATE OR REPLACE FUNCTION cleanup_expired_submissions()
RETURNS void AS $$
BEGIN
  DELETE FROM submissions
  WHERE status = 'pending' AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 创建定时任务（每10分钟清理一次）
SELECT cron.schedule(
  'cleanup-expired-submissions',
  '*/10 * * * *',
  'SELECT cleanup_expired_submissions();'
);
```

## 3. 配置 RLS (Row Level Security)

1. 在左侧菜单点击 "Authentication" > "Policies"
2. 找到 `submissions` 表
3. 点击 "New Policy"
4. 选择 "Create a policy from scratch"
5. 配置策略：

**允许匿名读取（SELECT）：**
```sql
CREATE POLICY "Allow anonymous read access"
ON submissions FOR SELECT
TO anon
USING (true);
```

**允许匿名插入（INSERT）：**
```sql
CREATE POLICY "Allow anonymous insert"
ON submissions FOR INSERT
TO anon
WITH CHECK (true);
```

**允许匿名更新（UPDATE）：**
```sql
CREATE POLICY "Allow anonymous update"
ON submissions FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);
```

## 4. 启用 Realtime

1. 在左侧菜单点击 "Database" > "Replication"
2. 找到 `submissions` 表
3. 点击右侧的开关启用 Realtime
4. 确保状态显示为 "Enabled"

## 5. 获取 API Keys

1. 在左侧菜单点击 "Project Settings" (齿轮图标)
2. 点击 "API"
3. 复制以下信息：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJxxx...`（公开密钥）
   - **service_role**: `eyJxxx...`（服务端密钥，保密！）

## 6. 配置环境变量

将获取的信息填入项目根目录的 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

## 7. 验证配置

配置完成后，可以在 Supabase 的 SQL Editor 中运行以下查询测试：

```sql
-- 插入测试数据
INSERT INTO submissions (code, score, mode)
VALUES ('test123', 700, 'solo');

-- 查询测试数据
SELECT * FROM submissions;

-- 清理测试数据
DELETE FROM submissions WHERE code = 'test123';
```

## 完成！

现在你的 Supabase 数据库已经配置完成，可以开始开发了。
