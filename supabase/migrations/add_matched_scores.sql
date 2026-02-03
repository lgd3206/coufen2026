-- 添加 matched_scores 字段到 submissions 表
-- 用于存储匹配成功后三个用户的分数

ALTER TABLE submissions
ADD COLUMN IF NOT EXISTS matched_scores INTEGER[] DEFAULT NULL;

-- 添加注释
COMMENT ON COLUMN submissions.matched_scores IS '匹配成功后三个用户的分数数组';
