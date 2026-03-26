import {
    Box,
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
import { LuArrowRight } from "react-icons/lu";
import { useLogStore } from "../store/store";

const GROUPS = {
    internal: "Логи во внутренней памяти",
    sd: "Логи во внешней памяти",
};

export const LogListBox = ({ data }) => {
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
                roundedTop={0}
                roundedBottom={"l2"}
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
            bg={"bg.panel"}
            onClick={handleSelectAll}
            px="3"
            gap="2"
            align="center"
            cursor="pointer"
            borderWidth="1px"
            minH="10"
            mb="-1px"
            roundedTop={"l2"}
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
