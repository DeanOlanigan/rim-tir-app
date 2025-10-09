import { Button } from "@chakra-ui/react";

export const FilterControls = () => {
    const handleApply = () => {
        console.log("handleApply");
    };

    const handleReset = () => {
        console.log("handleReset");
    };

    return (
        <>
            <Button size={"xs"} onClick={handleApply}>
                Применить
            </Button>
            <Button size={"xs"} onClick={handleReset}>
                Сбросить
            </Button>
        </>
    );
};
