import { Breadcrumb } from "@chakra-ui/react";
import { useVariablesStore } from "@/store/variables-store";
import React from "react";

const getBreadcrumb = (id, settings) => {
    const arr = [];
    let node = settings[id];
    while (node) {
        arr.unshift(
            node.type === "dataObject" ? node.id.slice(0, 8) : node.name
        );
        node = node.parentId ? settings[node.parentId] : null;
    }
    return arr;
};

export const EditorBreadcrumb = ({ id, color, maxLength = 8 }) => {
    const settings = useVariablesStore((state) => state.settings);
    const breadcrumbs = getBreadcrumb(id, settings);

    let items = breadcrumbs;

    if (maxLength && breadcrumbs.length > maxLength) {
        items = [
            breadcrumbs[0],
            breadcrumbs[1],
            "ellipsis",
            ...breadcrumbs.slice(-maxLength + 1),
        ];
    }

    return (
        <Breadcrumb.Root>
            <Breadcrumb.List>
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        {item === "ellipsis" ? (
                            <Breadcrumb.Ellipsis color={color} />
                        ) : (
                            <Breadcrumb.Item color={color}>
                                {item}
                            </Breadcrumb.Item>
                        )}
                        {index < items.length - 1 && (
                            <Breadcrumb.Separator color={color} />
                        )}
                    </React.Fragment>
                ))}
            </Breadcrumb.List>
        </Breadcrumb.Root>
    );
};
