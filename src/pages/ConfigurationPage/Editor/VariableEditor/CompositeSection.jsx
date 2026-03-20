import {
    Box,
    Card,
    Checkbox,
    Float,
    Icon,
    SimpleGrid,
    Text,
} from "@chakra-ui/react";
import { InputController } from "../../InputComponents/InputController";
import { InputFactory } from "../../InputComponents/InputFactory";
import { useVariablesStore } from "@/store/variables-store";
import { iconsMap } from "@/config/icons";
import { validateVisibility } from "@/utils/validation/runners/validateVisibility";
import { configuratorConfig } from "@/store/configurator-config";
import { useAuth } from "@/hooks/useAuth";
import { hasRight } from "@/utils/permissions";

/**
 * props:
 * - checkedParam: string — параметр, который включает секцию (булево значение)
 * - childrenParams: string[] — параметры, которые рендерятся внутри, если checkedParam = true
 * - data: данные по настройкам узла
 * - label: подпись секции
 */
export const CompositeSection = ({
    checkedParam,
    childrenParams = [],
    data,
    label,
}) => {
    const { user } = useAuth();
    const disabled = !hasRight(user, "config.editor");
    const { settings, setSettings } = useVariablesStore.getState();
    const dep =
        configuratorConfig.nodePaths?.[data.path]?.settings[checkedParam];
    if (!dep || dep.hidden) return null; // Если параметр не определен или скрыт, ничего не рендерим

    const isVisible = validateVisibility(dep.visibleIf, data.id, settings);
    if (!isVisible) return null; // Если секция не видима, ничего не рендерим

    const isChecked = data.setting?.[checkedParam] ?? false;

    const ParamIcon = iconsMap[dep?.icon];
    return (
        <Card.Root
            //colorPalette={dep.color}
            size={"sm"}
            w={"100%"}
            h={"100%"}
            _hover={{
                outline: "1px solid",
                outlineColor: "colorPalette.focusRing",
                bg: "colorPalette.subtle",
            }}
            variant="subtle"
            onClick={() => {
                if (disabled) return;
                setSettings(data.id, {
                    [checkedParam]: !isChecked,
                });
            }}
        >
            <Card.Body gap={4}>
                <Float placement={"top-start"} offset={"6"}>
                    <Checkbox.Root
                        disabled={disabled}
                        checked={isChecked}
                        size={"lg"}
                        variant={"subtle"}
                    >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                    </Checkbox.Root>
                </Float>

                <Box h={"100%"} textAlign={"center"}>
                    {ParamIcon && (
                        <Icon
                            fontSize={"3xl"}
                            as={ParamIcon}
                            color={`${dep.color}.500`}
                        />
                    )}
                    <Text userSelect={"none"} fontWeight={"medium"}>
                        {label}
                    </Text>
                </Box>

                <SimpleGrid gap={4} columns={2} spacing={2}>
                    {isChecked &&
                        childrenParams.map((key) => (
                            <InputController
                                key={data.id + "_" + key}
                                settingParam={key}
                                path={data.path}
                                nodeId={data.id}
                                value={data.setting?.[key]}
                                Factory={InputFactory}
                                showLabel
                            />
                        ))}
                </SimpleGrid>
            </Card.Body>
        </Card.Root>
    );
};
