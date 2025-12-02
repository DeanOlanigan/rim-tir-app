import { Heading, HStack, VStack } from "@chakra-ui/react";
import { LineHeightBlock } from "./LineHeight";
import { LetterSpacingBlock } from "./LetterSpacing";
import { TextAlignHBlock } from "./TextAlignH";
import { TextAlignVBlock } from "./TextAlignV";
import { FontSizeBlock } from "./FontSize";
import { TextWrapBlock } from "./TextWrap";
import { EllipsisBlock } from "./Ellipsis";
import { PaddingBlock } from "./Padding";
import { TextDecorationBlock } from "./TextDecoration";
import { TextStyleBlock } from "./TextStyle";
import { TextInputBlock } from "./TextInput";

export const TypographyBlock = ({ node }) => {
    return (
        <VStack align={"start"} w={"100%"}>
            <Heading size={"md"}>Typography</Heading>
            <FontSizeBlock node={node} />
            <TextInputBlock node={node} />
            <HStack w={"100%"} justify={"space-between"}>
                <LineHeightBlock node={node} />
                <LetterSpacingBlock node={node} />
            </HStack>
            <HStack w={"100%"} justify={"space-between"}>
                <TextAlignHBlock node={node} />
                <TextAlignVBlock node={node} />
            </HStack>
            <HStack w={"100%"} justify={"space-between"} align={"end"}>
                <TextWrapBlock node={node} />
                <EllipsisBlock node={node} />
            </HStack>
            <PaddingBlock node={node} />
            <HStack w={"100%"} justify={"space-between"}>
                <TextDecorationBlock node={node} />
                <TextStyleBlock node={node} />
            </HStack>
        </VStack>
    );
};
