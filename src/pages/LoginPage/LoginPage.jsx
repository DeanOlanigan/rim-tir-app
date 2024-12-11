import { SHA1 } from "crypto-js";
import PropTypes from "prop-types";
import { Button, Input, Stack, Box, AbsoluteCenter, Alert, Card } from "@chakra-ui/react";
import { Field } from "../../components/ui/field";
import { PasswordInput } from "../../components/ui/password-input";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Gradient from "./Gradient";
import "./LoginPage.css";

function LoginForm({ onLogin }) {
    const [sharedError, setSharedError] = useState(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
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

                const serverCurrentTime = parseInt(data.data.server_time, 10);
                const clientCurrentTime = Math.floor(Date.now() / 1000);
                const timeDiff = serverCurrentTime - clientCurrentTime;

                const sessionTimeLeft = parseInt(data.data.session_time_left, 10);
                const sessionExpirationTime = clientCurrentTime + timeDiff + sessionTimeLeft;

                localStorage.setItem("csrf", data.data.csrf_token);
                localStorage.setItem("session_expiration_time", sessionExpirationTime);

                onLogin();
            } else {
                const errorData = await response.json();
                setSharedError(errorData.message);
            }

        } catch (error) {
            setSharedError(error.message);
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
                                {sharedError && (
                        
                                    <Box>
                                        <Alert.Root status={"error"}>
                                            <Alert.Indicator />
                                            <Alert.Title>{sharedError}</Alert.Title>
                                        </Alert.Root>
                                    </Box>
                        
                                )}
                                <Button size={"xs"} type="submit">Войти</Button>
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