function createDependencyProposals(monaco) {
    return [
        {
            label: "Создать блок с задержкой",
            filterText: "delay",
            kind: monaco.languages.CompletionItemKind.Function,
            insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            insertText: ["delay(${1}, function ()", "", "end)", ""].join("\n"),
        },
        {
            label: "Вызвать обновление переменной",
            filterText: "update",
            kind: monaco.languages.CompletionItemKind.Function,
            insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            insertText: "update(${1})",
        },
        {
            label: "Изменить значение текущей переменной",
            filterText: "set",
            kind: monaco.languages.CompletionItemKind.Function,
            insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            insertText: "set(${1})",
        },
        {
            label: "Получить значение текущей переменной",
            filterText: "self",
            kind: monaco.languages.CompletionItemKind.Function,
            insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            insertText: "self(${1})",
        },
    ];
}

export function getCompletionSnippets(monaco) {
    const provider = monaco.languages.registerCompletionItemProvider("lua", {
        provideCompletionItems: function () {
            return {
                suggestions: createDependencyProposals(monaco),
            };
        },
    });

    return provider;
}
