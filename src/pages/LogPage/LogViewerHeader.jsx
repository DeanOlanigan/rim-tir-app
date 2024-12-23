import { HStack, IconButton } from "@chakra-ui/react";
import { LuArrowLeft } from "react-icons/lu";
import LogName from "./LogName";
import LogTypesFilterButtons from "./LogTypesFilterButtons";
import LogToolBox from "./LogToolBox";
import PropTypes from "prop-types";

function LogViewerHeader({ onBackBtnClick }) {
    return (
        <HStack align={"center"} justify={"space-between"} gap={"4"}>
            <IconButton size={"xs"} shadow={"md"} variant={"outline"} onClick={onBackBtnClick}>
                <LuArrowLeft/>
            </IconButton>
            <LogName/>        
            <LogTypesFilterButtons/>
            <LogToolBox/>
        </HStack>
    );
}
LogViewerHeader.propTypes = {
    onBackBtnClick: PropTypes.func
};

export default LogViewerHeader;
