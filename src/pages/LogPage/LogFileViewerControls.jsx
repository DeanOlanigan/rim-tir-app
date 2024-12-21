import { Box, Button, Flex, createListCollection } from "@chakra-ui/react";
import { Tooltip } from "../../components/ui/tooltip";
import { LuDownload, LuEye, LuEyeClosed } from "react-icons/lu";
import { 
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText
} from "../../components/ui/select";
import { useLogContext } from "../../providers/LogProvider/LogContext";
import PropTypes from "prop-types";

function LogFileViewerControls({ selectedLog, loading, onViewBtnClick }) {
    const { logData, updateLogData } = useLogContext();

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
        <Flex direction={"row"} align={"end"} justify={"start"} gap={"2"} >
            <Tooltip
                content={"Скачать все логи"}
            >    
                <Button 
                    size={"xs"}
                    loading={loading}
                    variant="outline">
                    <LuDownload />
                </Button>
            </Tooltip>
            <Box>
                <SelectRoot 
                    collection={rows}
                    value={[logData.rows]}
                    size={"xs"}
                    onValueChange={
                        (e) => updateLogData({ rows: e.value[0] })
                    }
                >
                    <SelectLabel>Количество отображаемых строк:</SelectLabel>
                    <SelectTrigger>
                        <SelectValueText/>
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
            <Tooltip
                content={"Просмотр выбранного файла"}
            >
                <Button 
                    size={"xs"}
                    disabled={!selectedLog.name}
                    variant="outline"
                    onClick={() =>onViewBtnClick(selectedLog)}
                >
                    {
                        selectedLog.name ? <LuEye /> : <LuEyeClosed />
                    }
                </Button>
            </Tooltip>
        </Flex>
    );
}
LogFileViewerControls.propTypes = {
    loading: PropTypes.bool,
    selectedLog: PropTypes.string,
    onViewBtnClick: PropTypes.func
};

export default LogFileViewerControls;
