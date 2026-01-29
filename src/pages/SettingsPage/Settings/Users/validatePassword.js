export function validatePassword(password, repeatedPassword) {
    const errorsArr = [];

    if (password.length < 3) {
        errorsArr.push("Пароль слишком короткий (минимум 3 символа)");
    }

    if (password.length > 20) {
        errorsArr.push("Пароль слишком длинный (максимум 20 символов)");
    }

    for (const char of password) {
        const code = char.charCodeAt(0);

        if (code < 0x21 || code > 0x7e) {
            if (code === 0x20) {
                errorsArr.push("Пароль не должен содержать пробелы");
                break;
            } else {
                errorsArr.push(
                    "Пароль содержит недопустимые символы (например, кириллицу)",
                );
                break;
            }
        }
    }

    if (password.trim() !== (repeatedPassword?.trim() || password.trim())) {
        errorsArr.push("Пароли не совпадают");
    }

    return {
        isValid: errorsArr.length === 0,
        errorsArr,
    };
}
