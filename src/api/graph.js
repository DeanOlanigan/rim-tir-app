//import { apiv2 } from "./baseUrl";

export async function getGraphPoints(start, end, points, variables) {
    /* const params = new URLSearchParams({
        start: start.toString(),
        end: end.toString(),
        points: points.toString(),
        vars: Object.values(variables)
            .map((v) => v.name)
            .join(","),
    });

    const { data } = await apiv2.get(`/api/v2/graph?${params.toString()}`);
    return data; */

    return genAnswer(start, end, points, variables);
}

function genAnswer(start, end, points, variables) {
    const out = [];
    const timeStep = (end - start) / points;

    for (const v of Object.values(variables)) {
        for (let i = 0; i < points; i++) {
            const t = start + i * timeStep;
            // eslint-disable-next-line
            const value = Math.sin(i / 5) * 20 + 50 + Math.random() * 5; // синусоида + шум
            out.push({
                ts: new Date(t),
                name: v.name,
                type: v.type,
                unit: v.unit,
                group: v.group,
                value,
            });
        }
    }

    return out;
}
