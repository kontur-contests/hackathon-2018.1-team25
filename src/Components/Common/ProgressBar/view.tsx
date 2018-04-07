import * as React from 'react';
import * as styles from './style.pcss';

export type ProgressBarProps = {
    now: number,
    max: number,
    frontColor: string,
    backColor: string,
}

export default class ProgressBar extends React.Component<ProgressBarProps> {
    render() {
        const {now, max, frontColor, backColor} = this.props;

        return (
            <div className={styles.Bar}>
                <div className={styles.Bar__progressWrapper} style={{
                    borderColor: frontColor,
                    backgroundColor: backColor,
                }}>
                    {now > 0 && max &&
                        <div className={styles.Bar__progress} style={{
                            width: now / max * 100 + '%',
                            backgroundColor: frontColor,
                        }}/>
                    }
                    <div className={styles.Bar__titleWrapper}>
                        <div className={styles.Bar__title}>{now} / {max}</div>
                    </div>
                </div>
            </div>
        )
    }
}