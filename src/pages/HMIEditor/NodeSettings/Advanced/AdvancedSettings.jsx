import {
    Accordion,
    Button,
    ColorPicker,
    Combobox,
    createListCollection,
    Field,
    Heading,
    HStack,
    IconButton,
    Input,
    parseColor,
    Portal,
    Select,
    Span,
    StackSeparator,
    useFilter,
    useListCollection,
    VStack,
} from "@chakra-ui/react";
import { useAdvancedSettingsUi } from "./store";
import { useState } from "react";
import { useVariables } from "@/pages/GraphsPage/useVariables";
import { LuTrash2 } from "react-icons/lu";

export const AdvancedSettings = () => {
    const { data } = useVariables();
    console.log(data);

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
                    <Accordion.Item value="fill">
                        <Accordion.ItemTrigger>
                            <Span flex={1}>Fill</Span>
                            <Accordion.ItemIndicator />
                        </Accordion.ItemTrigger>
                        <Accordion.ItemContent>
                            <Accordion.ItemBody
                                display={"flex"}
                                flexDirection={"column"}
                                gap={2}
                            >
                                <HStack>
                                    <VariableSelect variables={data} />
                                    <RuleTypeSelect />
                                </HStack>
                                <RulesBlock />
                            </Accordion.ItemBody>
                        </Accordion.ItemContent>
                    </Accordion.Item>
                </Accordion.Root>
            </VStack>
            <VStack align={"start"} w={"100%"}>
                <Heading size={"md"}>Effects</Heading>
                {/* Advanced settings components go here */}
            </VStack>
        </VStack>
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
            <Combobox.Label>Variable</Combobox.Label>
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

const ruleTypes = createListCollection({
    items: [
        { label: "Map", value: "map" },
        { label: "Threshold", value: "threshold" },
        //{ label: "Custom", value: "custom" },
    ],
});

const RuleTypeSelect = () => {
    const ruleType = useAdvancedSettingsUi((state) => state.ruleType);

    return (
        <Select.Root
            size="xs"
            value={[ruleType]}
            onValueChange={(e) =>
                useAdvancedSettingsUi.getState().setRuleType(e.value[0])
            }
            collection={ruleTypes}
            lazyMount
            unmountOnExit
        >
            <Select.HiddenSelect />
            <Select.Label>Rule type</Select.Label>
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder="Select rule type" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content>
                        {ruleTypes.items.map((item) => (
                            <Select.Item
                                key={item.value}
                                item={item}
                                value={item.value}
                            >
                                {item.label}
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
};

const RulesBlock = () => {
    const ruleType = useAdvancedSettingsUi((state) => state.ruleType);
    if (ruleType === "map") return <MapEditor />;
    if (ruleType === "threshold") return <ThresholdEditor />;
    if (ruleType === "custom") return <CustomEditor />;
    return null;
};

const MapEditor = () => {
    const [rules, setRules] = useState([]);

    return (
        <VStack align={"start"} w={"100%"}>
            <HStack w={"100%"}>
                <Heading size={"sm"} w={"100%"}>
                    Map Editor
                </Heading>
                <Button
                    variant={"outline"}
                    size={"xs"}
                    onClick={() => setRules([...rules, { id: Date.now() }])}
                >
                    Add Rule
                </Button>
            </HStack>
            {rules.map((rule) => (
                <HStack key={rule.id} w={"100%"} align={"end"}>
                    <Field.Root w={"120px"}>
                        <Field.Label>Value</Field.Label>
                        <Input size={"xs"} />
                    </Field.Root>
                    <Span>→</Span>
                    <ColorSetter />
                    <IconButton
                        variant={"outline"}
                        size={"xs"}
                        onClick={() =>
                            setRules(rules.filter((r) => r.id !== rule.id))
                        }
                    >
                        <LuTrash2 />
                    </IconButton>
                </HStack>
            ))}
        </VStack>
    );
};

const ThresholdEditor = () => {
    const [rules, setRules] = useState([]);
    return (
        <VStack align={"start"} w={"100%"}>
            <HStack w={"100%"}>
                <Heading size={"sm"} w={"100%"}>
                    Threshold Editor
                </Heading>
                <Button
                    variant={"outline"}
                    size={"xs"}
                    onClick={() => setRules([...rules, { id: Date.now() }])}
                >
                    Add Rule
                </Button>
            </HStack>
        </VStack>
    );
};

const CustomEditor = () => {
    return (
        <VStack align={"start"} w={"100%"}>
            <Heading size={"sm"}>Custom Editor</Heading>
        </VStack>
    );
};

const ColorSetter = () => {
    const [fill, setFill] = useState(parseColor("#ff0000"));

    const handleChangeColor = (fill) => {
        setFill(fill);
    };

    return (
        <ColorPicker.Root
            size={"xs"}
            value={fill}
            onValueChange={(e) => handleChangeColor(e.value)}
            //onValueChangeEnd={(e) => handleChangeColorEnd(e.valueAsString)}
            lazyMount
            unmountOnExit
        >
            <ColorPicker.Label>Color</ColorPicker.Label>
            <ColorPicker.HiddenInput />
            <ColorPicker.Control>
                <ColorPicker.Trigger />
                <ColorPicker.Input />
            </ColorPicker.Control>
            <ColorPicker.Positioner>
                <ColorPicker.Content>
                    <ColorPicker.Area />
                    <ColorPicker.Sliders />
                </ColorPicker.Content>
            </ColorPicker.Positioner>
        </ColorPicker.Root>
    );
};
