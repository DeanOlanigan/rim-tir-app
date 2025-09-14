import { ErrorDraft } from "../../core/ErrorDraft";
export { validateCyclicVariable } from "./validateCyclicVariable";
export { validateCodeNew } from "./validateCode";
export { validateCode } from "./validateCodeOld";
export { luaAstParse } from "./luaAstParser";
export function setLuaCodeError(id, errorMsg, draft = new ErrorDraft()) {
    draft.set(id, "luaExpression", "code", errorMsg ? errorMsg : []);
    return draft;
}
