/**
 * 口令解析器
 * 解析支付宝芝麻分口令，提取分数和口令码
 */

export interface ParsedCode {
  score: number;
  code: string;
}

/**
 * 解析口令
 * @param input 用户输入的口令字符串
 * @returns 解析结果或 null（解析失败）
 *
 * 支持的格式：
 * - "792分 ovNkAfw18BY 复制此消息..."
 * - "792分ovNkAfw18BY"
 * - "ovNkAfw18BY 792分"
 */
export function parseCode(input: string): ParsedCode | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  // 清理输入：去除多余空格和换行
  const cleaned = input.trim().replace(/\s+/g, ' ');

  // 匹配格式1: "792分 ovNkAfw18BY" 或 "792分ovNkAfw18BY"
  const match1 = cleaned.match(/(\d{3})分\s*([A-Za-z0-9]+)/);
  if (match1) {
    const score = parseInt(match1[1]);
    const code = match1[2];

    if (isValidScore(score) && isValidCode(code)) {
      return { score, code };
    }
  }

  // 匹配格式2: "ovNkAfw18BY 792分"
  const match2 = cleaned.match(/([A-Za-z0-9]+)\s*(\d{3})分/);
  if (match2) {
    const code = match2[1];
    const score = parseInt(match2[2]);

    if (isValidScore(score) && isValidCode(code)) {
      return { score, code };
    }
  }

  return null;
}

/**
 * 验证分数是否在有效范围内
 * @param score 分数
 * @returns 是否有效
 */
function isValidScore(score: number): boolean {
  return score >= 650 && score <= 800;
}

/**
 * 验证口令码格式
 * @param code 口令码
 * @returns 是否有效
 */
function isValidCode(code: string): boolean {
  // 口令码应该是字母数字组合，长度在6-20之间
  return /^[A-Za-z0-9]{6,20}$/.test(code);
}

/**
 * 格式化口令显示
 * @param parsed 解析后的口令
 * @returns 格式化的字符串
 */
export function formatCode(parsed: ParsedCode): string {
  return `${parsed.score}分 ${parsed.code}`;
}

/**
 * 计算缺口分数
 * @param score 当前分数
 * @returns 还需要的分数
 */
export function calculateGap(score: number): number {
  return 2026 - score;
}

/**
 * 验证三个分数是否能凑成2026
 * @param scores 三个分数数组
 * @returns 是否有效
 */
export function isValidMatch(scores: number[]): boolean {
  if (scores.length !== 3) return false;
  const sum = scores.reduce((a, b) => a + b, 0);
  return sum === 2026;
}
