import { http, HttpResponse } from "msw";

let refreshTokens = [];

function generateJWT(payload, timer) {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT"}));
    const deathTime = Date.now() + (timer === "15m" ? 15*60*1000 : 7*24*60*60*100);
    payload = { ...payload, deathTime };
    const body = btoa(JSON.stringify(payload));
    return `${header}.${body}.mock-signature`;
}

export const handelers = [
    http.post("/api/v2/login", async ({ request }) => {
        //const authToken = request.headers.get("Autorization");
        //if (!authToken) return HttpResponse.json({ msg: "Unauthorizied "}, { status: 401});
        const requestBody = await request.json();
        if ( requestBody.login !== "admin" && requestBody.password !== "rimtir") return HttpResponse.json({ msg: "Invalid login or password"}, {status: 401});
        const accessToken = generateJWT(requestBody.login, "15m");
        const refreshToken = generateJWT(requestBody.login, "7d");
        refreshTokens.push(refreshToken);
        //console.log(refreshTokens);
        //const requestBody = await request.json();
        return HttpResponse.json(
            {
                content: requestBody.content,
                accessToken: accessToken,
                refreshToken: refreshToken,
            },
            {
                status: 200
            }
        );
    }),

    http.post("/api/v2/refresh", async ({ request }) => {
        const refreshToken = await request.json();
        if (!refreshTokens.includes(refreshToken)) return HttpResponse.json({msg: "Unforbidden"}, {status: 403});
        try {
            const decoded = JSON.parse(atob(refreshToken.split(".")[1]));
            const newAccessToken = generateJWT(decoded, "15m");
            HttpResponse.json({
                accessToken: newAccessToken
            },
            {
                status: 200
            });
        } catch {
            HttpResponse.json(
                {
                    status: 403
                }
            );
        }
    }),

    http.post("/api/v2/logout", async ({ request }) => {
        const refreshToken = await request.json();
        refreshToken.filter(t => t !== refreshToken);
        HttpResponse.json(
            {
                status: 200
            }
        );
    }),

    http.post("/api/v2/checkToken", async ({ request }) => {
        const refreshToken = await request.json();
        console.log(refreshToken);
        //console.log(refreshTokens);
        if (!refreshTokens.includes(refreshToken)) return HttpResponse.json({ msg: "Unauthorizied", body: JSON.stringify(refreshToken)}, { status: 401});
        return HttpResponse.json(
            {
                msg: "Authorizied",
                result: 1
            },
            {
                status: 200
            }
        );
    })
];