import { SHA1 } from "crypto-js";
import PropTypes from "prop-types";
import { Button, Input, Stack, Container } from "@chakra-ui/react";
import { Field } from "../../components/ui/field";
import { PasswordInput } from "../../components/ui/password-input";
import { useForm } from "react-hook-form";

function LoginForm({ onLogin }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = handleSubmit(async (data) => {
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
                const result = await response.json();
                alert(result.message);
            }

        } catch (error) {
            console.error(error);
        }
    });

    return (
        <Container>
            <form onSubmit={onSubmit}>
                <Stack>
                    <Field
                        label="Username"
                        invalid={!!errors.username}
                        errorText={errors.username?.message}
                    >
                        <Input
                            {...register("username", {
                                required: "Username is required",
                            })}
                        />
                    </Field>
                    <Field
                        label="Password"
                        invalid={!!errors.password}
                        errorText={errors.password?.message}
                    >
                        <PasswordInput
                            {...register("password", {
                                required: "Password is required",
                            })}
                        />
                    </Field>
                    <Button type="submit">Login</Button>
                </Stack>
            </form>
        </Container>
    );
}
LoginForm.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default LoginForm;