const placeholderStyle = {
    display: "flex",
    alignItems: "center",
    zIndex: 1,
};

const lineStyle = {
    flex: 1,
    height: "2px",
    background: "white",
    borderRadius: "1px",
};

export const DropCursor = ({ top, left, indent }) => {
    const style = {
        left: left + "px",
        top: top - 2 + "px",
        right: indent + "px",
        pointerEvents: "none",
        position: "absolute",
    };

    return (
        <div style={{ ...placeholderStyle, ...style }}>
            <div style={{ ...lineStyle }}></div>
        </div>
    );
};
