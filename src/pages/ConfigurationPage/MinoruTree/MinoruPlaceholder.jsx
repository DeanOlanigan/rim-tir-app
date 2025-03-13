import styles from "./MinoruPlaceholder.module.css";

export const MinoruPlaceholder = (props) => {
    const left = props.depth * 24;
    return <div className={styles.root} style={{ left }}></div>;
};
