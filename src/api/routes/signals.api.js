import { apiv2 } from "../client";

// Действие администратора - может изменить значение сигнала как хочет
export async function writeSignal({ id, value, qualityFlags }) {
    const payload = { value, qualityFlags };
    const response = await apiv2.post(`/signals/${id}/overwrite`, payload);
    return response.data;
}

// Действие пользователя - может изменить значение сигнала, сервер сам выставить нужные атрибуты качества
export async function manualWriteSignal({ id, value }) {
    const response = await apiv2.post(`/signals/${id}/write`, {
        value,
    });
    return response.data;
}

// Действие пользователя - отправка команды инвертировать текущий бит сигнала (для реализаций кнопок вкл/выкл)
export async function toggleSignalBit({ id }) {
    const response = await apiv2.post(`/signals/${id}/bit-toggle`);
    return response.data;
}

// Действие пользователя - после выполнений пользовательских действий сервер ставит атрибут качества блокировки.
// Пользователь должен отдельно уметь снимать блокировку
export async function unblockSignal({ id }) {
    const response = await apiv2.post(`/signals/${id}/unblock`);
    return response.data;
}

export async function getSignalHistory({
    fromUTC,
    toUTC,
    pointLimit,
    variables,
}) {
    const response = await apiv2.post("/signals/history", {
        fromUTC, // ISO 8601 UTC
        toUTC,
        pointLimit,
        variables, // variables: [{ id }]
    });
    return response.data;
}
