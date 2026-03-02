import { IconButton, Center } from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode";
import { LuSettings, LuLogOut, LuNotebook } from "react-icons/lu";
import Navigation from "@/components/Navigation/Navigation";
import { NavLink } from "react-router-dom";
import { JOURNAL_DIALOG_ID, journalDialog } from "@/journalDialog";
import { useLogoutMutation } from "@/hooks/useMutation";

function Header() {
    return (
        <Center as={"header"} gap={"2"} p={"2"}>
            <Navigation />
            <OpenJournalDialogBtn />
            <SettingsMenu />
            <LogoutBtn />
            <ColorModeButton size={"xs"} />
        </Center>
    );
}
export default Header;

const SettingsMenu = () => {
    return (
        <NavLink to={"settings"} tabIndex={-1}>
            {({ isActive }) => (
                <IconButton
                    size={"xs"}
                    variant={isActive ? "solid" : "ghost"}
                    shadow={isActive ? "md" : ""}
                    aria-label="Settings"
                    css={{
                        _icon: {
                            width: "5",
                            height: "5",
                        },
                    }}
                >
                    <LuSettings />
                </IconButton>
            )}
        </NavLink>
    );
};

const LogoutBtn = () => {
    const logoutMutation = useLogoutMutation();

    return (
        <IconButton
            size={"xs"}
            variant={"ghost"}
            aria-label="Logout"
            css={{
                _icon: {
                    width: "5",
                    height: "5",
                },
            }}
            onClick={logoutMutation.mutate}
        >
            <LuLogOut />
        </IconButton>
    );
};

const OpenJournalDialogBtn = () => {
    return (
        <IconButton
            size={"xs"}
            variant={"ghost"}
            aria-label="Logout"
            css={{
                _icon: {
                    width: "5",
                    height: "5",
                },
            }}
            onClick={() => journalDialog.open(JOURNAL_DIALOG_ID)}
        >
            <LuNotebook />
        </IconButton>
    );
};
