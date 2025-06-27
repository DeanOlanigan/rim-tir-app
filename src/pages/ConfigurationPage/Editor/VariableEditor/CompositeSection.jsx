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
import { PARAM_DEFINITIONS } from "@/config/paramDefinitions";
import { validateVisability } from "@/utils/validator";

// TODO Развить идею
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
    const setSettings = useVariablesStore((state) => state.setSettings);
    const settings = useVariablesStore.getState().settings;
    const dep = PARAM_DEFINITIONS[checkedParam];
    if (!dep || dep.hidden) return null; // Если параметр не определен или скрыт, ничего не рендерим
    // Проверяем видимость секции
    const isVisible = validateVisability(dep.dependencies, data.id, settings);
    if (!isVisible) return null; // Если секция не видима, ничего не рендерим
    const isChecked = data.setting?.[checkedParam] ?? false;

    const ParamIcon = dep?.icon;
    return (
        <Card.Root
            size={"sm"}
            w={"100%"}
            h={"100%"}
            border={"none"}
            _hover={{ shadow: "md" }}
            variant="outline"
            onClick={() =>
                setSettings(data.id, {
                    [checkedParam]: !isChecked,
                })
            }
        >
            <Card.Body gap={4}>
                <Float placement={"top-start"} offset={"6"}>
                    <Checkbox.Root
                        checked={isChecked}
                        size={"lg"}
                        variant={"subtle"}
                    >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                    </Checkbox.Root>
                </Float>

                <Box h={"100%"} textAlign={"center"}>
                    {ParamIcon && <Icon fontSize={"3xl"} as={ParamIcon} />}
                    <Text userSelect={"none"} fontWeight={"medium"}>
                        {label}
                    </Text>
                </Box>

                {isChecked && (
                    <SimpleGrid gap={4} columns={2} spacing={2}>
                        {childrenParams.map((key) => (
                            <InputController
                                key={data.id + "_" + key}
                                settingParam={key}
                                nodeId={data.id}
                                value={data.setting?.[key]}
                                Factory={InputFactory}
                                showLabel
                            />
                        ))}
                    </SimpleGrid>
                )}
            </Card.Body>
        </Card.Root>
    );
};
