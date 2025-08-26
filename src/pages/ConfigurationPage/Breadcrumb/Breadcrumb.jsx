import { Breadcrumb } from "@chakra-ui/react";
import React from "react";
import { collapseBreadcrumbs } from "./collapseBreadcrumbs";

export const EditorBreadcrumb = ({ breadcrumbs, color, maxLength = 8 }) => {
    /* let items = breadcrumbs;

    if (maxLength && breadcrumbs.length > maxLength) {
        items = [
            breadcrumbs[0],
            breadcrumbs[1],
            "ellipsis",
            ...breadcrumbs.slice(-maxLength + 1),
        ];
    } */

    const items = collapseBreadcrumbs(
        breadcrumbs,
        maxLength,
        breadcrumbs.length - 1,
        2
    );

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
