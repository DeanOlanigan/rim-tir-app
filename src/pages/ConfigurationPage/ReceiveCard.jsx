import { AutoSizer } from "react-virtualized";
import { Card } from "@chakra-ui/react";
import { DefaultView } from "../../components/TreeView/DefaultView";
import { TreeView } from "../../components/TreeView/TreeView";
import { config } from "../MonitoringPage/testData";

export const ReceiveCard = ({ setSelectedNode }) => {
    console.log("Render ReceiveCard");

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
                <Card.Title>Передача</Card.Title>
            </Card.Header>
            <Card.Body px={"1"} pb={"1"}>
                {/* <AutoSizer>
                    {({ height, width }) => ( */}
                <TreeView
                    /* height={height}
                    width={width} */
                    data={config.children[1].children}
                    /* MenuItems={<TestMenuItems />} */
                    setNode={setSelectedNode}
                >
                    <DefaultView />
                </TreeView>
                {/* )}
                </AutoSizer> */}
            </Card.Body>
        </Card.Root>
    );
};
