/* Для перехода страницы логов на jotai в неопределенном будущем... */
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const rowCountAtom = atomWithStorage("logRowCount", 100);
export const logNameAtom = atom("");
export const logSizeAtom = atom(0);
export const logTypeAtom = atom("");
export const logCreationDateAtom = atom("");

export const logPausedAtom = atom(false);
export const logTextWrapAtom = atomWithStorage("logTextWrap", true);
export const logTextSizeAtom = atomWithStorage("logTextSize", 14);
export const logFilterAtom = atomWithStorage("logFilter", {
    WARNING: true,
    ERROR: true,
    INFO: true
});

export const logRowsAtom = atom([]);
export const logPausedRowsAtom = atom([]);
