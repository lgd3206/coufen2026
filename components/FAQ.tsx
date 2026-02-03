import styles from './FAQ.module.css';

export default function FAQ() {
  const faqs = [
    {
      question: '什么是芝麻分凑分？',
      answer: '芝麻分凑分是支付宝推出的一项活动，三个用户的芝麻分相加正好等于2026分，就可以获得奖励。本站提供智能匹配服务，帮助用户快速找到合适的队友。'
    },
    {
      question: '为什么要三人分数相加等于2026？',
      answer: '2026是支付宝设定的目标分数，代表2026年。只有三人分数相加正好等于2026分，才能成功凑分并获得奖励。'
    },
    {
      question: '我的芝麻分不在650-800之间怎么办？',
      answer: '很抱歉，支付宝规定只有芝麻分在650-800之间的用户才能参与凑分活动。如果你的分数不在这个范围内，暂时无法参与。'
    },
    {
      question: '"找队伍"和"组队伍"有什么区别？',
      answer: '找队伍：你一个人，需要找两个队友（三人凑分）。组队伍：你们已经有两个人了，只需要找一个队友（三人凑分）。系统会优先匹配"组队伍"模式的用户。'
    },
    {
      question: '提交后多久能匹配成功？',
      answer: '匹配时间取决于当前等待队列中的用户数量和分数分布。通常情况下，几分钟内就能匹配成功。如果长时间未匹配，可能是因为暂时没有合适的分数组合。'
    },
    {
      question: '匹配成功后怎么操作？',
      answer: '匹配成功后，系统会显示匹配到的其他用户的口令。你需要在支付宝中使用这些口令完成凑分操作。具体步骤请参考支付宝的凑分说明。'
    },
    {
      question: '为什么我提交后没有立即匹配？',
      answer: '系统需要找到分数相加正好等于2026的三个用户。如果当前队列中没有合适的组合，你需要等待其他用户加入。建议选择"组队伍"模式，匹配速度会更快。'
    },
    {
      question: '我可以重复提交吗？',
      answer: '可以，但建议等待一段时间后再重新提交。频繁提交可能会影响匹配效率。'
    },
    {
      question: '这个网站安全吗？',
      answer: '本站只收集支付宝公开的口令信息，不涉及任何个人隐私数据。所有数据仅用于匹配算法，不会用于其他用途。'
    },
    {
      question: '使用本站需要付费吗？',
      answer: '完全免费！本站提供的所有服务都是免费的，不收取任何费用。'
    }
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>❓ 常见问题</h2>

      <div className={styles.faqList}>
        {faqs.map((faq, index) => (
          <details key={index} className={styles.faqItem}>
            <summary className={styles.question}>
              {faq.question}
            </summary>
            <div className={styles.answer}>
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
