import { Input } from "@chakra-ui/react";
import { RuleList } from "./RuleList";

export const MapEditor = (props) => {
    return (
        <RuleList
            {...props}
            title={"Map Editor"}
            emptyText={"No rules defined. Value will fallback to static"}
            createRule={() => ({ from: "" })}
            renderInput={(rule, i, onChange) => (
                <Input
                    w={"70px"}
                    size={"xs"}
                    value={rule.from ?? ""}
                    onChange={(e) => onChange(i, "from", e.target.value)}
                />
            )}
        />
    );
};
