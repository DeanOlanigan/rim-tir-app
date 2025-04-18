import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
} from "../../../components/ui/menu";
import { Button, FileUpload } from "@chakra-ui/react";
import { downloadStateAsXml } from "../../../utils/storeToXml";
import { uploadXmlFile } from "../../../utils/xmlToStore";

export const ConfMenu = () => {
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
                <MenuItem value="export">Закрыть</MenuItem>
            </MenuContent>
        </MenuRoot>
    );
};

function UploadInput() {
    const onChange = (e) => uploadXmlFile(e.target.files[0]);
    return <input type="file" accept=".xml" onChange={onChange} />;
}
