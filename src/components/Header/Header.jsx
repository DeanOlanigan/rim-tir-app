import { Flex, IconButton, Text, Skeleton } from "@chakra-ui/react";
import { Tooltip } from "../../components/ui/tooltip";
import { useEffect, useState } from "react";
import { ColorModeButton } from "../ui/color-mode";
import { LuSettings, LuLogOut } from "react-icons/lu";

import Navigation from "../Navigation/Navigation";
import ConnectionStatus from "../ConnectionStatus/ConnectionStatus";
import "./Header.css";  

const Header = () => {
    const [ version, setVersion ] = useState("");

    useEffect(() => {
        const fetchVersion = async () => {
            try {
                const response = await fetch("http://192.168.1.1:8080/api/v1/getSoftwareVer");
                if (!response.ok) {
                    throw new Error(`Ошибка загрузки: ${response.statusText}`);
                }
                const result = await response.json();
                if (result.code === 200) {
                    setVersion(result.data || []);
                } else {
                    throw new Error(result.message || "Неизвестная ошибка");
                }
            } catch (error) {
                throw new Error(error.message);
            }
        };
        fetchVersion();
    }, []);

    const handleLogout = async () => {
        const response = await fetch("/api/v1/logout",{ method: "POST", credentials: "include" });
        if (response.ok) {
            localStorage.removeItem("session_expiration_time");
            localStorage.removeItem("csrf");
            window.location.href = "/login";
        } else {
            alert("Logout failed");
        }
    };

    return (
        <header className="header">
            <Flex gap="4" align="center" width="270px" justify="start">
                <Skeleton loading={!version}>
                    <Text fontWeight={"medium"}>{version || "7.7.77-7"}</Text>
                </Skeleton>
                <IconButton 
                    size={"sm"}
                    variant="ghost" 
                    css={{
                        _icon: {
                            width: "5",
                            height: "5",
                        },
                    }}
                >
                    <LuSettings />
                </IconButton>
            </Flex>
            <Navigation />
            <Flex gap="2" align="center" width="270px" justify="end">
                <ConnectionStatus />
                <Tooltip content="Выйти" disabled>
                    <IconButton 
                        size={"sm"}
                        variant={"ghost"}
                        onClick={handleLogout}
                        css={{
                            _icon: {
                                width: "5",
                                height: "5",
                            },
                        }}
                    >
                        <LuLogOut />
                    </IconButton>
                </Tooltip>
                <ColorModeButton />
            </Flex>
        </header>
    );
};

export default Header;
