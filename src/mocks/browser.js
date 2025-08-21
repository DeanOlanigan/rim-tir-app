import { setupWorker } from "msw/browser";
import { handelers } from "./handelers";

export const worker = setupWorker(...handelers);