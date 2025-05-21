import { Box, Flex, IconButton, createListCollection } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { LuDownload, LuEye, LuEyeClosed } from "react-icons/lu";
import {
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
} from "@/components/ui/select";
import { useLogContext } from "@/providers/LogProvider/LogContext";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function LogFileViewerControls({ isLoading }) {
    const { logData, updateLogData } = useLogContext();
    const navigate = useNavigate();
    console.log("Render LogFileViewerControls");

    const rows = createListCollection({
        items: [
            { label: "100", value: "100" },
            { label: "250", value: "250" },
            { label: "500", value: "500" },
            { label: "1000", value: "1000" },
            { label: "2500", value: "2500" },
            { label: "5000", value: "5000" },
        ],
    });

    return (
        <Flex
            direction={"row"}
            align={"end"}
            justify={"start"}
            gap={"2"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
        >
            <Tooltip content={"Скачать все логи"}>
                <Button
                    hidden
                    shadow={"xl"}
                    size={"xs"}
                    loading={isLoading}
                    variant="outline"
                >
                    <LuDownload />
                </Button>
            </Tooltip>
            <Box>
                <SelectRoot
                    collection={rows}
                    value={[logData.rows]}
                    size={"xs"}
                    onValueChange={(e) => updateLogData({ rows: e.value[0] })}
                >
                    <SelectLabel>Количество отображаемых строк:</SelectLabel>
                    <SelectTrigger shadow={"xl"}>
                        <SelectValueText />
                    </SelectTrigger>
                    <SelectContent>
                        {rows.items.map((row) => (
                            <SelectItem item={row} key={row.value}>
                                {row.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </SelectRoot>
            </Box>
            <Tooltip content={"Просмотр выбранного файла"}>
                <IconButton
                    shadow={"xl"}
                    size={"xs"}
                    disabled={!logData.name}
                    variant="outline"
                    onClick={() => {
                        navigate("/log/viewer");
                    }}
                >
                    {logData.name ? <LuEye /> : <LuEyeClosed />}
                </IconButton>
            </Tooltip>
        </Flex>
    );
}
LogFileViewerControls.propTypes = {
    isLoading: PropTypes.bool,
    selectedLog: PropTypes.object,
    onViewBtnClick: PropTypes.func,
};

export default LogFileViewerControls;
