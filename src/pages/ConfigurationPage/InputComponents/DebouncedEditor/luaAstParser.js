import { parse } from "luaparse";

export function luaAstParse(code) {
    let ast, error;
    try {
        ast = parse(code, { locations: true, ranges: true });
    } catch (e) {
        error = e;
    }
    return { ast, error };
}
