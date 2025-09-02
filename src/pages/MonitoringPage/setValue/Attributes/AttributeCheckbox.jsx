import {
    Checkbox,
    HStack,
    Icon,
    IconButton,
    Popover,
    Portal,
} from "@chakra-ui/react";
import { LuInfo } from "react-icons/lu";

export const AttributeCheckbox = ({ attr, mode }) => {
    const isDisabled =
        (mode === "manual" &&
            (attr.name === "invalid" ||
                attr.name === "manual" ||
                attr.name === "substituted")) ||
        (mode === "edit" &&
            (attr.name === "used" || attr.name === "additionalCalc"));
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
            <Popover.Root size={"xs"}>
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
                <Portal>
                    <Popover.Positioner>
                        <Popover.Content>
                            <Popover.Body>{attr.description}</Popover.Body>
                        </Popover.Content>
                    </Popover.Positioner>
                </Portal>
            </Popover.Root>
        </HStack>
    );
};
