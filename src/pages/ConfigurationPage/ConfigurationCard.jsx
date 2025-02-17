import { AutoSizer } from "react-virtualized";
import { Card } from "@chakra-ui/react";
import { TreeView } from "./Tree/TreeView";
import { forwardRef } from "react";

export const ConfigurationCard = forwardRef( function ConfigurationCard({ title, data, setSelectedData, selection, onCreate, onRename }, ref) {
    console.log("Render ConfigurationCard");

    return (
        <Card.Root  
            size={"sm"}
            h={"100%"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
        >
            <Card.Header>
                <Card.Title>{title}</Card.Title>
            </Card.Header>
            <Card.Body px={"1"} pb={"1"}>
                <AutoSizer>
                    {({ height, width }) => (
                        <TreeView
                            ref={ref}
                            height={height}
                            width={width}
                            data={data}
                            onSelect={setSelectedData}
                            onCreate={onCreate}
                            selection={selection}
                            onRename={onRename}
                        />
                    )}
                </AutoSizer>
            </Card.Body>
        </Card.Root>
    );
});
