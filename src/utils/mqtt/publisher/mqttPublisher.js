/*  eslint-disable sonarjs/pseudo-random */

import { mqttClient } from "../mqttClient";

const pubConsoleStyle = "color: #fff; background: #a520a5ff; padding: 2px 4px;";

const DEFAULTS = {
    periodMs: 1000,
    jitter: 0.25,
    topicBase: "test",
    retain: true,
    source: "mixed",
};

let timer = null;
const values = new Map();
const kinds = new Map();

function pickSource(opt) {
    if (opt.source === "mixed") {
        const arr = ["modbus", "iec104", "iec61850"];
        return arr[Math.floor(Math.random() * arr.length)];
    }
    return opt.source;
}

function roll(p) {
    return Math.random() < p;
}

function qualityOk() {
    const attrs = [];
    if (roll(0.5)) attrs.push("additionalCalc");
    if (roll(0.7)) attrs.push("used");
    if (roll(0.15)) attrs.push("blocked");
    if (roll(0.2)) attrs.push("overflow");
    if (roll(0.25)) attrs.push("unknown");
    if (roll(0.6)) attrs.push("manual");
    if (roll(0.4)) attrs.push("substituted");
    if (roll(0.35)) attrs.push("notTopical");
    if (roll(0.2)) attrs.push("invalid");

    const good = !attrs.some((a) =>
        [
            "blocked",
            "overflow",
            "unknown",
            "manual",
            "substituted",
            "notTopical",
            "invalid",
        ].includes(a)
    );

    return { good, attrs };
}

function nextValue(uuid) {
    let kind = kinds.get(uuid);
    if (!kind) {
        kind = roll(0.3) ? "bool" : "float";
        kinds.set(uuid, kind);
    }
    if (kind === "bool") {
        return { v: roll(0.5), kind };
    }
    const prev = values.get(uuid) ?? 20 + Math.random() * 10;
    const step = (Math.random() - 0.5) * 4;
    let next = prev + step;
    if (next < 0) next = 0;
    if (next > 100) next = 100;
    values.set(uuid, next);
    return { v: next, kind };
}

export function startMockPublisher(uuids, opts) {
    stopMockPublisher();

    const opt = { ...DEFAULTS, ...(opts ?? {}) };

    const uniq = Array.from(new Set(uuids)).filter(Boolean);
    if (uniq.length === 0) {
        console.warn("[MQTT PUBLISHER] no uuids provided");
        return;
    }

    const tick = () => {
        const batchSize = Math.max(1, Math.floor(uniq.length * 0.2));
        for (let i = 0; i < batchSize; i++) {
            const uuid = uniq[Math.floor(Math.random() * uniq.length)];
            /* console.log(
                `%c[MQTT PUBLISHER] random uuid chosen: ${uuid}`,
                pubConsoleStyle
            ); */
            const { v } = nextValue(uuid);
            const payload = {
                v,
                q: qualityOk(),
                src: pickSource(opt),
                st: Date.now(),
                ver: 1,
            };
            const topic = `${opt.topicBase}/node/${uuid}`;
            mqttClient.publish(topic, JSON.stringify(payload), {
                qos: 0,
                retain: opt.retain,
            });
        }
    };

    const period = Math.max(200, opt.periodMs);
    const shedule = () => {
        tick();
        const rand = 1 + (Math.random() * 2 - 1) * opt.jitter;
        /* console.log(
            "%c[MQTT PUBLISHER] next tick in",
            pubConsoleStyle,
            period * rand,
            "ms"
        ); */
        timer = setTimeout(shedule, period * rand);
    };

    shedule();
    console.log(
        `%c[MQTT PUBLISHER] started, ${uniq.length} uuids, base=${opt.topicBase}`,
        pubConsoleStyle
    );
}

export function stopMockPublisher() {
    if (timer) {
        clearTimeout(timer);
        timer = null;
        console.log("%c[MQTT PUBLISHER] stopped", pubConsoleStyle);
    }
    values.clear();
    kinds.clear();
}
