import { apiv2 } from "./baseUrl";

export async function getGraphPoints(start, end, points, variables) {
    const params = new URLSearchParams({
        start: start.toString(),
        end: end.toString(),
        points: points.toString(),
        vars: Object.values(variables)
            .map((v) => v.name)
            .join(","),
    });

    const { data } = await apiv2.get(`/api/v2/graph?${params.toString()}`);
    return data;
}
