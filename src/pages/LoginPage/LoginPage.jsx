import { SHA1 } from "crypto-js";
import PropTypes from "prop-types";
import { Input, Stack, Box, AbsoluteCenter, Alert, Card } from "@chakra-ui/react";
import { Button } from "../../components/ui/button";
import { Field } from "../../components/ui/field";
import { PasswordInput } from "../../components/ui/password-input";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Gradient from "../../components/GradientBackground/GradientBackground";

function LoginForm({ onLogin }) {
    const [loading, setLoading] = useState(false);
    const [sharedMessage, setSharedMessage] = useState({ type: null, message: null });
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
                    password: hashPassword
                }),
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();

                if (!data.data.csrf_token) {
                    return;
                }

                setSharedMessage({type: "success", message: data.message});

                const serverCurrentTime = parseInt(data.data.server_time, 10);
                const clientCurrentTime = Math.floor(Date.now() / 1000);
                const timeDiff = serverCurrentTime - clientCurrentTime;

                const sessionTimeLeft = parseInt(data.data.session_time_left, 10);
                const sessionExpirationTime = clientCurrentTime + timeDiff + sessionTimeLeft;

                localStorage.setItem("csrf", data.data.csrf_token);
                localStorage.setItem("session_expiration_time", sessionExpirationTime);
                setLoading(false);
                setTimeout(()=>onLogin(), 1000);
                
            } else {
                const errorData = await response.json();
                setLoading(false);
                setSharedMessage({type: "error", message: errorData.message});
            }

        } catch (error) {
            setLoading(false);
            setSharedMessage({ type: "error", message: error.message});
        }
    };

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
                                {sharedMessage.type && (
                        
                                    <Box>
                                        <Alert.Root status={sharedMessage.type}>
                                            <Alert.Indicator />
                                            <Alert.Title>{sharedMessage.message}</Alert.Title>
                                        </Alert.Root>
                                    </Box>
                        
                                )}
                                <Button loading={loading} size={"xs"} type="submit">Войти</Button>
                            </Stack>
                        </form>
                    </Card.Body>
                </Card.Root>
            </AbsoluteCenter>
        </Box>
    );
}
LoginForm.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default LoginForm;