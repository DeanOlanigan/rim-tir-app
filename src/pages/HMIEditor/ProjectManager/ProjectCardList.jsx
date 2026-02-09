import { useQuery } from "@tanstack/react-query";
import { useActionsStore } from "../store/actions-store";
import { getProjects } from "@/api/hmi";
import { QK } from "@/api";
import { Alert, SimpleGrid, Spinner } from "@chakra-ui/react";
import { ActionCard } from "./ActionCard";
import { LuCloudUpload, LuPlus } from "react-icons/lu";
import { OpenProject } from "../ProjectOps";
import { ProjectCard } from "./ProjectCard";
import { useProjectManager } from "./useProjectManager";

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
            {isError && (
                <Alert.Root status="error">
                    <Alert.Indicator />
                    <Alert.Content>
                        <Alert.Title>Ошибка загрузки проектов</Alert.Title>
                        <Alert.Description>{error.message}</Alert.Description>
                    </Alert.Content>
                </Alert.Root>
            )}
            {isLoading && (
                <Alert.Root
                    borderStartWidth="3px"
                    borderStartColor="colorPalette.600"
                    title="Загрузка проектов"
                >
                    <Alert.Indicator>
                        <Spinner size="sm" />
                    </Alert.Indicator>
                    <Alert.Title>Загрузка проектов</Alert.Title>
                </Alert.Root>
            )}
            <SimpleGrid columns={[1, 2, 3, 4]} gap={4}>
                {!isLoading &&
                    data?.data?.map((project) => (
                        <ProjectCard
                            key={project.value}
                            project={project}
                            onClick={handleOpenServerProject}
                            onDelete={handleDeleteServerProject}
                        />
                    ))}
                <OpenProject onProjectLoad={handleOpenLocalProject}>
                    <ActionCard
                        icon={LuCloudUpload}
                        title={"Открыть с ПК"}
                        subTitle={"Выберите .json файл"}
                    />
                </OpenProject>
                {!viewOnlyMode && (
                    <ActionCard
                        icon={LuPlus}
                        title={"Новый проект"}
                        onClick={handleCreateNewProject}
                    />
                )}
            </SimpleGrid>
        </>
    );
};
