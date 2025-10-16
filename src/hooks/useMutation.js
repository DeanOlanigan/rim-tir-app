import {
    getConfiguration,
    restartTir,
    startTir,
    stopTir,
    uploadConfiguration,
    QK,
} from "@/api";
import { toaster } from "@/components/ui/toaster";
import { useValidationStore } from "@/store/validation-store";
import { useVariablesStore } from "@/store/variables-store";
import { configuratorConfig } from "@/utils/configurationParser";
import { validateAll } from "@/utils/validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

function messageFromError(err) {
    if (isAxiosError(err)) return err.response?.data?.message ?? err.message;
    return err.message ?? "Произошла ошибка";
}

export function useStartTirMutation() {
    return useMutation({
        mutationFn: startTir,
        onSuccess: () => {
            toaster.create({
                title: "Сервер запущен",
                description: "Сервер успешно запущен",
                type: "success",
            });
        },
        onError: (err) => {
            toaster.create({
                title: "Произошла ошибка",
                description: messageFromError(err),
                type: "error",
            });
        },
    });
}

export function useStopTirMutation() {
    return useMutation({
        mutationFn: stopTir,
        onSuccess: () => {
            toaster.create({
                title: "Сервер остановлен",
                description: "Сервер успешно остановлен",
                type: "success",
            });
        },
        onError: (err) => {
            toaster.create({
                title: "Произошла ошибка",
                description: messageFromError(err),
                type: "error",
            });
        },
    });
}

export function useRestartTirMutation() {
    return useMutation({
        mutationFn: restartTir,
        onSuccess: () => {
            toaster.create({
                title: "Сервер перезапущен",
                description: "Сервер успешно перезапущен",
                type: "success",
            });
        },
        onError: (err) => {
            toaster.create({
                title: "Произошла ошибка",
                description: messageFromError(err),
                type: "error",
            });
        },
    });
}

export function useUploadConfigurationMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: uploadConfiguration,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: QK.configuration });
            toaster.create({
                title: "Конфигурация отправлена",
                description: "Конфигурация успешно отправлена",
                type: "success",
            });
        },
        onError: (err) => {
            toaster.create({
                title: "Произошла ошибка",
                description: messageFromError(err),
                type: "error",
            });
        },
    });
}

export function useRefreshConfigurationMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: getConfiguration,
        onSuccess: (state) => {
            useVariablesStore.setState(state);
            qc.setQueryData(QK.configuration, state);
            const draft = validateAll(state.settings, configuratorConfig);
            useValidationStore.getState().clearErrors();
            useValidationStore.getState().applyDraft2(draft);
            toaster.create({
                title: "Конфигурация обновлена",
                description: "Конфигурация успешно обновлена",
                type: "success",
            });
        },
        onError: (err) => {
            toaster.create({
                title: "Произошла ошибка",
                description: messageFromError(err),
                type: "error",
            });
        },
    });
}
