import { createClient } from '@supabase/supabase-js';

// 环境变量检查（运行时验证）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder';

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 运行时验证环境变量
if (typeof window !== 'undefined' && supabaseUrl === 'https://placeholder.supabase.co') {
  console.error('⚠️ 警告：未配置 Supabase 环境变量，请在 .env.local 中配置');
}

// 数据库类型定义
export interface Submission {
  id: string;
  code: string;
  score: number;
  mode: 'solo' | 'duo';
  status: 'pending' | 'matched' | 'expired';
  matched_with: string[] | null;
  created_at: string;
  expires_at: string;
}

// 数据库操作辅助函数
export const db = {
  // 获取所有待匹配的提交
  async getPendingSubmissions() {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Submission[];
  },

  // 根据分数查找用户
  async findUserByScore(score: number, excludeIds: string[] = []) {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('status', 'pending')
      .eq('score', score)
      .not('id', 'in', `(${excludeIds.join(',')})`)
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data as Submission | null;
  },

  // 获取指定模式的用户
  async getUsersByMode(mode: 'solo' | 'duo', excludeIds: string[] = []) {
    let query = supabase
      .from('submissions')
      .select('*')
      .eq('status', 'pending')
      .eq('mode', mode);

    if (excludeIds.length > 0) {
      query = query.not('id', 'in', `(${excludeIds.join(',')})`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data as Submission[];
  },

  // 更新匹配状态
  async updateMatchStatus(userIds: string[]) {
    const { error } = await supabase
      .from('submissions')
      .update({
        status: 'matched',
        matched_with: userIds
      })
      .in('id', userIds);

    if (error) throw error;
  },

  // 插入新提交
  async insertSubmission(submission: Omit<Submission, 'id' | 'created_at' | 'expires_at' | 'status' | 'matched_with'>) {
    const { data, error } = await supabase
      .from('submissions')
      .insert(submission)
      .select()
      .single();

    if (error) throw error;
    return data as Submission;
  }
};
