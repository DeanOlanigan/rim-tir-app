import { QK } from "@/api";
import { toaster } from "@/components/ui/toaster";
import { useValidationStore } from "@/store/validation-store";
import { useVariablesStore } from "@/store/variables-store";
import { configuratorConfig } from "@/store/configurator-config";
import { validateAll } from "@/utils/validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageFromError } from "@/utils/utils";
import { authKeys } from "@/api/queryKeys";
import { fetchConfigurationState } from "@/api/services/configuration.services";
import {
    restartSystem,
    startSystem,
    stopSystem,
} from "@/api/routes/system.api";
import { logout } from "@/api/routes/auth.api";
import { uploadConfiguration } from "@/api/routes/configuration.api";

export function useStartTirMutation() {
    return useMutation({
        mutationFn: startSystem,
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
        mutationFn: stopSystem,
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
        mutationFn: restartSystem,
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
        mutationFn: fetchConfigurationState,
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

function isSessionQuery(queryKey) {
    const sessionKey = authKeys.session();
    return (
        queryKey.length === sessionKey.length &&
        queryKey.every((part, index) => part === sessionKey[index])
    );
}

export function useLogoutMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: logout,
        onSuccess: async () => {
            await queryClient.cancelQueries();
            queryClient.setQueryData(authKeys.session(), {
                authenticated: false,
            });
            queryClient.removeQueries({
                predicate: (query) => !isSessionQuery(query.queryKey),
            });
            queryClient.getMutationCache().clear();
        },
    });
}
