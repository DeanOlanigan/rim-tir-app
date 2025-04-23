import styles from "./TreeView.module.css";
export const IndentLines = ({ paddingLeft }) => {
    const indentSize = Number.parseFloat(`${paddingLeft || 0}`);

    return (
        <div className={styles.indentLines}>
            {new Array(indentSize / 16).fill(0).map((_, index) => {
                return <div key={index}></div>;
            })}
        </div>
    );
};
