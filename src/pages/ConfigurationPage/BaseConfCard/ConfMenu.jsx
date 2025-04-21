import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
} from "../../../components/ui/menu";
import { Button, FileUpload } from "@chakra-ui/react";
import { downloadStateAsXml } from "../../../utils/storeToXml";
import { uploadXmlFile } from "../../../utils/xmlToStore";
import { useVariablesStore } from "../../../store/variables-store";

export const ConfMenu = () => {
    const closeHandler = () => {
        useVariablesStore.setState({
            configInfo: {},
            // Деревья для react-arborist
            send: [],
            receive: [],
            variables: [],
            // Параметры всех узлов деревьев
            settings: {},
            // Id выбранных узлов
            selectedIds: {
                connections: new Set(),
                variables: new Set(),
            },
        });
    };

    return (
        <MenuRoot size={"md"}>
            <MenuTrigger asChild>
                <Button variant="ghost" size="2xs" rounded={"md"}>
                    Конфигурация
                </Button>
            </MenuTrigger>
            <MenuContent>
                <MenuItem value="new-file">Создать...</MenuItem>
                <FileUpload.Root accept={[".xml"]}>
                    <FileUpload.HiddenInput />
                    <FileUpload.Trigger asChild>
                        <UploadInput />
                        {/* <MenuItem value="new-txt">Открыть...</MenuItem> */}
                    </FileUpload.Trigger>
                </FileUpload.Root>
                <MenuItem value="new-win" onClick={downloadStateAsXml}>
                    Сохранить
                </MenuItem>
                <MenuItem value="open-file">Сохранить как...</MenuItem>
                <MenuItem value="export" onClick={closeHandler}>
                    Закрыть
                </MenuItem>
            </MenuContent>
        </MenuRoot>
    );
};

function UploadInput() {
    const onChange = (e) => uploadXmlFile(e.target.files[0]);
    return <input type="file" accept=".xml" onChange={onChange} />;
}
