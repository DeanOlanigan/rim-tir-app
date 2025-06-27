import { memo } from "react";
import { Table } from "@chakra-ui/react";
import { initCardsData } from "@/utils/utils";
import { BadgesCell, CodeCell } from "./Cells";
import { InputFactory } from "@/pages/ConfigurationPage/InputComponents/InputFactory";
import { InputController } from "@/pages/ConfigurationPage/InputComponents/InputController";
import { PARENT_NAMES } from "@/config/paramDefinitions";

export const VariablesTableRow = memo(function VariablesTableRow(props) {
    //console.log("RENDER VariablesTableRow");
    const { id, name, setting } = props;
    const { type, luaExpression, description } = setting;
    const badgesData = initCardsData(setting);

    return (
        <Table.Row
            background={"transparent"}
            className="group"
            _hover={{ bg: "bg.muted" }}
        >
            <Table.Cell p={"0.5"}>
                {/* <NameCell id={id} name={name} /> */}
                <InputFactory
                    type={"name"}
                    id={id}
                    inputParam={"name"}
                    value={name}
                    label={PARENT_NAMES[type]}
                />
            </Table.Cell>
            <Table.Cell minW={"155px"} p={"0.5"}>
                <BadgesCell id={id} badges={badgesData} />
            </Table.Cell>
            <Table.Cell minW={"220px"} p={0.5}>
                {/* <TypeCell id={id} type={type} /> */}
                <InputController
                    settingParam={"type"}
                    nodeId={id}
                    value={type}
                    Factory={InputFactory}
                />
            </Table.Cell>
            <Table.Cell p={"0.5"}>
                <CodeCell id={id} code={luaExpression} />
            </Table.Cell>
            <Table.Cell minW={"160px"} p={"0.5"}>
                {/* <DescriptionCell id={id} description={description} /> */}
                <InputController
                    settingParam={"description"}
                    nodeId={id}
                    value={description}
                    Factory={InputFactory}
                />
            </Table.Cell>
        </Table.Row>
    );
});
