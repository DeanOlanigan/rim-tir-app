import { createListCollection, Portal, Select, Table } from "@chakra-ui/react";

const Roles = createListCollection({
    items: [
        { label: "Админ", value: "Админ" },
        { label: "Водолаз", value: "Водолаз" },
        { label: "Работяга", value: "Работяга" },
        { label: "В шоке", value: "В шоке" },
    ],
});

export const RoleSelectorEditor = ({ noPortal = false, data = [] }) => {
    const content = (
        <Select.Positioner>
            <Select.Content>
                {Roles.items.map((value) => (
                    <Select.Item key={value.value} item={value}>
                        {value.label}
                        <Select.ItemIndicator />
                    </Select.Item>
                ))}
            </Select.Content>
        </Select.Positioner>
    );

    return (
        <Table.Cell padding={"4px"} w={"3xs"}>
            <Select.Root
                value={data || []}
                onValueChange={(e) => (data = e)}
                size="xs"
                collection={Roles}
                positioning={{ sameWidth: false }}
                invalid={data.length <= 0}
            >
                <Select.HiddenSelect />
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder="Выберите роль">
                            {data}
                        </Select.ValueText>
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                        <Select.Indicator />
                        <Select.ClearTrigger />
                    </Select.IndicatorGroup>
                </Select.Control>
                {noPortal ? content : <Portal>{content}</Portal>}
            </Select.Root>
        </Table.Cell>
    );
};
