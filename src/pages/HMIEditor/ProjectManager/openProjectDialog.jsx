import { apiv2 } from "@/api/baseUrl";
import { getProjects } from "@/api/hmi";
import {
    CloseButton,
    createOverlay,
    Dialog,
    Portal,
    SimpleGrid,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { LuCloudUpload, LuPlus } from "react-icons/lu";
import { toaster } from "@/components/ui/toaster";
import { useFitToFrame } from "../canvas/hooks/useFitToFrame";
import { applyProjectData } from "../ProjectOps/applyProjectData";
import { useNodeStore } from "../store/node-store";
import { OpenProject } from "../ProjectOps";
import { ProjectCard } from "./ProjectCard";
import { ActionCard } from "./ActionCard";
import { useActionsStore } from "../store/actions-store";

export const OPEN_PROJECT_DIALOG_ID = "OPEN_PROJECT_DIALOG_ID";

export const openProjectDialog = createOverlay((props) => {
    const { onOpenChange, ...rest } = props;

    const viewOnlyMode = useActionsStore((state) => state.viewOnlyMode);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["hmiProjects"],
        queryFn: getProjects,
    });

    const fitToFrame = useFitToFrame(
        rest.tools.canvasRef,
        rest.width,
        rest.height,
        false,
        rest.tools.nodesRef,
    );

    const applyProject = (rawProjectData, successMessage, mode, filename) => {
        console.log(mode, filename);
        applyProjectData(rawProjectData, successMessage, mode, filename);
        fitToFrame();
        onOpenChange?.({ open: false });
    };

    const handleOpenServerProject = async (filename) => {
        try {
            const response = await apiv2.get(`/hmi/project/${filename}`);
            const projectData = response.data.data;
            applyProject(
                projectData,
                `Проект "${filename}" загружен`,
                "server",
                filename,
            );
        } catch (err) {
            console.error("Error loading project from server:", err);
            toaster.create({
                type: "error",
                title: "Не удалось загрузить проект",
                description: err?.message ?? "Неизвестная ошибка",
            });
        }
    };

    const handleOpenLocalProject = (projectData, filename) => {
        applyProject(
            projectData,
            "Проект загружен из локального файла",
            "local",
            filename,
        );
    };

    const handleCreateNewProject = () => {
        useNodeStore.getState().close();

        fitToFrame();

        toaster.create({
            type: "success",
            title: "Создан новый проект",
        });

        onOpenChange?.({ open: false });
    };

    const handleDeleteServerProject = async (filename) => {
        try {
            await apiv2.delete(`/hmi/project/${filename}`);
            toaster.create({
                type: "success",
                title: "Проект удален",
            });
        } catch (err) {
            console.error("Error deleting project from server:", err);
            toaster.create({
                type: "error",
                title: "Не удалось удалить проект",
                description: err?.message ?? "Неизвестная ошибка",
            });
        }
    };

    return (
        <Dialog.Root
            {...rest}
            onOpenChange={onOpenChange}
            size={"lg"}
            placement={"center"}
            lazyMount
            unmountOnExit
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content h={"50vh"}>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size={"xs"} />
                        </Dialog.CloseTrigger>
                        <Dialog.Header>
                            <Dialog.Title>Менеджер проектов</Dialog.Title>
                            <Dialog.Description>
                                {data?.data
                                    ? `${data.data.length} проектов на сервере`
                                    : "Загрузка проектов..."}
                            </Dialog.Description>
                        </Dialog.Header>
                        <Dialog.Body overflowY={"auto"}>
                            <SimpleGrid columns={[1, 2, 3, 4]} gap={4}>
                                {isLoading && <div>Загрузка проектов...</div>}
                                {isError && (
                                    <div>
                                        Ошибка загрузки проектов:{" "}
                                        {error.message}
                                    </div>
                                )}
                                {!isLoading &&
                                    data?.data?.map((project) => (
                                        <ProjectCard
                                            key={project.value}
                                            project={project}
                                            onClick={handleOpenServerProject}
                                            onDelete={handleDeleteServerProject}
                                        />
                                    ))}
                                <OpenProject
                                    onProjectLoad={handleOpenLocalProject}
                                >
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
                        </Dialog.Body>
                        <Dialog.Footer></Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
});
