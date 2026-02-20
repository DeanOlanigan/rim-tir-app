export const rightsSample = {
    id: "ROOT",
    name: "",
    children: [
        {
            id: "confPage",
            name: 'Страница "Конфигурация"',
            disabled: false,
            children: [
                {
                    id: "lookConf",
                    name: "Просмотр страницы",
                    disabled: false,
                },
                {
                    id: "get",
                    name: "Прием",
                    disabled: false,
                    children: [
                        {
                            id: "GPIOget",
                            name: "Создание GPIO",
                            disabled: false,
                        },
                        {
                            id: "COMPORTget",
                            name: "Создание COM-порта",
                            disabled: false,
                        },
                        {
                            id: "IEC-104get",
                            name: "Создание IEC 60870-5-104",
                            disabled: false,
                        },
                        {
                            id: "ModbusRTUget",
                            name: "Создание Modbus-RTU",
                            disabled: false,
                        },
                        {
                            id: "ModbusTCPget",
                            name: "Создание Modbus-TCP",
                            disabled: false,
                        },
                    ],
                },
                {
                    id: "give",
                    name: "Передача",
                    disabled: false,
                    children: [
                        {
                            id: "GPIOgive",
                            name: "Создание GPIO",
                            disabled: false,
                        },
                        {
                            id: "COMPORTgive",
                            name: "Создание COM-порта",
                            disabled: false,
                        },
                        {
                            id: "IEC-104give",
                            name: "Создание IEC 60870-5-104",
                            disabled: false,
                        },
                        {
                            id: "ModbusRTUgive",
                            name: "Создание Modbus-RTU",
                            disabled: false,
                        },
                        {
                            id: "ModbusTCPgive",
                            name: "Создание Modbus-TCP",
                            disabled: false,
                        },
                    ],
                },
                {
                    id: "varConf",
                    name: "Переменные",
                    disabled: false,
                    children: [
                        {
                            id: "createConfVar",
                            name: "Создание переменных",
                            disabled: false,
                        },
                        {
                            id: "varInteract",
                            name: "Взаимодействие с переменными",
                            disabled: false,
                            children: [
                                {
                                    id: "renameVar",
                                    name: "Переименование",
                                },
                                {
                                    id: "deleteVar",
                                    name: "Удаление",
                                },
                                {
                                    id: "ignorVar",
                                    name: "Игнорирование",
                                },
                                {
                                    id: "cutVar",
                                    name: "Вырезание",
                                },
                                {
                                    id: "copyVar",
                                    name: "Копирование",
                                },
                                {
                                    id: "chooseVar",
                                    name: "Выбор типа данных",
                                },
                                {
                                    id: "descriptVar",
                                    name: "Изменение описания",
                                },
                            ],
                        },
                    ],
                },
                {
                    id: "router",
                    name: "Роутер",
                    disabled: false,
                    children: [
                        {
                            id: "config",
                            name: "Конфигурация",
                            disabled: false,
                            children: [
                                {
                                    id: "sendConf",
                                    name: "Отправка конфигурации на сервер",
                                    disabled: false,
                                },
                            ],
                        },
                        {
                            id: "server",
                            name: "Сервер",
                            disabled: false,
                            children: [
                                {
                                    id: "startServ",
                                    name: "Запуск сервера",
                                    disabled: false,
                                },
                                {
                                    id: "stopServ",
                                    name: "Остановка сервера",
                                    disabled: false,
                                },
                                {
                                    id: "restartServ",
                                    name: "Перезапуск сервера",
                                    disabled: false,
                                },
                            ],
                        },
                    ],
                },
                {
                    id: "conf",
                    name: "Конфигурация",
                    disabled: false,
                    children: [
                        {
                            id: "createConf",
                            name: "Создать конфигурацию",
                            disabled: false,
                        },
                        {
                            id: "editConf",
                            name: "Редактировать конфигурацию",
                            disabled: false,
                        },
                    ],
                },
            ],
        },

        {
            id: "monitorPage",
            name: 'Страница "Мониторинг"',
            disabled: false,
            children: [
                {
                    id: "lookMonitor",
                    name: "Просмотр страницы",
                    disabled: false,
                },
                {
                    id: "variablesMonitor",
                    name: "Переменные",
                    disabled: false,
                    children: [
                        {
                            id: "handleInputMonitorVar",
                            name: "Ручной ввод",
                            disabled: false,
                        },
                        {
                            id: "signalEditMonitorVar",
                            name: "Редактор сигнала",
                            disabled: false,
                        },
                    ],
                },
            ],
        },

        {
            id: "logPage",
            name: 'Страница "Логирование"',
            disabled: false,
            children: [
                { id: "lookLog", name: "Просмотр страницы", disabled: false },
                {
                    id: "downloadLog",
                    name: "Скачивание лог-файлов",
                    disabled: false,
                },
            ],
        },

        {
            id: "journPage",
            name: 'Страница "Журналирование"',
            disabled: false,
            children: [
                { id: "lookJourn", name: "Просмотр страницы", disabled: false },
                {
                    id: "downloadJourn",
                    name: "Скачивание записей",
                    disabled: false,
                },
            ],
        },

        {
            id: "graphsPage",
            name: 'Страница "Графики"',
            disabled: false,
            children: [
                {
                    id: "lookGraphs",
                    name: "Просмотр страницы графиков",
                    disabled: false,
                },
            ],
        },

        {
            id: "settingsPage",
            name: 'Страница "Настройки"',
            disabled: false,
            children: [
                {
                    id: "lookSettings",
                    name: "Просмотр страницы",
                    disabled: false,
                },
                {
                    id: "webServSettings",
                    name: 'Настройка "Web-Сервера"',
                    disabled: false,
                },
                {
                    id: "logSettings",
                    name: 'Настройка "Лог-файлов"',
                    disabled: false,
                },
                {
                    id: "journSettings",
                    name: 'Настройка "Журналов"',
                    disabled: false,
                    children: [
                        {
                            id: "journEventSettings",
                            name: "Журнал Событий",
                            disabled: false,
                        },
                        {
                            id: "journTISettings",
                            name: "Журнал ТИ",
                            disabled: false,
                        },
                    ],
                },
            ],
        },
    ],
};
