import {
    Card,
    AbsoluteCenter,
    Icon,
    Text,
    Kbd,
    HStack,
    VStack,
    Menu,
    Portal,
} from "@chakra-ui/react";
import { TreeView } from "../Tree/TreeView";
import { TreeCardTitle } from "./Title";
import { useRef, useState, memo } from "react";
import { LuBadgePlus } from "react-icons/lu";
import { useContextMenuStore } from "../../../store/contextMenu-store";
import { menuConfig } from "../../../config/contextMenu";

export const TreeCard = memo(function TreeCard({ data = [], treeType }) {
    console.log("RENDER VariableCard", treeType);
    const [isHovered, setIsHovered] = useState(false);

    const variableTreeRef = useRef(null);

    return (
        <Card.Root
            size={"sm"}
            h={"100%"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Card.Header>
                <Card.Title>
                    <TreeCardTitle
                        type={treeType}
                        isHovered={isHovered}
                        variableTreeRef={variableTreeRef}
                    />
                </Card.Title>
            </Card.Header>
            <Menu.Root lazyMount unmountOnExit>
                <Menu.ContextTrigger asChild>
                    <Card.Body
                        px={"0"}
                        position={"relative"}
                        overflow={"hidden"}
                    >
                        {data.length === 0 && <EmptyCard />}
                        <TreeView
                            ref={variableTreeRef}
                            data={data}
                            treeType={treeType}
                        />
                    </Card.Body>
                </Menu.ContextTrigger>
                <ContextMenuList />
            </Menu.Root>
        </Card.Root>
    );
});

const EmptyCard = () => {
    return (
        <AbsoluteCenter>
            <VStack w={"100%"}>
                <Icon fontSize={"164px"} color={"bg.muted"}>
                    <LuBadgePlus />
                </Icon>
                <HStack>
                    <Text color={"fg.subtle"} fontWeight={"medium"}>
                        Открыть контекстное меню
                    </Text>
                    <Kbd>ПКМ</Kbd>
                </HStack>
            </VStack>
        </AbsoluteCenter>
    );
};

const ContextMenuList = () => {
    const context = useContextMenuStore((state) => state.context);
    const { apiPath, type, subType, treeType } = context;
    const focusedNodeType = subType || type || "default";

    if (!apiPath) return null;
    const items = menuConfig[treeType][focusedNodeType];
    if (!items) return null;

    return (
        <Portal>
            <Menu.Positioner>
                <Menu.Content>
                    {items.map((item, index) => {
                        if (item.type === "separator") {
                            return <Menu.Separator key={`sep_${index}`} />;
                        }
                        return (
                            <Menu.Item
                                key={item.key}
                                value={item.key}
                                {...item.style}
                                onClick={() => item.action?.(apiPath)}
                            >
                                {item.icon?.()}
                                {item.label}
                            </Menu.Item>
                        );
                    })}
                </Menu.Content>
            </Menu.Positioner>
        </Portal>
    );
};
