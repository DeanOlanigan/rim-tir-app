import { http, HttpResponse } from "msw";


//fs не сработал, нужно будет упростить проверку токинов и выхода 

function generateJWT(payload, timer) {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT"}));
    const deathTime = Date.now() + (timer === "15m" ? 15*60*1000 : 8*60*60*1000);
    payload = { login: payload, deathTime };
    const body = btoa(JSON.stringify(payload));
    return `${header}.${body}.mock-signature`;
}

function checkTokenPayload(token, login) {
    console.log(token, " ПРИВЕТЬ");
    console.log(login, " GJRFFff");
    if (token === null || login === null) return false;
    const payload = atob(token.split(".")[1]);
    const payloadObj = JSON.parse(payload);
    console.log(payloadObj.deathTime);
    console.log(payloadObj.login === login ? "TRUE" : "FALSE");
    if (payloadObj.login === login) return true;
    return false;
}

function checkTokenDeathTime(token) {
    if (token === null) return false;
    const body = atob(token.split(".")[1]);
    const deathTime = JSON.parse(body);
    console.log("Death Time:", deathTime.deathTime);
    console.log("Date now:", Date.now());
    if (deathTime - Date.now() > 0) return true;
    return false;
}

function refresher(refreshToken) {
    if (checkTokenDeathTime(refreshToken) === false) return "KAKA";
    const decoded = JSON.parse(atob(refreshToken.split(".")[1]));
    const newAccessToken = generateJWT(decoded, "15m");
    return newAccessToken;
}

export const handelers = [
    http.post("/api/v2/login", async ({ request }) => {
        const requestBody = await request.json();
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
                status: 200
            }
        );
    }),

    http.post("/api/v2/refresh", async ({ request }) => {
        const result = await request.json();
        const refreshToken = result.refreshToken;
        const accessToken = result.accessToken;
        const loginForACheck = result.login;
        console.log("ACCESS:", accessToken);
        if (!checkTokenPayload(refreshToken, loginForACheck) && !checkTokenPayload(accessToken, loginForACheck)) return HttpResponse.json({msg: "Unforbidden"}, {status: 403});
        if (!checkTokenDeathTime(accessToken)) return HttpResponse.json({msg: "Token is Alive", accessToken: accessToken}, {status: 200});
        try {
            const newAccessToken = refresher(refreshToken);
            if (newAccessToken === "KAKA") return HttpResponse.json({msg: "Refresh token is over"}, {status: 400});
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

    http.post("/api/v3/loggingout", async ({ request }) => {
        const requestBody = await request.json();
        const accessToken = requestBody.accessToken;
        const loginForACheck = requestBody.login;
        if (!checkTokenPayload(accessToken, loginForACheck)) return HttpResponse.json({ msg: "каюк" }, { status: 500});
        HttpResponse.json(
            {   
                status: 200
            }
        );
    }),

    http.post("/api/v2/checkToken", async ({ request }) => {
        const requestBody = await request.json();
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