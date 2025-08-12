import { SHA1 } from "crypto-js";
import {
    Input,
    Stack,
    Box,
    Alert,
    Grid,
    Flex,
    VStack,
    Heading,
    Text,
    Fieldset,
    Field,
} from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { LuLogIn } from "react-icons/lu";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/providers/AuthProvider/AuthContext";
import Lightning from "@/components/Lightning/Lightning";

function LoginForm() {
    const { isAuthenticated } = useAuthContext();

    console.log("Render LoginForm; isAuthenticated:", isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/configuration" replace />;
    }

    return (
        <Grid minH={"100svh"} templateColumns={{ base: "1fr", lg: "1fr 1fr" }}>
            <Box
                display={{ base: "none", lg: "block" }}
                position={"relative"}
                p={"4"}
                bg={"bg.muted"}
            >
                <Lightning
                    hue={220}
                    xOffset={0}
                    speed={0.6}
                    intensity={0.4}
                    size={1}
                />
            </Box>
            <Flex
                direction={"column"}
                p={{ base: "6", md: "12" }}
                bg={"bg.muted"}
            >
                <Flex flex={"1"} align={"center"} justify={"center"}>
                    <Box w={"100%"} maxW={"xs"}>
                        <LoginCard />
                    </Box>
                </Flex>
            </Flex>
        </Grid>
    );
}

export default LoginForm;

const LoginCard = () => {
    const { login } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [sharedMessage, setSharedMessage] = useState({
        type: null,
        message: null,
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const onSubmit = async (data) => {
        setLoading(true);
        let hashPassword = SHA1(data.password).toString();
        try {
            const response = await fetch("/api/v1/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    login: data.username,
                    password: hashPassword,
                }),
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();

                if (!data.data.csrf_token) {
                    setSharedMessage({ type: "error", message: data.message });
                    return;
                }

                setSharedMessage({ type: "success", message: data.message });
                setLoading(false);
                setTimeout(() => {
                    login({
                        serverTime: data.data.server_time,
                        sessionTimeLeft: data.data.session_time_left,
                        csrfToken: data.data.csrf_token,
                    });
                }, 500);
            } else {
                const errorData = await response.json();
                setLoading(false);
                setSharedMessage({ type: "error", message: errorData.message });
            }
        } catch (error) {
            setLoading(false);
            setSharedMessage({ type: "error", message: error.message });
        }
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Fieldset.Root size={"lg"}>
                <VStack>
                    <Fieldset.Legend>
                        <Heading size={"3xl"}>Добро пожаловать!</Heading>
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
                <Button loading={loading} size={"xs"} type="submit">
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
