export const NodeChooseVar = ({ node }) => {
    return (
        <input
            style={{ background: "red" }}
            autoFocus
            type="text"
            defaultValue={node.data.name}
            onFocus={(e) => e.currentTarget.select()}
            onBlur={(e) => node.submit(e.currentTarget.value)}
            onKeyDown={(e) => {
                if (e.key === "Escape") node.reset();
                if (e.key === "Enter") node.submit(e.currentTarget.value);
            }}
        />
    );
};
