import { LuHexagon } from "react-icons/lu";
import { MAX_POLY_CORNERS } from "../../constants";
import { PropertyInput } from "../PropertyInput";

export const SidesBlock = ({ ids }) => {
    return (
        <PropertyInput
            ids={ids}
            property="sides"
            label={<LuHexagon />}
            min={3}
            max={MAX_POLY_CORNERS}
        />
    );
};
