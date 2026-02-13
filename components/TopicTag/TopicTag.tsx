import { SubmissionTopic, TOPICS } from '@/lib/types';
import styles from './TopicTag.module.css';

export default function TopicTag({
    topic,
    label,
}: {
    topic: SubmissionTopic;
    label: string;
}) {
    const topicData = TOPICS.find((t) => t.value === topic);
    const color = topicData?.color || '#7f8c8d';

    return (
        <span
            className={styles.tag}
            style={{
                '--topic-color': color,
                '--topic-bg': `${color}15`,
                '--topic-border': `${color}30`,
            } as React.CSSProperties}
        >
            {label}
        </span>
    );
}
