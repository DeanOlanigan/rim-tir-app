import { HStack, IconButton } from "@chakra-ui/react";
import { LuArrowLeft } from "react-icons/lu";
import LogName from "./LogName";
import LogTypesFilterButtons from "./LogTypesFilterButtons";
import LogToolBox from "./LogToolBox";
import { Link } from "react-router-dom";

function LogViewerHeader() {
    return (
        <HStack align={"center"} justify={"space-between"} gap={"4"}>
            <Link to="/log" >
                <IconButton
                    size={"xs"}
                    shadow={"xs"}
                    variant={"outline"}
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
