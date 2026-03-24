// configuration.adapters.js
import { parseXmlToState } from "@/utils/xml/xmlToStore";

export function mapConfigurationResponseToState(response) {
    return parseXmlToState(response?.data);
}
