import { NodeToggleBtn } from "./NodeToggleBtn";
import { icons } from "./NodeTypeIcon";
import { IndentLines } from "./IndentLines";
import { Badge } from "./Badge";

export const NodeBase = ({
    isLeaf,
    toggle,
    isOpen,
    paddingLeft,
    id,
    type,
    subType,
    children,
}) => {
    const Icon = icons[type];
    return (
        <>
            <IndentLines paddingLeft={paddingLeft} />
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    width: "100%",
                }}
            >
                {isLeaf ? null : (
                    <NodeToggleBtn toggle={() => toggle()} isOpen={isOpen} />
                )}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        paddingLeft: "0.5rem",
                        textWrap: "nowrap",
                        width: "100%",
                    }}
                >
                    <div>{Icon && <Icon />}</div>
                    <Badge type={subType || type || null} id={id} />
                    {children}
                </div>
            </div>
        </>
    );
};
