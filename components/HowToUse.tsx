import styles from './HowToUse.module.css';

export default function HowToUse() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📖 使用说明</h2>

      <div className={styles.steps}>
        <div className={styles.step}>
          <div className={styles.stepNumber}>1</div>
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>打开支付宝芝麻分</h3>
            <p className={styles.stepDesc}>
              打开支付宝APP，搜索"芝麻分"，进入芝麻信用页面
            </p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepNumber}>2</div>
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>点击凑分按钮</h3>
            <p className={styles.stepDesc}>
              在芝麻分页面找到"凑分"按钮，点击后会生成一个口令
            </p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepNumber}>3</div>
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>复制口令</h3>
            <p className={styles.stepDesc}>
              复制生成的口令，格式类似：792分 ovNkAfw18BY 复制此消息...
            </p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepNumber}>4</div>
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>粘贴到本站</h3>
            <p className={styles.stepDesc}>
              将口令粘贴到上方的输入框中，选择模式（一个人或两个人）
            </p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepNumber}>5</div>
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>等待匹配</h3>
            <p className={styles.stepDesc}>
              点击"开始匹配"，系统会自动为你找到合适的队友，三人分数相加正好2026分
            </p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepNumber}>6</div>
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>完成凑分</h3>
            <p className={styles.stepDesc}>
              匹配成功后，使用匹配到的口令在支付宝中完成凑分操作
            </p>
          </div>
        </div>
      </div>

      <div className={styles.tips}>
        <h3 className={styles.tipsTitle}>💡 温馨提示</h3>
        <ul className={styles.tipsList}>
          <li>芝麻分必须在 650-800 分之间才能参与凑分</li>
          <li>选择"找队伍"模式：你一个人，需要找两个队友</li>
          <li>选择"组队伍"模式：你们两个人，需要找一个队友</li>
          <li>匹配算法会优先匹配"组队伍"模式的用户</li>
          <li>提交后请耐心等待，系统会自动为你匹配</li>
          <li>匹配成功后，请及时在支付宝中完成凑分</li>
        </ul>
      </div>
    </div>
  );
}
