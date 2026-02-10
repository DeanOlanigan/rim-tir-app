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
import { LOCALE } from "@/pages/HMIEditor/constants";

export const TypographyBlock = ({ ids }) => {
    return (
        <VStack align={"start"} w={"100%"}>
            <Heading size={"md"}>{LOCALE.typography}</Heading>
            <FontSizeBlock ids={ids} />
            <TextInputBlock ids={ids} />
            <HStack w={"100%"} justify={"space-between"}>
                <LineHeightBlock ids={ids} />
                <LetterSpacingBlock ids={ids} />
            </HStack>
            <HStack w={"100%"} justify={"space-between"}>
                <TextAlignHBlock ids={ids} />
                <TextAlignVBlock ids={ids} />
            </HStack>
            <HStack w={"100%"} justify={"space-between"} align={"end"}>
                <TextWrapBlock ids={ids} />
                <EllipsisBlock ids={ids} />
            </HStack>
            <PaddingBlock ids={ids} />
            <HStack w={"100%"} justify={"space-between"}>
                <TextDecorationBlock ids={ids} />
                <TextStyleBlock ids={ids} />
            </HStack>
        </VStack>
    );
};
