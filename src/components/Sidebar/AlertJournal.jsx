import { CanAccess } from "@/CanAccess";
import { useJournalStream } from "@/pages/JournalPage/JournalStores/journal-stream-store";
import { Tooltip } from "../ui/tooltip";
import { Badge, Box, Float, Text } from "@chakra-ui/react";
import { SidebarAction } from "./SidebarButton";
import { LuBadgeAlert } from "react-icons/lu";
import { JOURNAL_DIALOG_ID, journalDialog } from "@/journalDialog";

function getJournalTooltip({
    newCount,
    unackedCount,
    unackedAlarmCount,
    unackedWarningCount,
    unackedInfoCount,
}) {
    if (unackedAlarmCount > 0) {
        return `Неквитированных аварий: ${unackedAlarmCount}`;
    }

    if (unackedWarningCount > 0) {
        return `Неквитированных предупреждений: ${unackedWarningCount}`;
    }

    if (unackedInfoCount > 0) {
        return `Неквитированных событий: ${unackedInfoCount}`;
    }

    if (unackedCount > 0) {
        return `Неквитированных событий: ${unackedCount}`;
    }

    if (newCount > 0) {
        return `Новых событий: ${newCount}`;
    }

    return "Журнал тревог";
}

function getJournalAnimation(meta) {
    if (meta.unackedAlarmCount > 0) {
        return "redBlink";
    }

    if (meta.unackedWarningCount > 0) {
        return "orangeBlink";
    }

    if (meta.unackedInfoCount > 0) {
        return "blueBlink";
    }

    return undefined;
}

export const AlertJournal = ({ collapsed }) => {
    const meta = useJournalStream((state) => state.meta);
    const openJournal = useJournalStream((state) => state.openJournal);

    const tooltipText = getJournalTooltip(meta);
    const animationStyle = getJournalAnimation(meta);

    return (
        <CanAccess right="journal.view">
            <Tooltip
                showArrow
                content={tooltipText}
                positioning={{ placement: "right" }}
                openDelay={150}
                disabled={!collapsed}
            >
                <Box position="relative" w={!collapsed && "full"}>
                    <SidebarAction
                        icon={LuBadgeAlert}
                        label={"Журнал тревог"}
                        isActive={false}
                        collapsed={collapsed}
                        onClick={() => {
                            openJournal();
                            journalDialog.open(JOURNAL_DIALOG_ID);
                        }}
                        animationStyle={animationStyle}
                    />

                    {meta.newCount > 0 && (
                        <Float placement="top-end" offset={2}>
                            <Badge
                                size={"xs"}
                                variant={"solid"}
                                borderRadius={"full"}
                            >
                                <Text fontSize="2xs">{meta.newCount}</Text>
                            </Badge>
                        </Float>
                    )}
                </Box>
            </Tooltip>
        </CanAccess>
    );
};
