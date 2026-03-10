import { useHasChosenLog } from "./store/store";
import { Box, Card, Heading, Loader } from "@chakra-ui/react";
import { LogViewerHeader } from "./Viewer/Header/LogViewerHeader";
import { LogFileViewerControls } from "./SourceManager/LogFileViewerControls";
import { NoData } from "@/components/NoData";
import { LogListBox } from "./SourceManager/LogSourceManager";
import { useQuery } from "@tanstack/react-query";
import { getLoglist, QK } from "@/api";
import { ErrorInformer } from "@/components/ErrorInformer";
import { CanAccess } from "@/CanAccess";
import { DownloadAllLogsButton } from "./SourceManager/DownloadAllLogsButton";
import { LogViewerBody } from "./Viewer/LogViewerBody";

function LogPage() {
    const hasChosenLog = useHasChosenLog();

    return (
        <Card.Root
            size={"sm"}
            h={"100%"}
            border={"none"}
            bg={"transparent"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{ _open: "scale-fade-in" }}
        >
            <Card.Header>
                {hasChosenLog ? (
                    <LogViewerHeader />
                ) : (
                    <Heading>Выберите файл</Heading>
                )}
            </Card.Header>
            <Card.Body gap={"2"} overflow={"hidden"} minH={0}>
                {hasChosenLog ? <LogViewerBody /> : <LogFiles />}
            </Card.Body>
            <Card.Footer>
                {!hasChosenLog && (
                    <CanAccess right={"logs.download"}>
                        <DownloadAllLogsButton />
                    </CanAccess>
                )}
            </Card.Footer>
        </Card.Root>
    );

    //return hasChosenLog ? <LogViewer /> : <LogSourceManager />;
}

export default LogPage;

const LogFiles = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: QK.logs,
        queryFn: getLoglist,
    });

    if (isLoading) return <Loader text={"Загрузка данных"} />;
    if (isError) return <ErrorInformer error={error} />;

    return (
        <>
            <LogFileViewerControls />
            <Box flex={1} minH={0}>
                {data?.data?.length > 0 ? (
                    <LogListBox data={data.data} />
                ) : (
                    <NoData />
                )}
            </Box>
        </>
    );
};
