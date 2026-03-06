import { CanAccess } from "@/CanAccess";
import { useJournalStream } from "@/pages/JournalPage/JournalStores/journal-stream-store";
import { Tooltip } from "../ui/tooltip";
import { Box, Circle, Float, Text } from "@chakra-ui/react";
import { SidebarAction } from "./SidebarButton";
import { LuBadgeAlert } from "react-icons/lu";
import { JOURNAL_DIALOG_ID, journalDialog } from "@/journalDialog";

export const AlertJournal = ({ collapsed }) => {
    const live = useJournalStream((state) => state.live);

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
                    />

                    {live.length > 0 && (
                        <Float placement="top-end" offset={2}>
                            <Circle size="4" bg="red.solid" color="white">
                                <Text fontSize="2xs">{live.length}</Text>
                            </Circle>
                        </Float>
                    )}
                </Box>
            </Tooltip>
        </CanAccess>
    );
};
