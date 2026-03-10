import { CanAccess } from "@/CanAccess";
import { useJournalStream } from "@/pages/JournalPage/JournalStores/journal-stream-store";
import { Tooltip } from "../ui/tooltip";
import { Badge, Box, Float, Text } from "@chakra-ui/react";
import { SidebarAction } from "./SidebarButton";
import { LuBadgeAlert } from "react-icons/lu";
import { JOURNAL_DIALOG_ID, journalDialog } from "@/journalDialog";

export const AlertJournal = ({ collapsed }) => {
    const live = useJournalStream((state) => state.live);
    const paused = useJournalStream((state) => state.pausedData);

    const count = live.length + paused.length;

    return (
        <CanAccess right="journal.view">
            <Tooltip
                showArrow
                content="Журнал тревог"
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
                        onClick={() => journalDialog.open(JOURNAL_DIALOG_ID)}
                        animationStyle={
                            count > 0 ? "emergencyBlink" : undefined
                        }
                    />

                    {(live.length > 0 || paused.length > 0) && (
                        <Float placement="top-end" offset={2}>
                            <Badge
                                size={"xs"}
                                variant={"solid"}
                                borderRadius={"full"}
                            >
                                <Text fontSize="2xs">{count}</Text>
                            </Badge>
                        </Float>
                    )}
                </Box>
            </Tooltip>
        </CanAccess>
    );
};
