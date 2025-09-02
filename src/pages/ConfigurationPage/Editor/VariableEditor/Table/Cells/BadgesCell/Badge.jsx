import { configuratorConfig } from "@/utils/configurationParser";
import {
    HStack,
    Badge as ChakraBadge,
    Icon,
    Text,
    Switch,
    Popover,
    IconButton,
    Portal,
    Box,
} from "@chakra-ui/react";
import { useVariablesStore } from "@/store/variables-store";
import { LuChevronDown } from "react-icons/lu";
import { InputController } from "@/pages/ConfigurationPage/InputComponents/InputController";
import { InputFactory } from "@/pages/ConfigurationPage/InputComponents/InputFactory";
import { validateVisibility } from "@/utils/validation/runners/validateVisibility";

export const Badge = ({ id, param, childrenParams, isEditing }) => {
    const settings = useVariablesStore.getState().settings;
    const paramData =
        configuratorConfig.nodePaths["#/variable"].settings[param];
    const isVisible = validateVisibility(paramData.visibleIf, id, settings);
    if (!isVisible) return null;
    const value = settings[id].setting[param];

    if (!value && !isEditing) return null;

    return (
        <ChakraBadge
            variant={value ? "surface" : "outline"}
            colorPalette={paramData.color}
            size={"sm"}
            borderRadius={"full"}
            h={"24px"}
            title={paramData.label}
            justifyContent={"space-between"}
        >
            {isEditing && (
                <BadgeSwitch
                    color={paramData.color}
                    id={id}
                    param={param}
                    value={value}
                />
            )}
            {paramData.icon && <Icon as={paramData.icon} />}
            {/* {paramData.shortname && (
                        <Text fontSize={"2xs"}>{paramData.shortname}</Text>
                    )} */}
            {childrenParams && (
                <ChildParamViewer
                    params={Object.values(childrenParams).map((param) => ({
                        value: settings[id].setting[param],
                        ...configuratorConfig.nodePaths["#/variable"].settings[
                            param
                        ],
                    }))}
                />
            )}
            <Box>
                {isEditing && childrenParams && (
                    <BadgePopover
                        color={paramData.color}
                        checked={value}
                        parameters={Object.values(childrenParams).map(
                            (param) => ({
                                value: settings[id].setting[param],
                                key: param,
                            })
                        )}
                        id={id}
                    />
                )}
            </Box>
        </ChakraBadge>
    );
};

const BadgeSwitch = ({ color, id, param, value }) => {
    const setSettings = useVariablesStore.getState().setSettings;

    return (
        <Switch.Root
            size={"sm"}
            checked={value}
            onCheckedChange={(e) =>
                setSettings(id, {
                    [param]: !!e.checked,
                })
            }
            colorPalette={color}
        >
            <Switch.HiddenInput />
            <Switch.Control>
                <Switch.Thumb />
            </Switch.Control>
        </Switch.Root>
    );
};

const BadgePopover = ({ color, checked, parameters, id }) => {
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
                                parameters?.map((param, index) => {
                                    return (
                                        <InputController
                                            key={index}
                                            path={"#/variable"}
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

const ChildParamViewer = ({ params }) => {
    return (
        <HStack>
            {params.map((param, index) =>
                param.type === "enum" ? (
                    <ChildEnumViewer key={index} param={param} />
                ) : (
                    param.value
                )
            )}
        </HStack>
    );
};

const ChildEnumViewer = ({ param }) => {
    const choosen = param.enumValues.find(param.value);
    return choosen?.icon ? (
        <Icon as={choosen.icon} color={choosen.color} />
    ) : (
        <Text>{choosen?.label}</Text>
    );
};
