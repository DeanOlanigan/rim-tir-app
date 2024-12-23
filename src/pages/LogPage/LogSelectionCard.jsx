import { Text, Card, Box, Group, AbsoluteCenter, Spinner } from "@chakra-ui/react";
import { RadioCardItem, RadioCardRoot } from "../../components/ui/radio-card";
import PropTypes from "prop-types";
import { useLogContext } from "../../providers/LogProvider/LogContext";

import DownloadAllLogsButton from "./DownloadAllLogsButton";

function LogSelectionCard({ headingText, logList, loading, selectedLog, onSelectLog, onChooseLog }) {
    const { updateLogData } = useLogContext();
    const handleSelect = (log) => {
        onSelectLog(log);
    };

    const formatFileSize = (size) => {
        if (size >= 1073741824) {
            return (size / 1073741824).toFixed(2) + " GB";
        } else if (size >= 1048576) {
            return (size / 1048576).toFixed(2) + " MB";
        } else if (size >= 1024) {
            return (size / 1024).toFixed(2) + " KB";
        } else {
            return size + " B";
        }
    };

    return (
        <Card.Root w={"100%"} shadow={"xl"}>
            <Card.Header>
                <Card.Title>{headingText}</Card.Title>
            </Card.Header>
            <Card.Body position={"relative"}>
                <Box h={"30vh"} overflowY={"auto"} pe="0.5em">
                    {logList && logList.length > 0 ? (
                        <RadioCardRoot 
                            gap={"2"}
                            size={"md"}
                            variant="outline"
                            onValueChange={
                                (log) => {
                                    handleSelect(log.value);
                                    let params = logList.filter((item) => item.name === log.value)[0];
                                    params.type = headingText;
                                    updateLogData({
                                        name: params.name,
                                        size: formatFileSize(params.size),
                                        createdAt: params.created_at,
                                        type: params.type,
                                    });
                                }
                            }
                            onKeyUp={
                                (e) => {
                                    if (e.code === "Enter" || e.code === "Space") {
                                        onChooseLog();
                                    }
                                }
                            }
                            onDoubleClick={
                                () => {
                                    onChooseLog();
                                }
                            }
                            value={selectedLog.type === headingText ? selectedLog.name : null}>
                            <Group attached orientation={"vertical"}>
                                {logList.map((log, index) => (
                                    <RadioCardItem
                                        width={"full"}
                                        key={index}
                                        value={log.name}
                                        label={log.name}
                                        description={`${log.created_at} | ${formatFileSize(log.size)}`}
                                        indicatorPlacement="start"
                                    />
                                ))}
                            </Group>
                        </RadioCardRoot>
                    ) : (
                        loading ? <></> : <Text fontWeight={"medium"} textAlign={"center"} color="tomato">Не найдено</Text>
                    )}
                </Box>
                <AbsoluteCenter display={loading ? "" : "none"}>
                    <Spinner/>
                </AbsoluteCenter>
            </Card.Body>
            <Card.Footer>
                <DownloadAllLogsButton headingText={headingText} loading={loading} />
            </Card.Footer>

        </Card.Root>
    );
}
LogSelectionCard.propTypes = {
    headingText: PropTypes.string,
    logList: PropTypes.array,
    loading: PropTypes.bool,
    selectedLog: PropTypes.object,
    onSelectLog: PropTypes.func,
    onChooseLog: PropTypes.func
};

export default LogSelectionCard;
