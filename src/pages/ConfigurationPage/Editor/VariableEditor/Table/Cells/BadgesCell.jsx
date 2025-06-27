import { useState } from "react";
import {
    Flex,
    IconButton,
    Badge,
    HStack,
    Text,
    Switch,
    Popover,
    Portal,
    Icon,
} from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { LuPencil, LuPencilOff, LuChevronDown } from "react-icons/lu";
import { PARAM_DEFINITIONS } from "@/config/paramDefinitions";
import { InputFactory } from "@/pages/ConfigurationPage/InputComponents/InputFactory";
import { useVariablesStore } from "@/store/variables-store";
import { InputController } from "@/pages/ConfigurationPage/InputComponents/InputController";

const badgesColorMap = {
    cmd: "blue",
    graph: "red",
    isSpecial: "purple",
};

const archiveColorMap = {
    noGroup: "gray",
    warn: "orange",
    danger: "red",
    state: "teal",
};

export const BadgesCell = ({ id, badges }) => {
    const [isEditing, setIsEditing] = useState(false);
    return (
        <Flex gap={"1"}>
            <Flex
                gap={"1"}
                direction={isEditing ? "column" : "row"}
                position={"relative"}
            >
                {Object.keys(badges).map((key, index) => {
                    if (!badges[key].checked && !isEditing) return null;
                    if (isEditing)
                        return (
                            <ParamEditBadge
                                key={index}
                                id={id}
                                target={key}
                                checked={badges[key].checked}
                                parameters={badges[key].parameters}
                            />
                        );
                    return (
                        <ParamBadge
                            key={index}
                            target={key}
                            parameters={badges[key].parameters}
                        />
                    );
                })}
            </Flex>
            <IconButton
                size={"2xs"}
                variant={"outline"}
                borderRadius={"full"}
                onClick={() => setIsEditing((prev) => !prev)}
                opacity={"0"}
                _hover={{
                    colorPalette: "blue",
                }}
                _groupHover={{ opacity: 1 }}
            >
                {isEditing ? <LuPencilOff /> : <LuPencil />}
            </IconButton>
        </Flex>
    );
};

function getBadgeColor(target, parameters) {
    return target === "archive"
        ? archiveColorMap[parameters[0].value] || "gray"
        : badgesColorMap[target] || "gray";
}

function getBadgeLabel(target, parameters) {
    let label;
    if (target === "archive") {
        label =
            PARAM_DEFINITIONS[parameters[0].key].options.items.find(
                (item) => item.value === parameters[0].value
            )?.label || "N/A";
    } else {
        label = PARAM_DEFINITIONS[target]?.label || "N/A";
    }
    return label;
}

const ParamBadge = ({ target, parameters }) => {
    const ParamIcon = PARAM_DEFINITIONS[target]?.icon || null;
    const label = getBadgeLabel(target, parameters);
    const color = getBadgeColor(target, parameters);
    const variant = target === "archive" ? "solid" : "outline";

    return (
        <Tooltip content={label}>
            <Badge
                variant={variant}
                colorPalette={color}
                size={"md"}
                borderRadius={"full"}
                h={"24px"}
            >
                <HStack gap={"2"}>
                    {ParamIcon && <ParamIcon />}
                    {target !== "archive" && (
                        <ParamBadgeInfo parameters={parameters} />
                    )}
                </HStack>
            </Badge>
        </Tooltip>
    );
};

const ParamBadgeInfo = ({ parameters }) => {
    const render = parameters.map((param, index) => {
        const selectOptions = PARAM_DEFINITIONS[param.key]?.options || null;
        let value;
        if (selectOptions) {
            value = selectOptions.items.find(
                (item) => item.value === param.value
            )?.label;
        } else {
            value = param.value;
        }
        return (
            <Text key={index} size={"xs"} truncate>
                {value}
            </Text>
        );
    });
    return <>{render}</>;
};

const ParamEditBadge = ({ id, target, checked, parameters }) => {
    const setSettings = useVariablesStore((state) => state.setSettings);
    const ParamIcon = PARAM_DEFINITIONS[target]?.icon || null;
    //const label = getBadgeLabel(target, parameters);
    const color = checked ? getBadgeColor(target, parameters) : "gray";

    return (
        <Badge
            w={"150px"}
            h={"24px"}
            colorPalette={color}
            variant={checked ? "surface" : "outline"}
            justifyContent={"space-between"}
            borderRadius={"full"}
        >
            <Switch.Root
                size={"sm"}
                checked={checked}
                onCheckedChange={(e) =>
                    setSettings(id, {
                        [target]: !!e.checked,
                    })
                }
                colorPalette={color}
            >
                <Switch.HiddenInput />
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
            </Switch.Root>
            <Flex align={"center"} gap={"1"} overflow={"hidden"}>
                <Icon size={"sm"} as={ParamIcon} />
                <ParamBadgeInfo parameters={parameters} />
            </Flex>
            {parameters.length > 0 ? (
                <ParamEditBadgePopover
                    {...{ id, color, checked, parameters }}
                />
            ) : (
                <div style={{ width: "17px" }}></div>
            )}
        </Badge>
    );
};

const ParamEditBadgePopover = ({ id, color, checked, parameters }) => {
    return (
        <Popover.Root size={"xs"} lazyMount unmountOnExit>
            <Popover.Trigger asChild>
                <IconButton
                    size={"3xs"}
                    variant={"subtle"}
                    colorPalette={color}
                    rounded={"full"}
                    disabled={!checked}
                >
                    <LuChevronDown />
                </IconButton>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content maxW={"250px"}>
                        <Popover.Body>
                            {checked &&
                                parameters.map((param, index) => {
                                    return (
                                        <InputController
                                            key={index}
                                            settingParam={param.key}
                                            nodeId={id}
                                            value={param.value}
                                            Factory={InputFactory}
                                            showLabel
                                            noPortal
                                        />
                                    );
                                })}
                        </Popover.Body>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    );
};
