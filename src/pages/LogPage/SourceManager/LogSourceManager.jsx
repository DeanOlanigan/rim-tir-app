import {
    Box,
    Card,
    Checkmark,
    createListCollection,
    Flex,
    FormatByte,
    HStack,
    IconButton,
    Listbox,
    LocaleProvider,
    StackSeparator,
    Text,
    useListboxContext,
    useListboxItemContext,
} from "@chakra-ui/react";
import { LogFileViewerControls } from "./LogFileViewerControls";
import { useQuery } from "@tanstack/react-query";
import { getLoglist, QK } from "@/api";
import { LuArrowRight } from "react-icons/lu";
import { useLogStore } from "../Store/store";
import { DownloadAllLogsButton } from "./DownloadAllLogsButton";
import { NoData } from "@/components/NoData";
import { ErrorInformer } from "@/components/ErrorInformer";
import { Loader } from "@/components/Loader";

const GROUPS = {
    internal: "Логи во внутренней памяти",
    sd: "Логи во внешней памяти",
};

function LogSourceManager() {
    console.log("Render LogSourceManager");

    const { data, isLoading, isError, error } = useQuery({
        queryKey: QK.logs,
        queryFn: getLoglist,
    });

    if (isLoading) return <Loader text={"Загрузка данных"} />;
    if (isError) return <ErrorInformer error={error} />;

    return (
        <Card.Root
            size={"sm"}
            shadow={"md"}
            h={"100%"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{ _open: "scale-fade-in" }}
        >
            <Card.Header>
                <Card.Title>Выберите файл</Card.Title>
            </Card.Header>
            <Card.Body gap={"2"} minH={0}>
                <LogFileViewerControls />
                <Box flex={1} minH={0}>
                    {data?.data?.length > 0 ? (
                        <LogListBox data={data.data} />
                    ) : (
                        <NoData />
                    )}
                </Box>
            </Card.Body>
            <Card.Footer>
                <DownloadAllLogsButton />
            </Card.Footer>
        </Card.Root>
    );
}

export default LogSourceManager;

const LogListBox = ({ data }) => {
    const logsToDwnl = useLogStore((state) => state.logsToDwnl);
    const { setLogsToDwnl } = useLogStore.getState();
    const collection = createListCollection({
        items: data,
        groupBy: (item) => item.category,
    });

    return (
        <Listbox.Root
            collection={collection}
            selectionMode={"multiple"}
            gap={"0"}
            h={"full"}
            value={logsToDwnl}
            onValueChange={(details) => {
                setLogsToDwnl(details.value);
            }}
        >
            <ListboxHeader collection={collection} />
            <Listbox.Content
                rounded={0}
                divideY="1px"
                flex={1}
                minH={0}
                maxH={"none"}
            >
                {collection.group().map(([category, items]) => (
                    <Listbox.ItemGroup key={category}>
                        <Listbox.ItemGroupLabel asChild>
                            <Text fontWeight={"medium"}>
                                {GROUPS[category]}
                            </Text>
                        </Listbox.ItemGroupLabel>
                        {items.map((item) => (
                            <ListboxItem
                                key={`${item.category}/${item.value}`}
                                item={item}
                            />
                        ))}
                    </Listbox.ItemGroup>
                ))}
            </Listbox.Content>
        </Listbox.Root>
    );
};

const ListboxHeader = ({ collection }) => {
    const listbox = useListboxContext();
    const isAllSelected = listbox.value.length === collection.items.length;
    const isSomeSelected =
        listbox.value.length > 0 &&
        listbox.value.length < collection.items.length;

    const handleSelectAll = () => {
        if (isAllSelected) {
            listbox.setValue([]);
        } else {
            listbox.setValue(collection.items.map((item) => item.value));
        }
    };

    return (
        <Flex
            as="button"
            onClick={handleSelectAll}
            px="3"
            gap="2"
            align="center"
            cursor="pointer"
            borderWidth="1px"
            minH="10"
            mb="-1px"
        >
            <Checkmark
                filled
                size="sm"
                checked={isAllSelected}
                indeterminate={isSomeSelected}
            />
            <Listbox.Label>Выбрать все</Listbox.Label>
        </Flex>
    );
};

const ListboxItemCheckmark = () => {
    const itemState = useListboxItemContext();
    return (
        <Checkmark
            filled
            size="sm"
            checked={itemState.selected}
            disabled={itemState.disabled}
        />
    );
};

const ListboxItem = ({ item }) => {
    const { setChosenLog } = useLogStore.getState();

    const chooseHandle = (e) => {
        e.stopPropagation();
        setChosenLog(item);
    };

    return (
        <Listbox.Item item={item} className="group">
            <ListboxItemCheckmark />
            <Box flex={"1"}>
                <Listbox.ItemText fontWeight={"medium"}>
                    {item.label}
                </Listbox.ItemText>
                <HStack
                    separator={<StackSeparator />}
                    fontSize={"xs"}
                    color={"fg.muted"}
                    mt={"1"}
                >
                    <LocaleProvider locale="ru-RU">
                        <FormatByte value={item.size} />
                    </LocaleProvider>
                    <Text>{new Date(item.mtime).toLocaleString()}</Text>
                </HStack>
            </Box>
            <IconButton
                size={"xs"}
                onClick={chooseHandle}
                opacity={0}
                _groupHover={{ opacity: 1 }}
            >
                <LuArrowRight />
            </IconButton>
        </Listbox.Item>
    );
};
