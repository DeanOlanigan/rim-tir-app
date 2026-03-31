import { getConfiguration } from "../routes/configuration.api";
import { mapConfigurationResponseToState } from "../adapters/configuration.adapters";

export async function fetchConfigurationState() {
    const data = await getConfiguration();
    return mapConfigurationResponseToState(data?.config);
}
