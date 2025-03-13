import styles from "./MinoruCustomDragPreview.module.css";

export const MinoruCustomDragPreview = (props) => {
    const item = props.monitorProps.item;

    return (
        <div className={styles.root}>
            <div className={styles.icon}>ICON</div>
            <div className={styles.label}>{item.text}</div>
        </div>
    );
};
