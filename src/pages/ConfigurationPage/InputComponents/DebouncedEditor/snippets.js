export function getCompletionSnippets(monacoRef) {
    return monacoRef.current.languages.registerCompletionItemProvider("lua", {
        provideCompletionItems: () => {
            return {
                suggestions: [
                    {
                        label: "Создать блок с задержкой",
                        kind: monacoRef.current.languages.CompletionItemKind
                            .Function,
                        insertTextRules:
                            monacoRef.current.languages
                                .CompletionItemInsertTextRule.InsertAsSnippet,
                        insertText: [
                            "delay(${1}, function ()",
                            "",
                            "end)",
                            "",
                        ].join("\n"),
                    },
                    {
                        label: "Вызвать обновление переменной",
                        kind: monacoRef.current.languages.CompletionItemKind
                            .Function,
                        insertTextRules:
                            monacoRef.current.languages
                                .CompletionItemInsertTextRule.InsertAsSnippet,
                        insertText: "update(${1})",
                    },
                    {
                        label: "Изменить значение текущей переменной",
                        kind: monacoRef.current.languages.CompletionItemKind
                            .Function,
                        insertTextRules:
                            monacoRef.current.languages
                                .CompletionItemInsertTextRule.InsertAsSnippet,
                        insertText: "set(${1})",
                    },
                    {
                        label: "Получить значение текущей переменной",
                        kind: monacoRef.current.languages.CompletionItemKind
                            .Function,
                        insertTextRules:
                            monacoRef.current.languages
                                .CompletionItemInsertTextRule.InsertAsSnippet,
                        insertText: "self(${1})",
                    },
                ],
            };
        },
    });
}
