import { useQuery } from "@tanstack/react-query";
import { useActionsStore } from "../store/actions-store";
import { QK } from "@/api";
import {
    Alert,
    Heading,
    Kbd,
    SimpleGrid,
    Spinner,
    Switch,
    VStack,
} from "@chakra-ui/react";
import { ActionCard } from "./ActionCard";
import { LuCloudUpload, LuPlus } from "react-icons/lu";
import { OpenProject } from "../ProjectOps";
import { ProjectCard } from "./ProjectCard";
import { useProjectManager } from "./useProjectManager";
import { LOCALE } from "../constants";
import { toggleViewOnlyModeAction } from "../actions/toggleViewOnlyModeAction";
import { CanAccess } from "@/CanAccess";
import { getProjects } from "@/api/routes/hmi.api";

export const ProjectCardList = ({ tools, onOpenChange }) => {
    const viewOnlyMode = useActionsStore((state) => state.viewOnlyMode);
    const { data, isLoading, isError, error } = useQuery({
        queryKey: QK.hmiProjects,
        queryFn: getProjects,
    });
    const {
        handleCreateNewProject,
        handleDeleteServerProject,
        handleOpenLocalProject,
        handleOpenServerProject,
    } = useProjectManager(tools, onOpenChange);

    return (
        <>
            <VStack align={"start"}>
                <CanAccess right={"hmi.editor"}>
                    <EditorModeAccess tools={tools} />
                </CanAccess>
                <Heading size={"md"}>Действия</Heading>
                <SimpleGrid columns={[1, 2, 3, 4]} gap={4}>
                    <OpenProject onProjectLoad={handleOpenLocalProject}>
                        <ActionCard
                            icon={LuCloudUpload}
                            title={LOCALE.openFromPC}
                            subTitle={LOCALE.openFromPCDesc}
                        />
                    </OpenProject>
                    <ActionCard
                        icon={LuPlus}
                        title={LOCALE.newProject}
                        disabled={viewOnlyMode}
                        onClick={handleCreateNewProject}
                    />
                </SimpleGrid>
                <Heading size={"md"}>Проекты</Heading>
                {isError && (
                    <Alert.Root status="error">
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>
                                {LOCALE.projectsLoadingError}
                            </Alert.Title>
                            <Alert.Description>
                                {error.message}
                            </Alert.Description>
                        </Alert.Content>
                    </Alert.Root>
                )}
                {isLoading && (
                    <Alert.Root
                        borderStartWidth="3px"
                        borderStartColor="colorPalette.600"
                    >
                        <Alert.Indicator>
                            <Spinner size="sm" />
                        </Alert.Indicator>
                        <Alert.Title>{LOCALE.projectsLoading}</Alert.Title>
                    </Alert.Root>
                )}
                {!isLoading && data?.items?.length === 0 && (
                    <Alert.Root
                        borderStartWidth="3px"
                        borderStartColor="colorPalette.600"
                    >
                        <Alert.Indicator />
                        <Alert.Title>Нет проектов на сервере</Alert.Title>
                    </Alert.Root>
                )}
                <SimpleGrid columns={[1, 2, 3, 4]} gap={4}>
                    {!isLoading &&
                        data?.items?.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onClick={handleOpenServerProject}
                                onDelete={handleDeleteServerProject}
                            />
                        ))}
                </SimpleGrid>
            </VStack>
        </>
    );
};

const EditorModeAccess = ({ tools }) => {
    const viewOnlyMode = useActionsStore((state) => state.viewOnlyMode);

    return (
        <Alert.Root
            borderStartWidth="3px"
            borderStartColor="colorPalette.600"
            size={"sm"}
        >
            <Alert.Indicator />
            <Alert.Content>
                <Alert.Title>
                    Для перехода в режим редактора используйте{" "}
                    <Kbd size={"sm"}>Shift</Kbd>+<Kbd size={"sm"}>V</Kbd>
                </Alert.Title>
            </Alert.Content>
            <Switch.Root
                size={"sm"}
                checked={!viewOnlyMode}
                onCheckedChange={() => toggleViewOnlyModeAction(tools)}
            >
                <Switch.HiddenInput />
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
            </Switch.Root>
        </Alert.Root>
    );
};
