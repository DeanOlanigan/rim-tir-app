import { LuSpline } from "react-icons/lu";
import { ACTIONS } from "../../constants";

export function createVertexTool() {
    return {
        name: ACTIONS.vertex,
        label: "Vertex Editor",
        icon: LuSpline,
        cursor: "default",

        onDblClick(e, ctx) {
            ctx.manager.setActive(ACTIONS.select);
        },

        cancel(ctx) {
            ctx.manager.setActive(ACTIONS.select);
        },
    };
}
