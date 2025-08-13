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
                    /* ...variables.map((v) => ({
                                label: v.name,
                                kind: monacoRef.current.languages
                                    .CompletionItemKind.Variable,
                                insertText: v.name,
                            })), */
                ],
            };
        },
    });
}
