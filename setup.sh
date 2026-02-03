#!/bin/bash

# 芝麻分凑分网站 - 一键配置脚本
# 使用方法: bash setup.sh

echo "🎯 芝麻分凑分网站 - 配置向导"
echo "================================"
echo ""

echo "📋 配置步骤概览:"
echo "1. 创建 Supabase 项目 (5分钟)"
echo "2. 配置数据库和 RLS (5分钟)"
echo "3. 更新环境变量 (2分钟)"
echo "4. 测试功能 (3分钟)"
echo ""

echo "⏰ 预计总时间: 15分钟"
echo ""

read -p "按 Enter 键开始配置..."

echo ""
echo "📝 步骤 1: 创建 Supabase 项目"
echo "================================"
echo ""
echo "1. 打开浏览器访问: https://supabase.com"
echo "2. 点击 'Start your project' 或 'Sign in'"
echo "3. 使用 GitHub 账号登录（推荐）"
echo ""

read -p "完成后按 Enter 继续..."

echo ""
echo "4. 点击 'New Project'"
echo "5. 填写项目信息:"
echo "   - Name: coufen-2026"
echo "   - Database Password: 设置一个强密码（请记住！）"
echo "   - Region: Northeast Asia (Tokyo)"
echo "   - Pricing Plan: Free"
echo "6. 点击 'Create new project'"
echo "7. 等待约 2 分钟初始化完成"
echo ""

read -p "项目创建完成后按 Enter 继续..."

echo ""
echo "📝 步骤 2: 创建数据表"
echo "================================"
echo ""
echo "1. 在 Supabase 项目中，点击左侧菜单 'SQL Editor'"
echo "2. 点击 'New query'"
echo "3. 复制以下 SQL 并粘贴到编辑器中:"
echo ""
echo "--- 复制下面的 SQL ---"
cat << 'EOF'

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

EOF
echo "--- SQL 结束 ---"
echo ""
echo "4. 点击 'Run' 执行 SQL"
echo "5. 看到 'Success. No rows returned' 表示成功"
echo ""

read -p "完成后按 Enter 继续..."

echo ""
echo "📝 步骤 3: 配置 RLS 策略"
echo "================================"
echo ""
echo "1. 点击左侧菜单 'Authentication' > 'Policies'"
echo "2. 找到 'submissions' 表"
echo "3. 点击 'New Policy' > 'Create a policy from scratch'"
echo ""
echo "添加策略 1: 允许匿名读取"
echo "  Policy name: Allow anonymous read access"
echo "  Policy command: SELECT"
echo "  Target roles: anon"
echo "  USING expression: true"
echo ""
echo "添加策略 2: 允许匿名插入"
echo "  Policy name: Allow anonymous insert"
echo "  Policy command: INSERT"
echo "  Target roles: anon"
echo "  WITH CHECK expression: true"
echo ""
echo "添加策略 3: 允许匿名更新"
echo "  Policy name: Allow anonymous update"
echo "  Policy command: UPDATE"
echo "  Target roles: anon"
echo "  USING expression: true"
echo "  WITH CHECK expression: true"
echo ""

read -p "完成后按 Enter 继续..."

echo ""
echo "📝 步骤 4: 启用 Realtime"
echo "================================"
echo ""
echo "1. 点击左侧菜单 'Database' > 'Replication'"
echo "2. 找到 'submissions' 表"
echo "3. 点击右侧的开关，启用 Realtime"
echo "4. 确保状态显示为 'Enabled'"
echo ""

read -p "完成后按 Enter 继续..."

echo ""
echo "📝 步骤 5: 获取 API Keys"
echo "================================"
echo ""
echo "1. 点击左侧菜单 'Project Settings'（齿轮图标）"
echo "2. 点击 'API'"
echo "3. 你会看到三个重要信息:"
echo ""
echo "   - Project URL: https://xxxxx.supabase.co"
echo "   - anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
echo "   - service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
echo ""
echo "请准备好这三个值，接下来需要输入"
echo ""

read -p "准备好后按 Enter 继续..."

echo ""
echo "📝 步骤 6: 更新环境变量"
echo "================================"
echo ""

read -p "请输入 Project URL (例如: https://xxxxx.supabase.co): " SUPABASE_URL
read -p "请输入 anon public key: " SUPABASE_ANON_KEY
read -p "请输入 service_role key: " SUPABASE_SERVICE_KEY

echo ""
echo "正在更新 .env.local 文件..."

cat > .env.local << EOF
# Supabase 配置
# 已通过配置向导自动生成

NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_KEY
EOF

echo "✅ 环境变量已更新！"
echo ""

echo "📝 步骤 7: 重启开发服务器"
echo "================================"
echo ""
echo "请执行以下命令:"
echo ""
echo "  npm run dev"
echo ""
echo "然后访问: http://localhost:3000"
echo ""

echo "✅ 配置完成！"
echo ""
echo "📋 验证清单:"
echo "- [ ] 浏览器控制台无错误"
echo "- [ ] 可以提交测试口令"
echo "- [ ] 实时大厅显示数据"
echo "- [ ] 搜索和筛选功能正常"
echo ""
echo "🎉 祝你使用愉快！"
