import { Link } from 'react-router-dom'
import type { News } from '../model/newsTypes'
import styles from './NewsItem.module.scss'

export const NewsItem = ({ news }: { news: News }) => (
  <Link to={`/news/${news.slug}`} className={styles.item}>
    {news.coverImage && <div className={styles.image}><img src={news.coverImage} alt={news.title} /></div>}
    <div className={styles.content}>
      <time className={styles.date}>{new Date(news.publishedAt ?? news.createdAt).toLocaleDateString('ru-RU')}</time>
      <h3 className={styles.title}>{news.title}</h3>
      <p className={styles.excerpt}>{news.excerpt}</p>
    </div>
  </Link>
)
