import SubmitForm from '@/components/SubmitForm';
import RealtimeHall from '@/components/RealtimeHall';
import HowToUse from '@/components/HowToUse';
import FAQ from '@/components/FAQ';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      {/* 头部 */}
      <header className={styles.header}>
        <div className="container">
          <h1 className={styles.logo}>
            <span className={styles.logoIcon}>🎯</span>
            芝麻分凑分
          </h1>
          <p className={styles.tagline}>
            智能匹配算法，三人组队凑2026分
          </p>
        </div>
      </header>

      {/* 主要内容 */}
      <main className={styles.main}>
        <div className="container">
          {/* 提交表单区域 */}
          <section className={styles.section}>
            <SubmitForm />
          </section>

          {/* 实时大厅 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>👥</span>
              实时大厅
            </h2>
            <p className={styles.sectionDesc}>
              查看所有正在等待匹配的用户，实时更新
            </p>
            <RealtimeHall />
          </section>

          {/* 使用说明 */}
          <section className={styles.section}>
            <HowToUse />
          </section>

          {/* 常见问题 */}
          <section className={styles.section}>
            <FAQ />
          </section>
        </div>
      </main>

      {/* 页脚 */}
      <footer className={styles.footer}>
        <div className="container">
          <p className={styles.footerText}>
            © 2026 芝麻分凑分 · 免费智能匹配服务
          </p>
          <p className={styles.footerNote}>
            本站仅提供匹配服务，不涉及任何个人隐私数据
          </p>
        </div>
      </footer>
    </div>
  );
}
