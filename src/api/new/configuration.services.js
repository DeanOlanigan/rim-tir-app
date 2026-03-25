import { getConfiguration } from "./configuration.api";
import { mapConfigurationResponseToState } from "./configuration.adapters";

export async function fetchConfigurationState() {
    const response = await getConfiguration();
    return mapConfigurationResponseToState(response);
}
