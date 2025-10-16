import { InputController } from "@/pages/ConfigurationPage/InputComponents/InputController";
import { InputFactory } from "@/pages/ConfigurationPage/InputComponents/InputFactory";
import { Table } from "@chakra-ui/react";

export const TableRow = ({ element }) => {
    return (
        <Table.Row className="group">
            {Object.keys(element.setting).map((key) => {
                return (
                    <Table.Cell
                        key={element.id + "_" + key}
                        minW={"150px"}
                        maxW={"150px"}
                        p={"0.5"}
                    >
                        <InputController
                            path={element.path}
                            settingParam={key}
                            nodeId={element.id}
                            value={element.setting[key]}
                            Factory={InputFactory}
                        />
                    </Table.Cell>
                );
            })}
        </Table.Row>
    );
};
