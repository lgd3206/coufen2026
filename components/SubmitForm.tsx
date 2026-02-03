'use client';

import { useState } from 'react';
import { parseCode } from '@/lib/parser';
import styles from './SubmitForm.module.css';

interface SubmitFormProps {
  onSubmitSuccess?: (data: any) => void;
}

export default function SubmitForm({ onSubmitSuccess }: SubmitFormProps) {
  const [code, setCode] = useState('');
  const [mode, setMode] = useState<'solo' | 'duo'>('solo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 验证口令
    const parsed = parseCode(code);
    if (!parsed) {
      setError('口令格式错误，请检查后重试');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: parsed.code,
          score: parsed.score,
          mode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '提交失败');
      }

      if (data.matched) {
        setSuccess(`🎉 匹配成功！三人分数：${data.scores?.join(' + ')} = 2026`);
        setCode('');
        onSubmitSuccess?.(data);
      } else {
        setSuccess('✅ 提交成功！正在等待匹配...');
        setCode('');
        onSubmitSuccess?.(data);
      }
    } catch (err: any) {
      setError(err.message || '提交失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCode(text);
    } catch (err) {
      setError('无法读取剪贴板，请手动粘贴');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 口令输入 */}
        <div className={styles.inputGroup}>
          <label htmlFor="code" className={styles.label}>
            支付宝口令
          </label>
          <div className={styles.inputWrapper}>
            <textarea
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="粘贴支付宝口令，例如：792分 ovNkAfw18BY 复制此消息..."
              className={styles.textarea}
              rows={3}
              disabled={loading}
            />
            <button
              type="button"
              onClick={handlePaste}
              className={styles.pasteBtn}
              disabled={loading}
            >
              📋 粘贴
            </button>
          </div>
        </div>

        {/* 模式选择 */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>选择模式</label>
          <div className={styles.modeSelector}>
            <button
              type="button"
              onClick={() => setMode('solo')}
              className={`${styles.modeBtn} ${mode === 'solo' ? styles.active : ''}`}
              disabled={loading}
            >
              <span className={styles.modeIcon}>👤</span>
              <span className={styles.modeText}>找队伍</span>
              <span className={styles.modeDesc}>我一个人，找两个队友</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('duo')}
              className={`${styles.modeBtn} ${mode === 'duo' ? styles.active : ''}`}
              disabled={loading}
            >
              <span className={styles.modeIcon}>👥</span>
              <span className={styles.modeText}>组队伍</span>
              <span className={styles.modeDesc}>我们两个人，找一个队友</span>
            </button>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className={styles.alert + ' ' + styles.alertError}>
            {error}
          </div>
        )}

        {/* 成功提示 */}
        {success && (
          <div className={styles.alert + ' ' + styles.alertSuccess}>
            {success}
          </div>
        )}

        {/* 提交按钮 */}
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={loading || !code.trim()}
        >
          {loading ? (
            <>
              <span className={styles.spinner}></span>
              匹配中...
            </>
          ) : (
            <>
              🚀 开始匹配
            </>
          )}
        </button>
      </form>

      {/* 使用提示 */}
      <div className={styles.tips}>
        <h3 className={styles.tipsTitle}>💡 使用提示</h3>
        <ul className={styles.tipsList}>
          <li>打开支付宝，进入芝麻分页面</li>
          <li>点击"凑分"按钮，复制口令</li>
          <li>粘贴口令到上方输入框</li>
          <li>选择模式（一个人或两个人）</li>
          <li>点击"开始匹配"，等待系统自动匹配</li>
        </ul>
      </div>
    </div>
  );
}
