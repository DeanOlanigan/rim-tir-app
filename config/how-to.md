# Как настраивать конфигуратор

В корне проекта есть config/instance.json, который валидируется рядом лежащей схемой.

Если валидации нет - проверь настройки в .vscode/settings.json:

```json
"json.schemas": [
    {
        "fileMatch": [
            "/config/instance.json"
        ],
        "url": "./config/schema.json"
    },
]
```

После этого сгенерировать код конфигурации:

```sh
npm run generate-test-config
```

В src/config/generated появится/изменится generatedConfig.js
