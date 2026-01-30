import {
    Button,
    Text,
    Flex,
    Box,
    Field,
    Textarea,
    Dialog,
    Portal,
    CloseButton,
    createOverlay,
    Alert,
    InputGroup,
    Span,
    Input,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useVariablesStore } from "@/store/variables-store";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MAX_NAME_LENGTH } from "@/config/constants";
import { useValidationStore } from "@/store/validation-store";
import { useForm } from "react-hook-form";

const configSchema = z.object({
    name: z
        .string()
        .min(4, "Имя должно содержать минимум 4 символа")
        .max(
            MAX_NAME_LENGTH,
            `Имя не должно превышать ${MAX_NAME_LENGTH} символов`,
        ),
    description: z.string().optional(),
});

export const MODE = {
    CREATE: "create",
    EDIT: "edit",
};
export const CONF_INFO_EDIT_DIALOG_ID = "CONF_INFO_EDIT_DIALOG_ID";

export const configurationInfoDialog = createOverlay((props) => {
    const { mode, ...rest } = props;

    const info = useVariablesStore((state) => state.info);
    const updateInfo = useVariablesStore((state) => state.updateInfo);
    const resetState = useVariablesStore((state) => state.resetState);
    const clearErrors = useValidationStore((state) => state.clearErrors);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
        reset,
        watch,
    } = useForm({
        resolver: zodResolver(configSchema),
        defaultValues: {
            name: "",
            description: "",
        },
        mode: "onChange",
    });

    useEffect(() => {
        if (props.open) {
            if (mode === MODE.EDIT) {
                reset({
                    name: info.name || "",
                    description: info.description || "",
                });
            } else {
                reset({
                    name: "",
                    description: "",
                });
            }
        }
    }, [props.open, mode, info, reset]);

    const onSubmit = (data) => {
        if (mode === MODE.CREATE) {
            resetState();
            clearErrors();
            updateInfo(Date.now(), data.name, data.description);
        } else {
            updateInfo(Date.now(), data.name, data.description);
        }
        props.onOpenChange?.({ open: false });
    };

    const currentName = watch("name") || "";
    const title =
        mode === MODE.CREATE
            ? "Новая конфигурация"
            : "Редактирование конфигурации";
    const submitLabel = mode === MODE.CREATE ? "Создать" : "Сохранить";

    return (
        <Dialog.Root {...rest} placement={"center"} lazyMount unmountOnExit>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size={"xs"} />
                        </Dialog.CloseTrigger>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Dialog.Header>
                                <Dialog.Title>{title}</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <Flex gap={"2"} direction={"column"}>
                                    {mode === MODE.CREATE && info.name && (
                                        <Alert.Root status={"warning"}>
                                            <Alert.Indicator />
                                            <Alert.Title>
                                                Сохраните предыдущую
                                                конфигурацию
                                            </Alert.Title>
                                        </Alert.Root>
                                    )}

                                    <Field.Root invalid={!!errors.name}>
                                        <Field.Label>
                                            Имя конфигурации
                                        </Field.Label>
                                        <InputGroup
                                            endElement={
                                                <Span
                                                    color={"fg.muted"}
                                                    textStyle={"xs"}
                                                >
                                                    {currentName.length} /{" "}
                                                    {MAX_NAME_LENGTH}
                                                </Span>
                                            }
                                        >
                                            <Input
                                                size="xs"
                                                placeholder="Имя конфигурации"
                                                pe="4.75em"
                                                maxLength={MAX_NAME_LENGTH}
                                                {...register("name")}
                                            />
                                        </InputGroup>
                                        <Field.ErrorText>
                                            {errors.name?.message}
                                        </Field.ErrorText>
                                        {!errors.name && (
                                            <Field.HelperText>
                                                Минимум 4 символа
                                            </Field.HelperText>
                                        )}
                                    </Field.Root>
                                    <Field.Root invalid={!!errors.description}>
                                        <Field.Label>Описание</Field.Label>
                                        <Textarea
                                            resize={"none"}
                                            rows={5}
                                            size={"xs"}
                                            placeholder="Описание"
                                            {...register("description")}
                                        />
                                        <Field.ErrorText>
                                            {errors.description?.message}
                                        </Field.ErrorText>
                                    </Field.Root>
                                    {mode === MODE.EDIT && (
                                        <Flex justify={"space-between"}>
                                            <Box>
                                                <Text
                                                    fontSize={"sm"}
                                                    color={"fg.muted"}
                                                >
                                                    Дата изменения:
                                                </Text>
                                                <Text fontSize={"md"}>
                                                    {new Date(
                                                        parseInt(info.ts),
                                                    ).toLocaleString()}
                                                </Text>
                                            </Box>
                                        </Flex>
                                    )}
                                </Flex>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Button
                                    type={"submit"}
                                    size={"xs"}
                                    loading={isSubmitting}
                                    disabled={!isValid}
                                >
                                    {submitLabel}
                                </Button>
                                <Dialog.ActionTrigger asChild>
                                    <Button variant="ghost" size={"xs"}>
                                        Отмена
                                    </Button>
                                </Dialog.ActionTrigger>
                            </Dialog.Footer>
                        </form>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
});
