export const NodeEditInput = ({ name, submit, reset }) => {
    return (
        <input
            autoFocus
            type="text"
            defaultValue={name}
            onFocus={(e) => e.currentTarget.select()}
            onBlur={(e) => submit(e.currentTarget.value)}
            onKeyDown={(e) => {
                if (e.key === "Escape") reset();
                if (e.key === "Enter") submit(e.currentTarget.value);
            }}
        />
    );
};
