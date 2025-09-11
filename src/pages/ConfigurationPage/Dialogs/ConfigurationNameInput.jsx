import { MAX_NAME_LENGTH } from "@/config/constants";
import { Input, InputGroup, Span } from "@chakra-ui/react";

export const ConfigurationNameInput = ({ name, setName }) => {
    return (
        <InputGroup
            endElement={
                <Span color={"fg.muted"} textStyle={"xs"}>
                    {name.length} / {MAX_NAME_LENGTH}
                </Span>
            }
        >
            <Input
                placeholder="Имя конфигурации"
                value={name}
                maxLength={MAX_NAME_LENGTH}
                onChange={(e) => {
                    const name = e.target.value.slice(0, MAX_NAME_LENGTH);
                    setName(name);
                }}
                size="xs"
            />
        </InputGroup>
    );
};
