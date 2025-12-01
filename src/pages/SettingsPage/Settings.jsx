import { Stack } from "@chakra-ui/react";
import { JournalSettings } from "./Settings/JournalSettings";
import { LogSettings } from "./Settings/LogSettings";
import { ServerSettings } from "./Settings/WebServSettings";
import { useQuery } from "@tanstack/react-query";
import { apiv2 } from "@/api/baseUrl";
import { Loader } from "@/components/Loader";
import { SendButton } from "./SendButton";
import { ErrorModal } from "./Settings/ErrorModal";

const useSettings = () => {
    const s = useQuery({
        queryKey: ["settings"],
        queryFn: async () => {
            const res = await apiv2.get("/settings");
            await new Promise((res) => setTimeout(res, 1000));
            return res.data;
        },
        retry: false,
    });
    return s;
};

export const Settings = () => {
    const { data: settings, isLoading, isError, refetch } = useSettings();

    return isLoading ? (
        <Stack gap="3" position={"relative"} h={"xl"}>
            <Loader text={"Загрузка настроек"} />
        </Stack>
    ) : (
        <Stack gap="3">
            {isError && (
                <ErrorModal
                    refetch={refetch}
                    text={"Ошибка загрузки настроек"}
                />
            )}
            <ServerSettings settings={settings?.WebServer} />
            <LogSettings settings={settings?.Logs} />
            <JournalSettings settings={settings?.Journals} />
            <SendButton />
        </Stack>
    );
};
