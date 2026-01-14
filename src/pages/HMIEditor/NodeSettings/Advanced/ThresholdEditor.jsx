import {
    createListCollection,
    Heading,
    HStack,
    IconButton,
    Input,
    Portal,
    Select,
    VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { ParamSet } from "./ParamSet";

const thresholdRange = createListCollection({
    items: [
        { label: "lt", value: "below" },
        { label: "gt", value: "above" },
        { label: "Between", value: "between" },
    ],
});

const ThresholdRangeSelector = ({ range, setRange }) => {
    return (
        <Select.Root
            size="xs"
            width={"180px"}
            value={[range]}
            onValueChange={(e) => setRange(e.value[0])}
            collection={thresholdRange}
            lazyMount
            unmountOnExit
        >
            <Select.HiddenSelect />
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder="Select type" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content>
                        {thresholdRange.items.map((item) => (
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

export const ThresholdEditor = ({ type }) => {
    const [rules, setRules] = useState([]);
    const [range, setRange] = useState("below");

    return (
        <VStack align={"start"} w={"100%"}>
            <HStack w={"100%"}>
                <Heading size={"sm"} w={"100%"}>
                    Threshold Editor
                </Heading>
                <IconButton
                    variant={"outline"}
                    size={"xs"}
                    onClick={() => setRules([...rules, { id: Date.now() }])}
                >
                    <LuPlus />
                </IconButton>
            </HStack>
            {rules.map((rule) => (
                <HStack key={rule.id} w={"100%"}>
                    <ThresholdRangeSelector range={range} setRange={setRange} />
                    <Input w={"120px"} size={"xs"} /> &
                    {range === "between" && <Input w={"120px"} size={"xs"} />}
                    →<ParamSet type={type} />
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
