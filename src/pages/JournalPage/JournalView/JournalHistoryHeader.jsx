import { CanAccess } from "@/CanAccess";
import { Field, HStack, IconButton, Input } from "@chakra-ui/react";
import { LuCheck, LuDownload } from "react-icons/lu";

export const JournalHistoryHeader = () => {
    return (
        <HStack justifyContent={"space-between"}>
            <HStack>
                <CanAccess right={"journal.download"}>
                    <IconButton variant={"outline"} size={"xs"}>
                        <LuDownload />
                    </IconButton>
                </CanAccess>
            </HStack>
            <HStack>
                <Field.Root orientation="horizontal">
                    <Field.Label fontSize="sm">От</Field.Label>
                    <Input size={"xs"} autoComplete="off" />
                </Field.Root>
                <Field.Root orientation="horizontal">
                    <Field.Label fontSize="sm">До</Field.Label>
                    <Input size={"xs"} autoComplete="off" />
                </Field.Root>
                <IconButton variant={"outline"} size={"xs"}>
                    <LuCheck />
                </IconButton>
            </HStack>
        </HStack>
    );
};
