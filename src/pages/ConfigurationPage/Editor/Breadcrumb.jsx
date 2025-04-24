import { Breadcrumb } from "@chakra-ui/react";
import { useVariablesStore } from "../../../store/variables-store";
import React from "react";

const getBreadcrumb = (selectedData, settings) => {
    const arr = [
        selectedData.type === "dataObject"
            ? selectedData.id.slice(0, 8)
            : selectedData.name,
    ];
    const recurse = (node) => {
        if (node.parentId) {
            arr.unshift(settings[node.parentId].name);
            recurse(settings[node.parentId]);
        }
    };
    recurse(selectedData);
    return arr;
};

export const EditorBreadcrumb = ({ data }) => {
    const settings = useVariablesStore((state) => state.settings);
    const breadcrumbs = getBreadcrumb(data, settings);

    return (
        <Breadcrumb.Root>
            <Breadcrumb.List>
                {breadcrumbs.map((item, index) => (
                    <React.Fragment key={index}>
                        <Breadcrumb.Item>{item}</Breadcrumb.Item>
                        {index < breadcrumbs.length - 1 && (
                            <Breadcrumb.Separator />
                        )}
                    </React.Fragment>
                ))}
            </Breadcrumb.List>
        </Breadcrumb.Root>
    );
};
