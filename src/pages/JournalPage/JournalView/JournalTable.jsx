import { Box, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { QK } from "@/api";

const useJournalHistory = () => {
    const q = useQuery({
        queryKey: QK.journal,
        queryFn: async () => {
            const out = [];
            // eslint-disable-next-line
            const count = Math.floor(Math.random() * 30);

            for (let i = 0; i < count; i++) {
                out.push({
                    ts: Date.now(),
                    // eslint-disable-next-line
                    type: ["ts", "tu"][Math.floor(Math.random() * 2)],
                    name: "test",
                    // eslint-disable-next-line
                    value: Math.floor(Math.random() * 100),
                    group: ["noGroup", "danger", "warn", "state"][
                        // eslint-disable-next-line
                        Math.floor(Math.random() * 4)
                    ],
                });
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return out;
        },
    });

    return q;
};

export const TestTable = () => {
    const { data, isLoading, isError, error } = useJournalHistory();

    if (isLoading) return <Text>Loading...</Text>;
    if (isError) return <Text>Error: {error.message}</Text>;

    return (
        <Box>
            {data.map((item, index) => (
                <Text
                    key={index}
                >{`${item.ts} | ${item.type} | ${item.group} | ${item.name} | ${item.value}`}</Text>
            ))}
        </Box>
    );
};
