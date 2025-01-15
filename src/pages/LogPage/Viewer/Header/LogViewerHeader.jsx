import { HStack, IconButton } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import LogName from "./LogName";
import LogTypesFilterButtons from "./LogTypesFilterButtons";
import LogToolBox from "./LogToolBox";
import { useLogContext } from "../../../../providers/LogProvider/LogContext";


function LogViewerHeader() {
    console.log("Render LogViewerHeader");
    const { removeChosenLogFromLocalStorage } = useLogContext();

    return (
        <HStack align={"center"} justify={"space-between"} gap={"4"}>
            <Link to="/log" >
                <IconButton
                    size={"xs"}
                    shadow={"xs"}
                    variant={"outline"}
                    onClick={() => removeChosenLogFromLocalStorage()}
                >
                    <LuArrowLeft/>
                </IconButton>
            </Link>
            <LogName/>
            <LogTypesFilterButtons/>
            <LogToolBox/>
        </HStack>
    );
}

export default LogViewerHeader;
