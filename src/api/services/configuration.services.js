import { getConfiguration } from "../routes/configuration.api";
import { mapConfigurationResponseToState } from "../adapters/configuration.adapters";

export async function fetchConfigurationState() {
    const response = await getConfiguration();
    return mapConfigurationResponseToState(response);
}
