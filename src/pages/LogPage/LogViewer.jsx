import { Card } from "@chakra-ui/react";
import PropTypes from "prop-types";
import LogViewerHeader from "./LogViewerHeader";
import LogViewerBody from "./LogViewerBody";

function LogViewer({ onBackBtnClick }) {
    return (
        <Card.Root flex={"1"} display={"flex"} flexDirection={"column"} minH={"0"} shadow={"xl"}>
            <Card.Header>
                <LogViewerHeader onBackBtnClick={onBackBtnClick}/>
            </Card.Header>
            <Card.Body flex={"1"} display={"flex"} flexDirection={"column"} minH={"0"}>
                <LogViewerBody/>
            </Card.Body>
        </Card.Root>                       
    );
}
LogViewer.propTypes = {
    onBackBtnClick: PropTypes.func
};

export default LogViewer;
