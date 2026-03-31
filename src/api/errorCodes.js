export const ERROR_CODES = {
    // auth
    INVALID_CREDENTIALS: "Неверные логин или пароль",
    UNAUTHORIZED: "Неавторизован",
    FORBIDDEN: "Доступ запрещен",
    USER_DISABLED: "Пользователь отключен",

    // shared
    INTERNAL_SERVER_ERROR: "Внутренняя ошибка сервера",
    NOT_FOUND: "Не найдено",
    INVALID_PAYLOAD: "Недопустимое тело запроса",

    // config
    PAYLOAD_TOO_LARGE: "Тело запроса слишком велико",

    //hmi
    INVALID_PACKAGE: "Недопустимый пакет",
    PROJECT_ID_MISMATCH: "Несоответствие ID проекта",
};
