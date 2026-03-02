import {
    Input,
    Box,
    Alert,
    VStack,
    Heading,
    Fieldset,
    Field,
    Button,
    Center,
} from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { LuLogIn } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/api/auth";
import { authKeys } from "@/api/queryKeys";

function LoginForm() {
    return (
        <Center w={"100%"} h={"100%"} bg={"bg.muted"}>
            <Box w={"100%"} maxW={"xs"}>
                <LoginCard />
            </Box>
        </Center>
    );
}

export default LoginForm;

const LoginCard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    const [sharedMessage, setSharedMessage] = useState({
        type: null,
        message: null,
    });

    const from = location.state?.from?.pathname || "/configuration";

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const loginMutation = useMutation({
        mutationFn: ({ username, password }) =>
            login({
                login: username,
                password,
            }),
        onSuccess: async (data) => {
            setSharedMessage({
                type: "success",
                message: "Вход выполнен успешно",
            });

            // Можно сразу положить данные в кэш, чтобы UI не мигал
            queryClient.setQueryData(authKeys.session(), {
                authenticated: true,
                user: data.user,
            });

            // И затем подтянуть актуальную сессию с сервера
            await queryClient.refetchQueries({
                queryKey: authKeys.session(),
                exact: true,
            });

            navigate(from, { replace: true });
        },
        onError: (error) => {
            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Не удалось выполнить вход";

            setSharedMessage({
                type: "error",
                message,
            });
        },
    });

    const onSubmit = (data) => {
        setSharedMessage({ type: null, message: null });
        loginMutation.mutate(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Fieldset.Root size={"lg"}>
                <VStack>
                    <Fieldset.Legend>
                        <Heading size={"3xl"}>РиМ-ТИР</Heading>
                    </Fieldset.Legend>
                    <Fieldset.HelperText fontSize={"md"} fontWeight={"medium"}>
                        Введите логин и пароль
                    </Fieldset.HelperText>
                </VStack>
                <Fieldset.Content>
                    <Field.Root required invalid={!!errors.username}>
                        <Field.Label>Логин</Field.Label>
                        <Input
                            autoComplete="off"
                            {...register("username", {
                                required: "Вы должны ввести логин",
                            })}
                        />
                        {errors.username && (
                            <Field.ErrorText>
                                {errors.username.message}
                            </Field.ErrorText>
                        )}
                    </Field.Root>
                    <Field.Root required invalid={!!errors.password}>
                        <Field.Label>Пароль</Field.Label>
                        <PasswordInput
                            {...register("password", {
                                required: "Вы должны ввести пароль",
                            })}
                        />
                        {errors.password && (
                            <Field.ErrorText>
                                {errors.password.message}
                            </Field.ErrorText>
                        )}
                    </Field.Root>
                </Fieldset.Content>
                <Button
                    loading={loginMutation.isPending}
                    size={"xs"}
                    type="submit"
                >
                    <LuLogIn />
                    Войти
                </Button>
                <Box h={"50px"}>
                    {sharedMessage.type && (
                        <Alert.Root
                            status={sharedMessage.type}
                            data-state={"open"}
                            animationDuration={"slow"}
                            animationStyle={{
                                _open: "scale-fade-in",
                            }}
                        >
                            <Alert.Indicator />
                            <Alert.Title>{sharedMessage.message}</Alert.Title>
                        </Alert.Root>
                    )}
                </Box>
            </Fieldset.Root>
        </form>
    );
};
