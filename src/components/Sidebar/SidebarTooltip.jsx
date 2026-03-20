import { Tooltip } from "../ui/tooltip";

export const SidebarTooltip = ({
    collapsed,
    content,
    children,
    id = undefined,
}) => (
    <Tooltip
        showArrow
        ids={{ trigger: id }}
        content={content}
        positioning={{ placement: "right" }}
        openDelay={150}
        disabled={!collapsed}
    >
        {children}
    </Tooltip>
);
