'use client';

import { useEffect, useState } from 'react';
import { supabase, Submission } from '@/lib/supabase';
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

  return (
    <div className={`${styles.card} ${isMatched ? styles.cardMatched : ''}`}>
      <div className={styles.cardHeader}>
        <div className={styles.cardScore}>
          <span className={styles.scoreValue}>{submission.score}</span>
          <span className={styles.scoreLabel}>分</span>
        </div>
        <div className={styles.cardBadges}>
          {submission.mode === 'solo' ? (
            <span className={styles.badge + ' ' + styles.badgeSolo}>👤 找队伍</span>
          ) : (
            <span className={styles.badge + ' ' + styles.badgeDuo}>👥 组队伍</span>
          )}
          {isMatched && <span className={styles.badge + ' ' + styles.badgeSuccess}>✓ 已匹配</span>}
          {isPending && <span className={styles.badge + ' ' + styles.badgePending}>⏳ 等待中</span>}
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardInfo}>
          <span className={styles.infoLabel}>缺口：</span>
          <span className={styles.infoValue}>{gap} 分</span>
        </div>
        <div className={styles.cardInfo}>
          <span className={styles.infoLabel}>口令：</span>
          <span className={styles.infoValue + ' ' + styles.code}>{submission.code}</span>
        </div>
        <div className={styles.cardInfo}>
          <span className={styles.infoLabel}>时间：</span>
          <span className={styles.infoValue}>
            {new Date(submission.created_at).toLocaleString('zh-CN')}
          </span>
        </div>
      </div>
    </div>
  );
}
