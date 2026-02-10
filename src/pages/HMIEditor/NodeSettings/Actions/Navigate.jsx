import {
    createListCollection,
    Field,
    Input,
    Portal,
    Select,
    Stack,
    Tabs,
} from "@chakra-ui/react";
import { useNodeStore } from "../../store/node-store";
import { LOCALE } from "../../constants";

export const Navigate = ({ action, handleChange }) => {
    const mode = action.options.mode || "PAGE";
    const target = action.options.target || "";

    return (
        <Stack gap={2} w={"100%"}>
            <Tabs.Root
                size={"sm"}
                lazyMount
                unmountOnExit
                value={mode}
                onValueChange={(e) => handleChange("mode", e.value)}
            >
                <Tabs.List>
                    <Tabs.Trigger value="PAGE">{LOCALE.page}</Tabs.Trigger>
                    <Tabs.Trigger value="URL">{LOCALE.url}</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="PAGE">
                    <SelectPage target={target} handleChange={handleChange} />
                </Tabs.Content>
                <Tabs.Content value="URL">
                    <Field.Root>
                        <Field.Label fontSize="sm">
                            {LOCALE.urlAddress}
                        </Field.Label>
                        <Input
                            size={"xs"}
                            placeholder="https://example.com"
                            value={target}
                            onChange={(e) =>
                                handleChange("target", e.target.value)
                            }
                            autoComplete="off"
                        />
                    </Field.Root>
                </Tabs.Content>
            </Tabs.Root>
        </Stack>
    );
};

const SelectPage = ({ target, handleChange }) => {
    const pages = useNodeStore((state) => state.pages);
    const collection = createListCollection({
        items: Object.values(pages).map((page) => ({
            label: page.name,
            value: page.id,
            id: page.id,
            type: page.type,
        })),
    });

    return (
        <Select.Root
            size={"xs"}
            lazyMount
            unmountOnExit
            collection={collection}
            value={target ? [target] : []}
            onValueChange={(e) => handleChange("target", e.value[0])}
        >
            <Select.HiddenSelect />
            <Select.Label>{LOCALE.page}</Select.Label>
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder={LOCALE.selectPage} />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content>
                        {collection.items.map((item) => (
                            <Select.Item
                                key={item.value}
                                item={item}
                                value={item.value}
                            >
                                {item.label}{" "}
                                {item.type === "LIBRARY" ? "(Lib)" : ""}
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
};
