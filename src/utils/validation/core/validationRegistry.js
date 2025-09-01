import { VALIDATOR } from "../utils/const";
import { uniqueCompositeValidator } from "../rules/node/uniqueCompositeValidator";
import {
    mustBeValidator,
    rangeValidator,
    regexValidator,
    requiredValidator,
    uniqueValidator,
} from "../rules/parameter";

export const validatorRegistry = {
    [VALIDATOR.RANGE]: rangeValidator,
    [VALIDATOR.REGEX]: regexValidator,
    [VALIDATOR.UNIQUE]: uniqueValidator,
    [VALIDATOR.REQUIRED]: requiredValidator,
    [VALIDATOR.UNIQUECOMPOSITE]: uniqueCompositeValidator,
    [VALIDATOR.MUSTBE]: mustBeValidator,
};
