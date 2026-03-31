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
import { authKeys } from "@/api/queryKeys";
import { login } from "@/api/routes/auth.api";
import { isAxiosError } from "axios";
import { ERROR_CODES } from "@/api/errorCodes";

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

            queryClient.clear();
            queryClient.setQueryData(authKeys.session(), {
                authenticated: true,
                user: data.user,
            });

            const from = location.state?.from;
            const redirectTo = from
                ? `${from.pathname || ""}${from.search || ""}${from.hash || ""}`
                : "/configuration";

            navigate(redirectTo, { replace: true });
        },
        onError: (error) => {
            let message = "Не удалось выполнить вход";
            if (isAxiosError(error)) {
                message =
                    ERROR_CODES[error?.response?.data?.error?.code] || message;
            }
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
                            autoComplete="username"
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
                            autoComplete="current-password"
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
