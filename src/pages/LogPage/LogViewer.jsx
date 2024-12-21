import { Text, Em, Card, Heading, HStack, Button, Group, CheckboxCard, Icon, IconButton } from "@chakra-ui/react";
import { InfoTip } from "../../components/ui/toggle-tip";
import { 
    LuCircleAlert, 
    LuInfo, LuTriangleAlert, 
    LuCirclePlus, 
    LuCircleMinus, 
    LuCirclePlay, 
    LuCirclePause, 
    LuCopy, 
    LuDownload, 
    LuWrapText, 
    LuEraser 
} from "react-icons/lu";
import { useLogContext } from "../../providers/LogProvider/LogContext";
import PropTypes from "prop-types";

function LogViewer({ onBackBtnClick }) {
    const { logData } = useLogContext();

    return (
        
        <Card.Root h={"100%"}>
            <Card.Header>
                <HStack align={"center"} gap={"4"}>
                    <Button size={"xs"} onClick={onBackBtnClick}>Назад</Button>
                    <HStack gap={"0"}>
                        <Heading>{logData.name}</Heading>
                        <InfoTip>
                            <Text>Дата создания: <Em>{logData.createdAt}</Em></Text>
                            <Text>Размер: <Em>{logData.size}</Em></Text>
                            <Text>Тип: <Em>{logData.type.toLowerCase()}</Em></Text>
                            <Text>Изначальное количество строк: <Em>{logData.rows}</Em></Text>
                        </InfoTip>
                    </HStack>
                    <Group attached>
                        <CheckboxCard.Root variant={"surface"} colorPalette={"yellow"} checked>
                            <CheckboxCard.HiddenInput />
                            <CheckboxCard.Control p={"0.45rem"}>
                                <Icon fontSize={"16px"}>
                                    <LuTriangleAlert/>
                                </Icon>
                            </CheckboxCard.Control>
                        </CheckboxCard.Root>
                        <CheckboxCard.Root variant={"surface"} colorPalette={"red"} checked>
                            <CheckboxCard.HiddenInput />
                            <CheckboxCard.Control p={"0.45rem"}>
                                <Icon fontSize={"16px"}>
                                    <LuCircleAlert/>
                                </Icon>
                            </CheckboxCard.Control>
                        </CheckboxCard.Root>
                        <CheckboxCard.Root variant={"surface"} colorPalette={"blue"} checked>
                            <CheckboxCard.HiddenInput />
                            <CheckboxCard.Control p={"0.45rem"}>
                                <Icon fontSize={"16px"}>
                                    <LuInfo/>
                                </Icon>
                            </CheckboxCard.Control>
                        </CheckboxCard.Root>
                    </Group>
                    <Group attached>
                        <IconButton size={"xs"} variant={"outline"}><LuDownload/></IconButton>
                        <IconButton size={"xs"} variant={"outline"}><LuCopy/></IconButton>
                        <IconButton size={"xs"} variant={"outline"}><LuCirclePlus/></IconButton>
                        <IconButton size={"xs"} variant={"outline"}><LuCircleMinus/></IconButton>
                        <CheckboxCard.Root variant={"surface"}>
                            <CheckboxCard.HiddenInput />
                            <CheckboxCard.Control p={"0.45rem"}>
                                <Icon fontSize={"16px"}>
                                    <LuWrapText/>
                                </Icon>
                            </CheckboxCard.Control>
                        </CheckboxCard.Root>
                        <CheckboxCard.Root variant={"surface"}>
                            <CheckboxCard.HiddenInput />
                            <CheckboxCard.Control p={"0.45rem"}>
                                <Icon fontSize={"16px"}>
                                    <LuCirclePause/>
                                </Icon>
                            </CheckboxCard.Control>
                        </CheckboxCard.Root>
                        <IconButton size={"xs"} variant={"outline"}><LuEraser/></IconButton>
                    </Group>
                </HStack>
            </Card.Header>
            <Card.Body>
                
            </Card.Body>
        </Card.Root>                       
        
    );
}
LogViewer.propTypes = {
    onBackBtnClick: PropTypes.func
};

export default LogViewer;
