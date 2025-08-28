
import {
    Input,
    Box,
    Alert,
    Grid,
    Flex,
    VStack,
    Heading,
    Fieldset,
    Field,
} from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { LuLogIn } from "react-icons/lu";
import { Navigate } from "react-router-dom";
//import { useAuthContext } from "@/providers/AuthProvider/AuthContext";
import Lightning from "@/components/Lightning/Lightning";
import { useAuth } from "@/hooks/useAuth";

function LoginForm() {
    const { isAuthenticated } = useAuth();

    console.log("Render LoginForm; isAuthenticated:", isAuthenticated);
    if (isAuthenticated) {
        return <Navigate to="/configuration" replace />;
    }

    return (
        <Grid minH={"100svh"} templateColumns={{ base: "1fr", lg: "1fr 1fr" }}>
            {/* <Gradient /> */}
            <Box display={{ base: "none", lg: "block" }} position={"relative"}>
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
                gap={"4"}
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
    const { login, isLoggingIn, isAuthenticated } = useAuth();
    //const [loading, setLoading] = useState(false);
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
        try {
            await login({
                login: data.username,
                password: data.password,
            });
            console.log(isAuthenticated + "ЯЯЯЯЯТ");
        } catch (error) {
            setSharedMessage({
                type: "error",
                message: "Error: " + error.message
            });
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
                <Button loading={isLoggingIn} size={"xs"} type="submit">
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
