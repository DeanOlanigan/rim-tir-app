import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
} from "@/components/ui/menu";
import { Button } from "@chakra-ui/react";
import axios from "axios";
import { toaster } from "@/components/ui/toaster";
import { convertStateToXml } from "@/utils/storeToXml";
import { useVariablesStore } from "@/store/variables-store";
import { useConfigInfoStore } from "@/store/config-info-store";
import { parseXmlToState } from "@/utils/xmlToStore";
import { useValidationStore } from "@/store/validation-store";

export const RouterMenu = () => {
    const state = useVariablesStore.getState();
    const configInfo = useConfigInfoStore.getState().configInfo;
    const errors = useValidationStore((state) => state.errors);
    const hasErrors = Object.keys(errors).length > 0;

    const startHandler = () => {
        axios
            .post("/api/v2/startTir")
            .then(() => {
                toaster.create({
                    title: "Сервер запущен",
                    description: "Сервер успешно запущен",
                    type: "success",
                });
            })
            .catch((err) => {
                toaster.create({
                    title: "Произошла ошибка",
                    description: err.response.data.message,
                    type: "error",
                });
            });
    };

    const stopHandler = () => {
        axios
            .post("/api/v2/stopTir")
            .then(() => {
                toaster.create({
                    title: "Сервер остановлен",
                    description: "Сервер успешно остановлен",
                    type: "success",
                });
            })
            .catch((err) => {
                toaster.create({
                    title: "Произошла ошибка",
                    description: err.response.data.message,
                    type: "error",
                });
            });
    };

    const restartHandler = () => {
        axios
            .post("/api/v2/restartTir")
            .then(() => {
                toaster.create({
                    title: "Сервер перезапущен",
                    description: "Сервер успешно перезапущен",
                    type: "success",
                });
            })
            .catch((err) => {
                toaster.create({
                    title: "Произошла ошибка",
                    description: err.response.data.message,
                    type: "error",
                });
            });
    };

    const sendConfigHandler = () => {
        axios
            .put(
                "/api/v2/uploadConfiguration",
                convertStateToXml(state, configInfo)
            )
            .then((res) => {
                console.log(res);
                toaster.create({
                    title: "Конфигурация отправлена",
                    description: "Конфигурация успешно отправлена",
                    type: "success",
                });
            })
            .catch((err) => {
                toaster.create({
                    title: "Произошла ошибка",
                    description: err.response.data.message,
                    type: "error",
                });
            });
    };

    const getConfigHandler = () => {
        axios
            .get("/api/v2/getConfiguration")
            .then((res) => {
                const { state, configInfo } = parseXmlToState(res.data.data);
                useConfigInfoStore.setState({ configInfo });
                useVariablesStore.setState(state);
                toaster.create({
                    title: "Конфигурация обновлена",
                    description: "Конфигурация успешно обновлена",
                    type: "success",
                });
            })
            .catch((err) => {
                toaster.create({
                    title: "Произошла ошибка",
                    description: err.response.data.message,
                    type: "error",
                });
            });
    };

    return (
        <MenuRoot size={"md"}>
            <MenuTrigger asChild>
                <Button
                    variant="subtle"
                    size="2xs"
                    rounded={"md"}
                    shadow={"md"}
                >
                    Роутер
                </Button>
            </MenuTrigger>
            <MenuContent>
                <MenuItem
                    value="new-txt"
                    onClick={sendConfigHandler}
                    disabled={hasErrors}
                >
                    Отправить конфигурацию
                </MenuItem>
                <MenuItem value="new-file" onClick={getConfigHandler}>
                    Обновить конфигурацию
                </MenuItem>
                <MenuItem value="start" onClick={startHandler}>
                    Запустить сервер
                </MenuItem>
                <MenuItem value="stop" onClick={stopHandler}>
                    Остановить сервер
                </MenuItem>
                <MenuItem value="restart" onClick={restartHandler}>
                    Перезапустить сервер
                </MenuItem>
            </MenuContent>
        </MenuRoot>
    );
};
