'use client';

import { useEffect, useState } from 'react';
import { supabase, Submission } from '@/lib/supabase';
import { getRelativeTime } from '@/lib/parser';
import styles from './RealtimeHall.module.css';

export default function RealtimeHall() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<'all' | 'solo' | 'duo'>('all');
  const [searchScore, setSearchScore] = useState('');
  const [loading, setLoading] = useState(true);

  // 初始加载数据
  useEffect(() => {
    loadSubmissions();
  }, []);

  // 订阅实时更新
  useEffect(() => {
    const channel = supabase
      .channel('submissions')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'submissions' },
        (payload) => {
          setSubmissions((prev) => [payload.new as Submission, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'submissions' },
        (payload) => {
          setSubmissions((prev) =>
            prev.map((s) => (s.id === payload.new.id ? (payload.new as Submission) : s))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 过滤数据
  const filteredSubmissions = submissions.filter((sub) => {
    // 模式过滤
    if (filter !== 'all' && sub.mode !== filter) return false;

    // 分数搜索
    if (searchScore && !sub.score.toString().includes(searchScore)) return false;

    return true;
  });

  // 统计数据
  const stats = {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === 'pending').length,
    matched: submissions.filter((s) => s.status === 'matched').length,
    solo: submissions.filter((s) => s.mode === 'solo').length,
    duo: submissions.filter((s) => s.mode === 'duo').length,
    // 新增：分类统计
    needPeople: submissions.filter((s) => s.status === 'pending' && s.mode === 'duo').length, // 缺人
    findTeam: submissions.filter((s) => s.status === 'pending' && s.mode === 'solo').length,  // 找队伍
    success: submissions.filter((s) => s.status === 'matched').length, // 已配成功
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 统计卡片 */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.total}</div>
          <div className={styles.statLabel}>总提交</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.pending}</div>
          <div className={styles.statLabel}>等待中</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.matched}</div>
          <div className={styles.statLabel}>已匹配</div>
        </div>
      </div>

      {/* 分类统计 */}
      <div className={styles.categoryStats}>
        <div className={styles.categoryStat + ' ' + styles.categoryNeed}>
          <span className={styles.categoryIcon}>🔴</span>
          <span className={styles.categoryLabel}>缺人</span>
          <span className={styles.categoryCount}>{stats.needPeople}</span>
        </div>
        <div className={styles.categoryStat + ' ' + styles.categoryFind}>
          <span className={styles.categoryIcon}>🔵</span>
          <span className={styles.categoryLabel}>找队伍</span>
          <span className={styles.categoryCount}>{stats.findTeam}</span>
        </div>
        <div className={styles.categoryStat + ' ' + styles.categorySuccess}>
          <span className={styles.categoryIcon}>✅</span>
          <span className={styles.categoryLabel}>已配成功</span>
          <span className={styles.categoryCount}>{stats.success}</span>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <button
            onClick={() => setFilter('all')}
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
          >
            全部 ({stats.total})
          </button>
          <button
            onClick={() => setFilter('solo')}
            className={`${styles.filterBtn} ${filter === 'solo' ? styles.active : ''}`}
          >
            👤 找队伍 ({stats.solo})
          </button>
          <button
            onClick={() => setFilter('duo')}
            className={`${styles.filterBtn} ${filter === 'duo' ? styles.active : ''}`}
          >
            👥 组队伍 ({stats.duo})
          </button>
        </div>

        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="搜索分数..."
            value={searchScore}
            onChange={(e) => setSearchScore(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* 提交列表 */}
      <div className={styles.list}>
        {filteredSubmissions.length === 0 ? (
          <div className={styles.empty}>
            <p>暂无数据</p>
          </div>
        ) : (
          filteredSubmissions.map((sub) => (
            <SubmissionCard key={sub.id} submission={sub} />
          ))
        )}
      </div>
    </div>
  );
}

function SubmissionCard({ submission }: { submission: Submission }) {
  const gap = 2026 - submission.score;
  const isMatched = submission.status === 'matched';
  const isPending = submission.status === 'pending';
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // 获取状态标签和颜色
  const getStatusInfo = () => {
    if (isMatched) {
      return { label: '已配成功', icon: '✅', color: 'success' };
    }
    if (submission.mode === 'duo') {
      return { label: '缺人', icon: '🔴', color: 'need' };
    }
    return { label: '找队伍', icon: '🔵', color: 'find' };
  };

  const statusInfo = getStatusInfo();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(submission.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleShare = async () => {
    try {
      // 使用 matched_scores 生成动态分享文案
      let shareText: string;

      if (submission.matched_scores && submission.matched_scores.length === 3) {
        const [score1, score2, score3] = submission.matched_scores;
        shareText = `🎉 芝麻分组队成功！${score1} + ${score2} + ${score3} = 2026\n1分钟就匹配到了，你也来试试\n👉 https://coufen2026.xyz\n#芝麻分组队 #2026`;
      } else {
        // 降级方案：如果没有 matched_scores，使用原来的格式
        shareText = `🎉 芝麻分组队成功！${submission.score} + ? + ? = 2026\n1分钟就匹配到了，你也来试试\n👉 https://coufen2026.xyz\n#芝麻分组队 #2026`;
      }

      if (navigator.share) {
        await navigator.share({
          title: '芝麻分凑分',
          text: shareText,
        });
      } else {
        // 降级方案：复制到剪贴板
        await navigator.clipboard.writeText(shareText);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch (err) {
      console.error('分享失败:', err);
    }
  };

  return (
    <div className={`${styles.card} ${styles['card' + statusInfo.color.charAt(0).toUpperCase() + statusInfo.color.slice(1)]}`}>
      {/* 卡片头部：时间 + 状态标签 */}
      <div className={styles.cardHeader}>
        <div className={styles.timeAndStatus}>
          <span className={styles.time}>{getRelativeTime(submission.created_at)}</span>
          <span className={`${styles.badge} ${styles['badge' + statusInfo.color.charAt(0).toUpperCase() + statusInfo.color.slice(1)]}`}>
            {statusInfo.icon} {statusInfo.label}
          </span>
        </div>
      </div>

      {/* 卡片主体：分数突出显示 */}
      <div className={styles.cardBody}>
        {/* 分数（放大显示） */}
        <div className={styles.scoreSection}>
          <span className={styles.scorePrefix}>有</span>
          <span className={styles.scoreLarge}>{submission.score}</span>
          <span className={styles.scoreSuffix}>分</span>
        </div>

        {/* 缺口信息 */}
        <div className={styles.gapInfo}>
          缺 {gap} 分
        </div>

        {/* 口令和复制按钮 */}
        <div className={styles.codeSection}>
          <button
            className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
            onClick={handleCopy}
            title="复制口令"
          >
            {copied ? '✓ 已复制' : '复制'}
          </button>
          <span className={styles.code}>{submission.code}</span>
        </div>

        {/* 操作按钮（仅在已匹配时显示） */}
        {isMatched && (
          <div className={styles.actionButtons}>
            <button
              className={`${styles.actionBtn} ${styles.shareBtn} ${shared ? styles.shared : ''}`}
              onClick={handleShare}
              title="分享成功"
            >
              {shared ? '✓ 已复制' : '📤 分享'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
