import { apiv2 } from "./baseUrl";

export async function eventAcknowledge({ eventId, event, message }) {
    const params = { eventId, event, message };
    const { data } = await apiv2.post("journal/ack/event", params);
    console.log("Результат квитирования", data);
    return data;
}

export async function eventAcknowledgeRange({ fromTs, toTs }) {
    const params = { fromTs, toTs };
    const { data } = await apiv2.post("journal/ack/range", params);
    console.log("Результат квитирования диапазона", data);
    return data;
}

export async function telecontrol({ varId, data }) {
    const params = { varId, data };
    const { res } = await apiv2.post("variable/telecontrol", params);
    return res;
}
