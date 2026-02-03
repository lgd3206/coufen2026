import { NextRequest, NextResponse } from 'next/server';
import { parseCode } from '@/lib/parser';
import { findMatch } from '@/lib/matching';
import { db } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, score, mode } = body;

    // 验证必填字段
    if (!code || !score || !mode) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 验证分数范围
    if (score < 650 || score > 800) {
      return NextResponse.json(
        { error: '分数必须在650-800之间' },
        { status: 400 }
      );
    }

    // 验证模式
    if (mode !== 'solo' && mode !== 'duo') {
      return NextResponse.json(
        { error: '模式必须是 solo 或 duo' },
        { status: 400 }
      );
    }

    // 保存到数据库
    const submission = await db.insertSubmission({
      code,
      score,
      mode,
    });

    // 尝试匹配
    const matchResult = await findMatch(submission.id, score, mode);

    if (matchResult.success) {
      // 匹配成功
      return NextResponse.json({
        success: true,
        matched: true,
        users: matchResult.users,
        scores: matchResult.scores,
        message: matchResult.message,
      });
    } else {
      // 等待匹配
      return NextResponse.json({
        success: true,
        matched: false,
        userId: submission.id,
        message: matchResult.message,
      });
    }
  } catch (error: any) {
    console.error('提交API错误:', error);
    return NextResponse.json(
      { error: error.message || '服务器错误' },
      { status: 500 }
    );
  }
}
