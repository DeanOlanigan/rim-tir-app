import { Tooltip } from "../ui/tooltip";

export const SidebarTooltip = ({ collapsed, content, children }) => (
    <Tooltip
        showArrow
        content={content}
        positioning={{ placement: "right" }}
        openDelay={150}
        disabled={!collapsed}
    >
        {children}
    </Tooltip>
);
