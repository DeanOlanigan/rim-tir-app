import { Box, HStack, Text } from "@chakra-ui/react";
import { memo, useCallback, useEffect, useState } from "react";

function getLegendItems(chart, datasets) {
    if (!chart) return [];

    const items = chart.options.plugins.legend.labels.generateLabels(chart);

    return items.map((item) => ({
        ...item,
        color: datasets?.[item.datasetIndex]?.color ?? item.strokeStyle,
        text:
            datasets?.[item.datasetIndex]?.alias ||
            datasets?.[item.datasetIndex]?.variable ||
            item.text,
    }));
}

export const GraphLegendContainer = memo(function GraphLegendContainer({
    chartRef,
    datasets,
}) {
    const [legendItems, setLegendItems] = useState([]);

    const syncLegend = useCallback(() => {
        const chart = chartRef.current;
        if (!chart) return;
        const items = getLegendItems(chart, datasets);
        console.log("TEST", datasets, items);
        setLegendItems(items);
    }, [chartRef, datasets]);

    useEffect(() => {
        syncLegend();
    }, [syncLegend]);

    const handleToggle = useCallback(
        (item) => {
            const chart = chartRef.current;
            if (!chart) return;

            const datasetIndex = item.datasetIndex;
            const isVisible = chart.isDatasetVisible(datasetIndex);

            chart.setDatasetVisibility(datasetIndex, !isVisible);
            chart.update();

            setLegendItems(getLegendItems(chart, datasets));
        },
        [chartRef, datasets],
    );

    console.log(legendItems);

    return <GraphLegend items={legendItems} onToggle={handleToggle} />;
});

const GraphLegend = memo(function GraphLegend({ items, onToggle }) {
    if (!items?.length) return null;

    return (
        <HStack wrap="wrap" gap={2}>
            {items.map((item) => (
                <HStack
                    key={item.datasetIndex}
                    as="button"
                    type="button"
                    onClick={() => onToggle(item)}
                    px={3}
                    py={1.5}
                    borderRadius="full"
                    borderWidth="1px"
                    bg={item.hidden ? "bg.muted" : "bg.panel"}
                    opacity={item.hidden ? 0.5 : 1}
                    cursor="pointer"
                    transition="all 0.2s"
                >
                    <Box boxSize="10px" borderRadius="full" bg={item.color} />
                    <Text
                        fontSize="sm"
                        textDecoration={item.hidden ? "line-through" : "none"}
                    >
                        {item.text}
                    </Text>
                </HStack>
            ))}
        </HStack>
    );
});
