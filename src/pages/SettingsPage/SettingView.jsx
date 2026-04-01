import { Card, Heading, Skeleton, Stack, VStack } from "@chakra-ui/react";
import { Updates } from "./Update/Updates";
import { UsersView } from "./Users/UsersVeiw";
import { License } from "./License/License";
import { Settings } from "./MainSettings/Settings";
import { CanAccess } from "@/CanAccess";
import { Suspense } from "react";
import { RoleList } from "./Roles/RoleList";
import { RoleEditor } from "./Roles/RoleEditor";

export const SettingView = () => {
    return (
        <Stack
            p={4}
            gap={"3"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
        >
            <Suspense fallback={<Skeleton height="200px" />}>
                <Settings />
            </Suspense>
            <CanAccess right={"security.users.edit"}>
                <UsersView />
            </CanAccess>
            <CanAccess right={"security.roles.edit"}>
                <VStack align={"stretch"}>
                    <Heading>Редактор ролей</Heading>
                    <Card.Root w={"100%"} variant={"elevated"} maxH={"2xl"}>
                        <Card.Body flexDirection={"row"} gap={4}>
                            <RoleList />
                            <RoleEditor />
                        </Card.Body>
                    </Card.Root>
                </VStack>
            </CanAccess>
            <CanAccess right={"system.software_update"}>
                <Updates />
            </CanAccess>
            <CanAccess right={"security.licensing.manage"}>
                <Suspense fallback={<Skeleton height="200px" />}>
                    <License />
                </Suspense>
            </CanAccess>
        </Stack>
    );
};
