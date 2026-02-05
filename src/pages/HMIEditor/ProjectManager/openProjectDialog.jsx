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
import { applyProjectData } from "../ProjectOps/applyProjectData";
import { OpenProject } from "../ProjectOps";
import { ProjectCard } from "./ProjectCard";
import { ActionCard } from "./ActionCard";
import { useActionsStore } from "../store/actions-store";
import { useNavigate } from "react-router-dom";
import { useDeleteProjectMutation } from "../mutations";
import { useNodeStore } from "../store/node-store";
import { fit, handleActionWithGuard } from "../utils";

export const OPEN_PROJECT_DIALOG_ID = "OPEN_PROJECT_DIALOG_ID";

export const openProjectDialog = createOverlay((props) => {
    const { onOpenChange, ...rest } = props;

    const navigate = useNavigate();
    const deleteMutation = useDeleteProjectMutation();

    const viewOnlyMode = useActionsStore((state) => state.viewOnlyMode);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["hmiProjects"],
        queryFn: getProjects,
    });

    const handleOpenServerProject = (filename) => {
        handleActionWithGuard(() => {
            navigate(`?project=${filename}`);

            onOpenChange?.({ open: false });
            toaster.create({
                type: "success",
                title: "Проект загружен",
            });
        });
    };

    const handleOpenLocalProject = (projectData, filename) => {
        handleActionWithGuard(() => {
            navigate("/HMIEditor", { replace: true });

            try {
                applyProjectData(projectData, "local", filename);
            } catch (err) {
                console.error("Error applying project data:", err);
                toaster.create({
                    type: "error",
                    title: "Произошла ошибка",
                    description: err?.message ?? "Неизвестная ошибка",
                });
            }
            fit(rest.tools.canvasRef, rest.tools.nodesRef);

            onOpenChange?.({ open: false });
            toaster.create({
                type: "success",
                title: "Проект загружен из локального файла",
            });
        });
    };

    const handleCreateNewProject = () => {
        handleActionWithGuard(() => {
            navigate("/HMIEditor");

            useNodeStore.getState().close();
            fit(rest.tools.canvasRef, rest.tools.nodesRef);

            onOpenChange?.({ open: false });
            toaster.create({
                type: "success",
                title: "Создан новый проект",
            });
        });
    };

    const handleDeleteServerProject = async (filename) => {
        deleteMutation.mutate(filename);
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
