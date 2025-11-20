import { v4 as uuidv4 } from "uuid";

export const useLecense = () => {
    const deviceId = uuidv4();
    return deviceId;
};