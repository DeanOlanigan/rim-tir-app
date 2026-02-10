import { Input } from "@chakra-ui/react";
import { RuleList } from "./RuleList";
import { LOCALE } from "../../constants";

export const MapEditor = (props) => {
    return (
        <RuleList
            {...props}
            title={LOCALE.mapEditor}
            emptyText={LOCALE.noRulesSet}
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
