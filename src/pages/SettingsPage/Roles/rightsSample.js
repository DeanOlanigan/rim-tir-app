export const rightsSample = {
    id: "ROOT",
    name: "",
    children: [
        {
            id: "config",
            name: 'Страница "Конфигурация"',
            disabled: false,
            children: [
                {
                    id: "config.view",
                    name: "Просмотр страницы",
                    disabled: false,
                },
                {
                    id: "config.upload",
                    name: "Отправка конфигурации на сервер",
                    disabled: false,
                },
                {
                    id: "config.open",
                    name: "Открыть конфигурацию",
                    disabled: false,
                },
                {
                    id: "config.editor",
                    name: "Редактирование конфигурации",
                    disabled: false,
                },
            ],
        },

        {
            id: "server",
            name: "Взаимодействие с сервером",
            disabled: false,
            children: [
                {
                    id: "server.start",
                    name: "Запуск сервера",
                    disabled: false,
                },
                {
                    id: "server.stop",
                    name: "Остановка сервера",
                    disabled: false,
                },
            ],
        },

        {
            id: "monitoring",
            name: 'Страница "Мониторинг"',
            disabled: false,
            children: [
                {
                    id: "monitoring.view",
                    name: "Просмотр страницы",
                    disabled: false,
                },
                {
                    id: "monitoring.variables",
                    name: "Переменные",
                    disabled: false,
                    children: [
                        {
                            id: "monitoring.variables.manual_input",
                            name: "Ручной ввод",
                            disabled: false,
                        },
                        {
                            id: "monitoring.variables.signal_editor",
                            name: "Редактор сигнала",
                            disabled: false,
                        },
                        {
                            id: "monitoring.variables.telecontrol",
                            name: "Телеизмерение",
                            disabled: false,
                        },
                    ],
                },
            ],
        },

        {
            id: "logs",
            name: 'Страница "Логирование"',
            disabled: false,
            children: [
                { id: "logs.view", name: "Просмотр страницы", disabled: false },
                {
                    id: "logs.download",
                    name: "Скачивание лог-файлов",
                    disabled: false,
                },
            ],
        },

        {
            id: "journal",
            name: 'Страница "Журналирование"',
            disabled: false,
            children: [
                {
                    id: "journal.view",
                    name: "Просмотр страницы",
                    disabled: false,
                },
                {
                    id: "journal.download",
                    name: "Скачивание записей",
                    disabled: false,
                },
                {
                    id: "journal.ack",
                    name: "Квитирование записей",
                    disabled: false,
                },
            ],
        },

        {
            id: "graphs",
            name: 'Страница "Графики"',
            disabled: false,
            children: [
                {
                    id: "graphs.view",
                    name: "Просмотр страницы графиков",
                    disabled: false,
                },
            ],
        },

        {
            id: "hmi",
            name: 'Редактор "HMI"',
            disabled: false,
            children: [
                {
                    id: "hmi.view",
                    name: "Просмотр страницы HMI",
                    disabled: false,
                },
                {
                    id: "hmi.editor",
                    name: "Редактор HMI",
                    disabled: false,
                },
                {
                    id: "hmi.upload",
                    name: "Загрузка HMI",
                    disabled: false,
                },
            ],
        },

        {
            id: "settings",
            name: 'Страница "Настройки"',
            disabled: false,
            children: [
                {
                    id: "settings.view",
                    name: "Просмотр страницы",
                    disabled: false,
                },
                {
                    id: "settings.web_server.edit",
                    name: 'Настройка "Web-Сервера"',
                    disabled: false,
                },
                {
                    id: "settings.logs.edit",
                    name: 'Настройка "Лог-файлов"',
                    disabled: false,
                },
                {
                    id: "settings.journal.edit",
                    name: 'Настройка "Журналов"',
                    disabled: false,
                },
                {
                    id: "security.users.edit",
                    name: 'Настройка "Пользователей"',
                    disabled: false,
                },
                {
                    id: "security.roles.edit",
                    name: 'Настройка "Ролей"',
                    disabled: false,
                },
                {
                    id: "security.licensing.manage",
                    name: 'Настройка "Лицензий"',
                    disabled: false,
                },
                {
                    id: "system.software_update",
                    name: 'Настройка "Обновление ПО"',
                    disabled: false,
                },
            ],
        },
    ],
};
