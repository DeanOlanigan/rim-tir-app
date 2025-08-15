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
Руководство по настройке смотреть [тут](https://github.com/DeanOlanigan/react-app/blob/master/how-to-create-config.md)

После этого сгенерировать код конфигурации:
```sh
npm run generate-test-config
```
В src/config/generated появится/изменится generatedConfig.js

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
