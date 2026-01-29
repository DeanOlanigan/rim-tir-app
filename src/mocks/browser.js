import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";
import { wsHandlers } from "./wsHandlers";
import { mqttPassThrough } from "./mqttHandler";

export const worker = setupWorker(
    ...handlers,
    ...wsHandlers,
    ...mqttPassThrough,
);
