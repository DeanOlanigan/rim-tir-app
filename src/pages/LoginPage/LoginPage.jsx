import { SHA1 } from "crypto-js";
import {
    Input,
    Stack,
    Box,
    AbsoluteCenter,
    Alert,
    Card,
} from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Gradient from "@/components/GradientBackground/GradientBackground";
import { LuLogIn } from "react-icons/lu";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/providers/AuthProvider/AuthContext";

function LoginForm() {
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
    const { login, isAuthenticated } = useAuthContext();

    console.log("Render LoginForm; isAuthenticated:", isAuthenticated);

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

    if (isAuthenticated) {
        return <Navigate to="/configuration" replace />;
    }

    return (
        <Box position={"relative"} h={"100vh"}>
            <Gradient />
            <AbsoluteCenter axis={"both"}>
                <Card.Root w={"sm"} bg="bg/50" border={"none"}>
                    <Card.Body>
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <Stack>
                                <Field
                                    label="Логин"
                                    required
                                    invalid={!!errors.username}
                                    errorText={errors.username?.message}
                                >
                                    <Input
                                        autoComplete="off"
                                        {...register("username", {
                                            required: "Вы должны ввести логин",
                                        })}
                                    />
                                </Field>
                                <Field
                                    label="Пароль"
                                    required
                                    invalid={!!errors.password}
                                    errorText={errors.password?.message}
                                >
                                    <PasswordInput
                                        {...register("password", {
                                            required: "Вы должны ввести пароль",
                                        })}
                                    />
                                </Field>
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
                                            <Alert.Title>
                                                {sharedMessage.message}
                                            </Alert.Title>
                                        </Alert.Root>
                                    )}
                                </Box>
                                <Button
                                    loading={loading}
                                    size={"xs"}
                                    type="submit"
                                >
                                    <LuLogIn />
                                    Войти
                                </Button>
                            </Stack>
                        </form>
                    </Card.Body>
                </Card.Root>
            </AbsoluteCenter>
        </Box>
    );
}

export default LoginForm;
