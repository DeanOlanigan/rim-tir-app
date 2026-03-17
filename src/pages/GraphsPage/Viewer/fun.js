const HOST = import.meta.env.VITE_HTTP_HOST;

const DIRS = [
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
];

function readU16LE(v, o) {
    return v[o] | (v[o + 1] << 8);
}
function readU32LE(v, o) {
    return (v[o] | (v[o + 1] << 8) | (v[o + 2] << 16) | (v[o + 3] << 24)) >>> 0;
}

async function loadBin() {
    const bin = await fetch(`${HOST}/fun`).then((r) => r.arrayBuffer());
    const v = new Uint8Array(bin);
    let o = 0;

    const magic = String.fromCharCode(v[0], v[1], v[2], v[3]);
    o += 4;
    if (magic !== "CHN8") {
        throw new Error("Invalid magic");
    }
    const width = readU16LE(v, o);
    o += 2;
    const height = readU16LE(v, o);
    o += 2;
    const fps = readU16LE(v, o);
    o += 2;
    const frames = readU32LE(v, o);
    o += 4;
    o += 8;

    const frameOffsets = new Uint32Array(frames);
    for (let fi = 0; fi < frames; fi++) {
        frameOffsets[fi] = o;
        const contourCount = readU16LE(v, o);
        o += 2;
        for (let ci = 0; ci < contourCount; ci++) {
            o += 1;
            o += 1;
            o += 2;
            o += 2;
            o += 4;
            const packedLen = readU32LE(v, o);
            o += 4;
            o += packedLen;
        }
    }

    return { v, width, height, fps, frames, frameOffsets };
}

function unpack3bit(u8, nSteps) {
    const out = new Uint8Array(nSteps);
    let acc = 0,
        bits = 0,
        p = 0,
        i = 0;
    let b = 0;
    const N = u8.length;
    while (i < nSteps) {
        if (bits < 3) {
            if (p >= N) break;
            b = u8[p++];
            acc |= b << bits;
            bits += 8;
        }
        out[i++] = acc & 7;
        acc >>= 3;
        bits -= 3;
    }
    return out;
}

function decodeFrame(meta, fi) {
    const { v, width, height, frameOffsets } = meta;
    let o = frameOffsets[fi];
    const contourCount = readU16LE(v, o);
    o += 2;
    const countours = [];

    for (let ci = 0; ci < contourCount; ci++) {
        const depth = v[o++];
        const closed = v[o++];
        const x0 = readU16LE(v, o);
        o += 2;
        const y0 = readU16LE(v, o);
        o += 2;
        const steps = readU32LE(v, o);
        o += 4;
        const packedLen = readU32LE(v, o);
        o += 4;
        const packed = v.slice(o, o + packedLen);
        o += packedLen;

        const dirs = unpack3bit(packed, steps);

        const pts = [];
        const test = [];
        let x = x0,
            y = y0;

        pts.push({
            x: x / (width - 1),
            y: 1.0 - y / (height - 1),
        });

        for (let k = 0; k < dirs.length; k++) {
            const d = DIRS[dirs[k]];
            x += d[0];
            y += d[1];
            pts.push({
                x: x / (width - 1),
                y: 1.0 - y / (height - 1),
            });
        }

        countours.push({ depth, closed, pts, test });
    }

    return countours;
}

export async function useBadApple(graphRef, type) {
    if (type !== "badapple") return;

    const data = await loadBin();
    console.log("data loaded", data);

    graphRef.current.options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        events: [],
        parsing: false,
        normalized: true,
        scales: {
            y: { display: true, min: 0, max: 1, type: "linear" },
            x: { display: true, min: 0, max: 1, type: "linear" },
        },
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
        },
    };

    graphRef.current.update("none");

    let raf = 0;
    let t0 = 0;

    function loop(ts) {
        if (!t0) t0 = ts;
        const t = (ts - t0) / 1000;
        const f = Math.min(data.frames - 1, Math.floor(t * data.fps));

        const contours = decodeFrame(data, f);
        graphRef.current.data.datasets = contours.map((c) => ({
            data: c.pts,
            pointStyle: false,
            borderWidth: 1,
            borderColor: "rgb(110, 20, 20)",
            tension: 0,
        }));
        graphRef.current.update("none");

        if (f >= frames - 1) {
            cancelAnimationFrame(raf);
            return;
        }
        raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);
}
