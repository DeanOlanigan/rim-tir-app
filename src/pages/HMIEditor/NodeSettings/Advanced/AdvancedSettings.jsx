import {
    AbsoluteCenter,
    Accordion,
    Box,
    Checkbox,
    Combobox,
    Heading,
    HStack,
    Portal,
    Span,
    StackSeparator,
    Switch,
    useFilter,
    useListCollection,
    VStack,
} from "@chakra-ui/react";
import { useAdvancedSettingsUi } from "./store";
import { useVariables } from "@/pages/GraphsPage/useVariables";
import { RuleTypeSelect } from "./RuleTypeSelect";
import { ThresholdEditor } from "./ThresholdEditor";
import { MapEditor } from "./MapEditor";

const PARAMS = [
    { title: "Opacity", type: "number", value: "opacity" },
    { title: "Fill", type: "color", value: "fill" },
    { title: "Stroke", type: "color", value: "stroke" },
    { title: "Stroke Width", type: "number", value: "strokeWidth" },
];

export const AdvancedSettings = ({ api, types, selectedIds }) => {
    const { data } = useVariables();
    console.log({ data, api, types, selectedIds });

    return (
        <VStack
            align={"start"}
            pe={2}
            w={"100%"}
            separator={<StackSeparator borderColor={"colorPalette.solid"} />}
        >
            <VStack align={"start"} w={"100%"}>
                <Heading size={"md"}>Global</Heading>
                <VariableSelect variables={data} />
            </VStack>

            <VStack align={"start"} w={"100%"}>
                <Heading size={"md"}>Bindings</Heading>

                <Accordion.Root collapsible>
                    {PARAMS.map((param) => (
                        <AccordionSettingItem
                            key={param.value}
                            value={param.value}
                            title={param.title}
                            type={param.type}
                            variables={data}
                        />
                    ))}
                </Accordion.Root>
            </VStack>
        </VStack>
    );
};

const AccordionSettingItem = ({ value, title, type, variables }) => {
    return (
        <Accordion.Item value={value}>
            <Box position={"relative"}>
                <Accordion.ItemTrigger>
                    <Accordion.ItemIndicator />
                    <Span flex={"1"}>{title}</Span>
                </Accordion.ItemTrigger>
                <AbsoluteCenter axis={"vertical"} insetEnd={0}>
                    <SettingEnabled />
                </AbsoluteCenter>
            </Box>
            <Accordion.ItemContent>
                <Accordion.ItemBody
                    display={"flex"}
                    flexDirection={"column"}
                    gap={2}
                >
                    <GlobalVariableOverride variables={variables} />
                    <RuleTypeSelect />
                    <RulesBlock type={type} />
                </Accordion.ItemBody>
            </Accordion.ItemContent>
        </Accordion.Item>
    );
};

const GlobalVariableOverride = ({ variables }) => {
    return (
        <HStack>
            <Checkbox.Root>
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>Override</Checkbox.Label>
            </Checkbox.Root>
            <VariableSelect variables={variables} />
        </HStack>
    );
};

const SettingEnabled = () => {
    return (
        <Switch.Root>
            <Switch.HiddenInput />
            <Switch.Control />
            <Switch.Label>Enabled</Switch.Label>
        </Switch.Root>
    );
};

const VariableSelect = ({ variables }) => {
    const { contains } = useFilter({ sensitivity: "base" });

    const { collection, filter } = useListCollection({
        initialItems: variables || [],
        filter: contains,
    });

    return (
        <Combobox.Root
            collection={collection}
            onInputValueChange={(e) => filter(e.inputValue)}
            size={"xs"}
            lazyMount
            unmountOnExit
        >
            {/* <Combobox.Label>Variable</Combobox.Label> */}
            <Combobox.Control>
                <Combobox.Input placeholder="Select variable" />
                <Combobox.IndicatorGroup>
                    <Combobox.ClearTrigger />
                    <Combobox.Trigger />
                </Combobox.IndicatorGroup>
            </Combobox.Control>
            <Portal>
                <Combobox.Positioner>
                    <Combobox.Content>
                        <Combobox.Empty>No items found</Combobox.Empty>
                        {collection.items.map((item) => (
                            <Combobox.Item key={item.value} item={item}>
                                {item.label}
                                <Combobox.ItemIndicator />
                            </Combobox.Item>
                        ))}
                    </Combobox.Content>
                </Combobox.Positioner>
            </Portal>
        </Combobox.Root>
    );
};

const RulesBlock = ({ type }) => {
    const ruleType = useAdvancedSettingsUi((state) => state.ruleType);
    if (ruleType === "map") return <MapEditor type={type} />;
    if (ruleType === "threshold") return <ThresholdEditor type={type} />;
    return null;
};
