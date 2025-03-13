import styles from "./MinoruCustomNode.module.css";
import { LuChevronRight } from "react-icons/lu";
import { TypeIcon } from "./TypeIcon";

export const MinoruCustomNode = (props) => {
    const indent = props.depth * 10;
    const handleSelect = () => props.onSelect(props.node);
    const handleToggle = (e) => {
        e.stopPropagation();
        props.onToggle(props.node.id);
    };

    return (
        <div
            className={`tree-node ${styles.root} ${
                props.isSelected ? styles.isSelected : ""
            }`}
            style={{ paddingLeft: indent }}
            onClick={handleSelect}
        >
            <div
                className={`${styles.expandIconWrapper} ${
                    props.isOpen ? styles.isOpen : ""
                }`}
                onClick={handleToggle}
            >
                {props.node.droppable && (
                    <div>
                        <LuChevronRight />
                    </div>
                )}
            </div>
            <div>
                <TypeIcon
                    type={props.node.type}
                    droppable={props.node.droppable}
                />
            </div>
            <div className={styles.labelGridItem}>{props.node.text}</div>
        </div>
    );
};
