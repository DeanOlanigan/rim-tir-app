import { Table } from "@chakra-ui/react";
import { VariablesTableRow } from "./VariablesTableRow";
import { memo } from "react";

export const VariablesTableBody = memo(function VariablesTableBody({ data }) {
    //console.log("RENDER VariablesTableBody");

    return (
        <Table.Body>
            {data.map((element, index) => {
                if (element.type === "folder") return null;
                return (
                    <VariablesTableRow
                        key={index}
                        id={element.id}
                        name={element.name}
                        isSpecial={element.setting.isSpecial}
                        isLua={element.setting.isLua}
                        archive={element.setting.archive}
                        cmd={element.setting.cmd}
                        graph={element.setting.graph}
                        aperture={element.setting.aperture}
                        type={element.setting.type}
                        group={element.setting.group}
                        measurement={element.setting.measurement}
                        luaExpression={element.setting.luaExpression}
                        coefficient={element.setting.coefficient}
                        specialCycleDelay={element.setting.specialCycleDelay}
                        description={element.setting.description}
                    />
                );
            })}
        </Table.Body>
    );
});
