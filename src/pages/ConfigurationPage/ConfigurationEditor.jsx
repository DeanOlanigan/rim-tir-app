import {
    Field,
    Flex,
    Input,
} from "@chakra-ui/react";

import { headerMapping } from "../MonitoringPage/mappings";

const renderData = (row) => {
    if (!row) return null;
    return row.map((element) => {
        if (element.children !== null && row.length <= 1) {
            return renderData(element.children);
        }
        return (
            <>
                {
                    Object.keys(element.data.setting).map((key, index) => {
                        return (
                            <Field.Root key={index} flex={"1 1 200px"}>
                                <Field.Label>
                                    {headerMapping[key]}
                                </Field.Label>
                                {/* <Text
                                    wordBreak={"break-all"}
                                    fontSize={"sm"}
                                >
                                    {element.data.setting[key]}
                                </Text> */}
                                <Input defaultValue={element.data.setting[key]} size={"xs"}/>
                            </Field.Root>
                        );
                    })
                }
            </>
        );
    });
};

export const ConfigurationEditor = ({data}) => {
    console.log("Render ConfigurationEditor");
    console.log("ConfigurationEditor data:", data);

    return (
        <Flex
            direction={"row"}
            w={"100%"}
            h={"100%"}
            overflow={"auto"}
            p={"2"}
            gap={"2"}
        >
            { renderData(data) }
        </Flex>
    );
};
