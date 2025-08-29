import { delay, http, HttpResponse } from "msw";


//fs не сработал, нужно будет упростить проверку токинов и выхода 

function generateJWT(payload, timer) {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT"}));
    const deathTime = Date.now() + (timer === "15m" ? 15*60*1000 : 8*60*60*1000);
    payload = { login: payload, deathTime };
    const body = btoa(JSON.stringify(payload));
    return `${header}.${body}.mock-signature`;
}

function checkTokenPayload(token, login) {
    if (token === null || login === null) return false;
    const payload = atob(token.split(".")[1]);
    const payloadObj = JSON.parse(payload);
    if (payloadObj.login === login) return true;
    return false;
}

function checkTokenDeathTime(token) {
    if (token === null) return false;
    const body = atob(token.split(".")[1]);
    const deathTime = JSON.parse(body);
    if (deathTime.deathTime > Date.now()) return true;
    return false;
}

function refresher(refreshToken) {
    if (checkTokenDeathTime(refreshToken) === false) return "REFRESHER IS END";
    const decoded = JSON.parse(atob(refreshToken.split(".")[1]));
    const newAccessToken = generateJWT(decoded.login, "15m");
    return newAccessToken;
}

export const handelers = [
    http.post("/api/v2/login", async ({ request }) => {
        const requestBody = await request.json();
        await delay(1000);
        if ( requestBody.login !== "admin" || requestBody.password !== "rimtir") return HttpResponse.json({ msg: "Invalid login or password"}, {status: 401});
        const accessToken = generateJWT(requestBody.login, "15m");
        const refreshToken = generateJWT(requestBody.login, "8h");
        return HttpResponse.json(
            {
                content: requestBody.content,
                accessToken: accessToken,
                refreshToken: refreshToken,
                login: requestBody.login
            },
            {
                status: 201
            }
        );
    }),

    http.post("/api/v3/refresh", async ({ request }) => {
        const result = await request.json();
        const refreshToken = result.refreshToken;
        const accessToken = result.accessToken;
        const loginForACheck = result.login;
        await delay(1000);
        if (!checkTokenPayload(refreshToken, loginForACheck) || !checkTokenPayload(accessToken, loginForACheck) || !accessToken || !refreshToken) return HttpResponse.json({msg: "Unforbidden"}, {status: 403});
        if (checkTokenDeathTime(accessToken)) return HttpResponse.json({msg: "Token is Alive", accessToken: accessToken}, {status: 200});
        try {
            const newAccessToken = refresher(refreshToken);
            if (newAccessToken === "REFRESHER IS END") return HttpResponse.json({msg: "Refresh token is over"}, {status: 401});
            return HttpResponse.json({
                msg: "Token has been refreshed",
                accessToken: newAccessToken
            },
            {
                status: 201
            });
        } catch {
            return HttpResponse.json(
                {
                    status: 403
                }
            );
        }
    }),

    http.post("/api/v3/loggingout", async ({ request }) => {
        const requestBody = await request.json();
        await delay(1000);
        const accessToken = requestBody.accessToken;
        const loginForACheck = requestBody.login;
        if (!checkTokenPayload(accessToken, loginForACheck)) return HttpResponse.json({ msg: "каюк" }, { status: 500});
        return HttpResponse.json(
            {   
                status: 200
            }
        );
    }),

    http.post("/api/v2/checkToken", async ({ request }) => {
        //if (request.token === null) return HttpResponse.json({msg: "Unforbidden"}, {status: 403});
        const requestBody = await request.json();
        if (!requestBody) return HttpResponse.json({ msg: "Unauthorizied"}, { status: 401});
        const tokenForACheck = requestBody.token;
        const loginForACheck = requestBody.login;
        //console.log(refreshTokens);
        if (!checkTokenPayload(tokenForACheck, loginForACheck)) return HttpResponse.json({ msg: "Unauthorizied"}, { status: 401});
        return HttpResponse.json(
            {
                msg: "Authorizied",
                answer: true
            },
            {
                status: 200
            }
        );
    })
];