import { db, Submission } from './supabase';

/**
 * 匹配结果
 */
export interface MatchResult {
  success: boolean;
  users: string[];
  scores?: number[];
  message?: string;
}

/**
 * 三人匹配算法
 * 目标：找到三个用户，分数相加 = 2026
 *
 * @param userId 当前用户ID
 * @param score 当前用户分数
 * @param mode 当前用户模式
 * @returns 匹配结果
 */
export async function findMatch(
  userId: string,
  score: number,
  mode: 'solo' | 'duo'
): Promise<MatchResult> {
  const target = 2026 - score;

  try {
    // 策略1: 优先匹配"组队伍"模式（duo）
    // 如果有duo用户，尝试找到第三个人凑成2026
    const duoUsers = await db.getUsersByMode('duo', [userId]);

    for (const duo of duoUsers) {
      const needed = target - duo.score;

      // 检查needed是否在有效范围内
      if (needed >= 650 && needed <= 800) {
        // 查找分数正好是needed的用户
        const third = await db.findUserByScore(needed, [userId, duo.id]);

        if (third) {
          // 找到完美匹配！
          const matchedUsers = [userId, duo.id, third.id];
          const matchedScores = [score, duo.score, third.score];

          // 验证分数总和
          if (matchedScores.reduce((a, b) => a + b, 0) === 2026) {
            // 更新数据库状态
            await db.updateMatchStatus(matchedUsers, matchedScores);

            return {
              success: true,
              users: matchedUsers,
              scores: matchedScores,
              message: '匹配成功！三人分数相加正好2026分'
            };
          }
        }
      }
    }

    // 策略2: 匹配两个"找队伍"模式（solo）
    // 从所有solo用户中找到两个，分数相加等于target
    const soloUsers = await db.getUsersByMode('solo', [userId]);

    for (let i = 0; i < soloUsers.length; i++) {
      const first = soloUsers[i];
      const needed = target - first.score;

      // 检查needed是否在有效范围内
      if (needed >= 650 && needed <= 800) {
        // 在剩余的solo用户中查找
        const second = soloUsers.find(
          u => u.score === needed && u.id !== first.id
        );

        if (second) {
          // 找到匹配！
          const matchedUsers = [userId, first.id, second.id];
          const matchedScores = [score, first.score, second.score];

          // 验证分数总和
          if (matchedScores.reduce((a, b) => a + b, 0) === 2026) {
            // 更新数据库状态
            await db.updateMatchStatus(matchedUsers, matchedScores);

            return {
              success: true,
              users: matchedUsers,
              scores: matchedScores,
              message: '匹配成功！三人分数相加正好2026分'
            };
          }
        }
      }
    }

    // 没有找到匹配
    return {
      success: false,
      users: [userId],
      message: '暂无匹配，请等待其他用户加入...'
    };
  } catch (error) {
    console.error('匹配算法错误:', error);
    return {
      success: false,
      users: [userId],
      message: '匹配失败，请稍后重试'
    };
  }
}

/**
 * 计算可能的匹配组合数量
 * @param score 当前分数
 * @returns 可能的组合数量
 */
export async function calculatePossibleMatches(score: number): Promise<number> {
  const target = 2026 - score;
  let count = 0;

  try {
    const allUsers = await db.getPendingSubmissions();

    // 遍历所有可能的两人组合
    for (let i = 0; i < allUsers.length; i++) {
      for (let j = i + 1; j < allUsers.length; j++) {
        const sum = allUsers[i].score + allUsers[j].score;
        if (sum === target) {
          count++;
        }
      }
    }

    return count;
  } catch (error) {
    console.error('计算匹配组合错误:', error);
    return 0;
  }
}

/**
 * 获取当前等待队列统计
 */
export async function getQueueStats() {
  try {
    const pending = await db.getPendingSubmissions();

    const soloCount = pending.filter(u => u.mode === 'solo').length;
    const duoCount = pending.filter(u => u.mode === 'duo').length;

    // 计算平均分数
    const avgScore = pending.length > 0
      ? Math.round(pending.reduce((sum, u) => sum + u.score, 0) / pending.length)
      : 0;

    // 计算分数分布
    const scoreDistribution: Record<string, number> = {};
    pending.forEach(u => {
      const range = `${Math.floor(u.score / 50) * 50}-${Math.floor(u.score / 50) * 50 + 49}`;
      scoreDistribution[range] = (scoreDistribution[range] || 0) + 1;
    });

    return {
      total: pending.length,
      soloCount,
      duoCount,
      avgScore,
      scoreDistribution
    };
  } catch (error) {
    console.error('获取队列统计错误:', error);
    return {
      total: 0,
      soloCount: 0,
      duoCount: 0,
      avgScore: 0,
      scoreDistribution: {}
    };
  }
}
