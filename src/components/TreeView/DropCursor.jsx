import { Box } from "@chakra-ui/react";

const placeholderStyle = {
    display: "flex",
    alignItems: "center",
    zIndex: 1,
};

const lineStyle = {
    flex: 1,
    height: "2px",
    bg: "colorPalette.solid",
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
            <Box {...lineStyle} />
        </div>
    );
};
