import {
    Button,
    Card,
    FileUpload,
    Heading,
    Icon,
    Text,
    Textarea,
    useFileUpload,
    useFileUploadContext,
    VStack,
} from "@chakra-ui/react";
import { useEffect, useReducer, useRef } from "react";
import { LuUpload } from "react-icons/lu";
import { useUpdateMutation } from "./hooks/useUpdateMutation";
import { useUpdatesLogs } from "./hooks/useUpdateLogs";

const MAX_FILES = 1;
const STATUS_TIMEOUT_MS = 2 * 60 * 1000;

const initialState = {
    phase: "idle", // idle | starting | polling | success | error
    logs: [],
    progress: null,
    message: "",
    lastSeenAt: null,
    errorText: "",
};

function formatStartError(err) {
    const status = err?.response?.status;
    const code =
        err?.response?.data?.error?.code ||
        err?.response?.data?.error ||
        err?.code ||
        err?.message ||
        "UNKNOWN";

    return `Ошибка при запуске обновления: ${status ?? ""} ${code}`.trim();
}

function updatesReducer(state, action) {
    switch (action.type) {
        case "START_REQUEST":
            return {
                ...state,
                phase: "starting",
                logs: ["Отправка пакета обновления..."],
                progress: null,
                message: "",
                lastSeenAt: null,
                errorText: "",
            };

        case "START_SUCCESS":
            return {
                ...state,
                phase: "polling",
                logs: [
                    "Отправка пакета обновления...",
                    "Пакет загружен. Ожидание статуса установки...",
                ],
                lastSeenAt: Date.now(),
                errorText: "",
            };

        case "START_ERROR":
            return {
                ...state,
                phase: "error",
                logs: [formatStartError(action.error)],
                errorText: formatStartError(action.error),
            };

        case "STATUS_SUCCESS": {
            const payload = action.payload ?? {};
            const serverPhase = payload.phase;
            const nextLogs = Array.isArray(payload.log)
                ? payload.log
                : state.logs;

            if (serverPhase === "success" || payload.progress === 100) {
                return {
                    ...state,
                    phase: "success",
                    logs: nextLogs,
                    progress: payload.progress ?? 100,
                    message: payload.message ?? "Обновление завершено",
                    lastSeenAt: Date.now(),
                    errorText: "",
                };
            }

            if (serverPhase === "error") {
                return {
                    ...state,
                    phase: "error",
                    logs: nextLogs,
                    progress: payload.progress ?? state.progress,
                    message: payload.message ?? "Ошибка обновления",
                    lastSeenAt: Date.now(),
                    errorText: payload.message ?? "Ошибка обновления",
                };
            }

            return {
                ...state,
                phase: "polling",
                logs: nextLogs,
                progress:
                    typeof payload.progress === "number"
                        ? payload.progress
                        : state.progress,
                message: payload.message ?? state.message,
                lastSeenAt: Date.now(),
                errorText: "",
            };
        }

        case "STATUS_TIMEOUT":
            return {
                ...state,
                phase: "error",
                logs: [
                    ...state.logs,
                    "Ошибка обновления: устройство не отвечало более 5 минут. Возможен выход устройства из строя.",
                ],
                errorText:
                    "Устройство не отвечало более 5 минут. Возможен выход устройства из строя.",
            };

        default:
            return state;
    }
}

const ConditionalDropzone = () => {
    const fileUpload = useFileUploadContext();
    const acceptedFiles = fileUpload.acceptedFiles;

    if (acceptedFiles.length >= MAX_FILES) {
        return null;
    }

    return (
        <FileUpload.Dropzone>
            <Icon size="md" color="fg.muted" as={LuUpload} />
            <FileUpload.DropzoneContent>
                Перетащите файл обновления сюда или кликните по этой области
            </FileUpload.DropzoneContent>
        </FileUpload.Dropzone>
    );
};

export const Updates = () => {
    const [state, dispatch] = useReducer(updatesReducer, initialState);
    const timeoutFiredRef = useRef(false);

    const fileUpload = useFileUpload({
        accept: ".ipk",
        maxFiles: MAX_FILES,
    });

    const selectedFile = fileUpload.acceptedFiles[0] ?? null;
    const startUpdateMutation = useUpdateMutation();

    const pollingEnabled = state.phase === "polling";

    const statusQuery = useUpdatesLogs(pollingEnabled);

    const handleStart = () => {
        if (
            !selectedFile ||
            state.phase === "starting" ||
            state.phase === "polling"
        ) {
            return;
        }

        timeoutFiredRef.current = false;
        dispatch({ type: "START_REQUEST" });

        startUpdateMutation.mutate(
            { file: selectedFile },
            {
                onSuccess: () => {
                    dispatch({ type: "START_SUCCESS" });
                },
                onError: (error) => {
                    dispatch({ type: "START_ERROR", error });
                },
            },
        );
    };

    useEffect(() => {
        if (!pollingEnabled) {
            return;
        }

        if (statusQuery.data) {
            dispatch({ type: "STATUS_SUCCESS", payload: statusQuery.data });
        }
    }, [pollingEnabled, statusQuery.data]);

    useEffect(() => {
        if (!pollingEnabled) {
            return;
        }

        if (state.phase !== "polling") {
            return;
        }

        if (!state.lastSeenAt) {
            return;
        }

        const id = setInterval(() => {
            if (timeoutFiredRef.current) {
                return;
            }

            const elapsed = Date.now() - state.lastSeenAt;
            if (elapsed >= STATUS_TIMEOUT_MS) {
                timeoutFiredRef.current = true;
                dispatch({ type: "STATUS_TIMEOUT" });
            }
        }, 1000);

        return () => clearInterval(id);
    }, [pollingEnabled, state.phase, state.lastSeenAt]);

    useEffect(() => {
        if (state.phase === "success") {
            fileUpload.clearFiles();
        }
    }, [state.phase, fileUpload]);

    const isBusy = state.phase === "starting" || state.phase === "polling";

    return (
        <VStack align={"stretch"}>
            <Heading>Обновления </Heading>
            <Card.Root variant={"elevated"}>
                <Card.Header>
                    <Text fontSize={"lg"} fontWeight="medium">
                        Установка обновлений
                    </Text>
                </Card.Header>
                <Card.Body>
                    <Textarea
                        value={state.logs.join("\n") || ""}
                        variant="subtle"
                        readOnly
                        placeholder="Здесь будет виден процесс установки"
                        fontWeight={"500"}
                        autoresize
                        maxH="xl"
                    />
                    <FileUpload.RootProvider
                        value={fileUpload}
                        paddingTop="3"
                        w="100%"
                        alignItems="stretch"
                    >
                        <FileUpload.HiddenInput />
                        {!isBusy && <ConditionalDropzone />}
                        <FileUpload.List clearable={!isBusy} />
                    </FileUpload.RootProvider>
                </Card.Body>
                <Card.Footer>
                    <Button
                        size={"xs"}
                        disabled={!selectedFile || isBusy}
                        loading={isBusy}
                        loadingText={
                            state.phase === "starting"
                                ? "Запуск..."
                                : "Ожидание..."
                        }
                        onClick={handleStart}
                    >
                        {selectedFile
                            ? "Начать обновление"
                            : "Выберите файл обновления"}
                    </Button>
                </Card.Footer>
            </Card.Root>
        </VStack>
    );
};
