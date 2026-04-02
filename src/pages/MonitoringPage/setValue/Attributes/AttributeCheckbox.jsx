import { Checkbox, HStack, Icon, IconButton, Popover } from "@chakra-ui/react";
import { LuInfo } from "react-icons/lu";

export const AttributeCheckbox = ({ attr, mode }) => {
    const isDisabled = mode === "manual";
    return (
        <HStack align={"center"} justify={"start"}>
            {attr?.icon?.as && <Icon size={"md"} {...attr.icon} aria-hidden />}
            <Checkbox.Root value={attr.name} size={"md"} disabled={isDisabled}>
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>
                    {attr.label} {attr.short && `(${attr.short})`}
                </Checkbox.Label>
            </Checkbox.Root>
            <Popover.Root size={"xs"} lazyMount unmountOnExit>
                <Popover.Trigger asChild>
                    <IconButton
                        size={"3xs"}
                        rounded={"full"}
                        variant={"ghost"}
                        aria-label={`Подробнее об атрибуте "${attr.label}"`}
                    >
                        <LuInfo />
                    </IconButton>
                </Popover.Trigger>
                <Popover.Positioner>
                    <Popover.Content>
                        <Popover.Body>{attr.description}</Popover.Body>
                    </Popover.Content>
                </Popover.Positioner>
            </Popover.Root>
        </HStack>
    );
};
