import { memo } from "react";
import { Stack, HStack } from "@chakra-ui/react";
import { InputFactory } from "../../InputComponents/InputFactory";
import { CompositeSection } from "./CompositeSection";
import { DebouncedEditor } from "../../InputComponents";

export const VariableEditor = memo(function VariableEditor({ data }) {
    return (
        <Stack
            direction={"column"}
            w={"100%"}
            h={"100%"}
            overflow={"visible"}
            px={"1"}
        >
            <HStack align={"start"}>
                <InputFactory
                    type={"enum"}
                    id={data.id}
                    inputParam={"type"}
                    path={data.path}
                    value={data.setting.type}
                    label={"Тип переменной"}
                    showLabel
                />
                <InputFactory
                    type={"textarea"}
                    id={data.id}
                    inputParam={"description"}
                    path={data.path}
                    value={data.setting.description}
                    label={"Описание переменной"}
                    showLabel
                />
            </HStack>
            <HStack w={"100%"} gap={"2"}>
                <CompositeSection
                    checkedParam={"isSpecial"}
                    childrenParams={["specialCycleDelay"]}
                    data={data}
                    label={"Специальная переменная"}
                />
                <CompositeSection
                    checkedParam={"graph"}
                    childrenParams={["measurement", "aperture"]}
                    data={data}
                    label={"График"}
                />
                <CompositeSection
                    checkedParam={"archive"}
                    childrenParams={["group"]}
                    data={data}
                    label={"Архив"}
                />
                <CompositeSection
                    checkedParam={"cmd"}
                    data={data}
                    label={"Команда пользователя"}
                />
            </HStack>
            <DebouncedEditor
                luaExpression={data.setting.luaExpression}
                id={data.id}
                height={300}
            />
        </Stack>
    );
});
