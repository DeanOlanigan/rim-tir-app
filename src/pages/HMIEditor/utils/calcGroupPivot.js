import { isHasRadius } from "./geometry";
import { getNodeLocalTransformMatrix } from "./getNodeLocalTransformMatrix";

export function calcGroupAABBCenter(nodesList) {
    let minX = Infinity,
        minY = Infinity;
    let maxX = -Infinity,
        maxY = -Infinity;

    nodesList.forEach((node) => {
        // Получаем матрицу трансформации
        const M = getNodeLocalTransformMatrix(node);

        // Получаем размеры (фоллбек на 0, если это точка)
        const w = node.width || 0;
        const h = node.height || 0;

        // Определяем 4 угла локального прямоугольника узла (до вращения)
        // Для Ellipse/Polygon у вас матрица уже сдвинута в центр,
        // поэтому локальные координаты углов будут относительны центра:
        // (-w/2, -h/2), (w/2, -h/2) и т.д.
        // НО! getNodeLocalTransformMatrix для Ellipse делает matTR(x+w/2...),
        // то есть она переносит "origin" в центр.

        // Давайте упростим:
        // Если матрица M переводит (0,0) в `node.x, node.y` (TopLeft),
        // то нам нужно трансформировать точки (0,0), (w,0), (w,h), (0,h).

        // Если матрица M переводит (0,0) в центр (как у вас для Ellipse),
        // то локальные углы это (-w/2, -h/2)...

        // Чтобы не путаться в типах фигур, проще работать с Top-Left логикой всегда:
        // 1. Берем Top-Left (x, y)
        // 2. Берем Bottom-Right (x+w, y+h)
        // 3. Вращаем их вокруг центра фигуры.

        // ЭВРИСТИКА (простая и надежная для вставки):
        // Просто берем 4 угла (TopLeft, TopRight, BottomRight, BottomLeft)
        // и прогоняем их через матрицу узла.

        // ВАЖНО: Ваша getNodeLocalTransformMatrix работает по-разному для типов.
        // Rect: (0,0) -> TopLeft.
        // Ellipse: (0,0) -> Center.

        const corners = [];
        if (isHasRadius(node.type)) {
            // Локальные углы относительно центра
            const hw = w / 2;
            const hh = h / 2;
            corners.push(
                { x: -hw, y: -hh },
                { x: hw, y: -hh },
                { x: hw, y: hh },
                { x: -hw, y: hh },
            );
        } else {
            // Локальные углы относительно Top-Left (стандарт)
            corners.push(
                { x: 0, y: 0 },
                { x: w, y: 0 },
                { x: w, y: h },
                { x: 0, y: h },
            );
        }

        corners.forEach((pt) => {
            // Применяем матрицу M к точке pt
            // x' = a*x + c*y + e
            // y' = b*x + d*y + f
            const gx = M.a * pt.x + M.c * pt.y + M.e;
            const gy = M.b * pt.x + M.d * pt.y + M.f;

            if (gx < minX) minX = gx;
            if (gx > maxX) maxX = gx;
            if (gy < minY) minY = gy;
            if (gy > maxY) maxY = gy;
        });
    });

    // Если нод не было или размеры некорректны
    if (minX === Infinity) return { x: 0, y: 0 };

    return {
        x: (minX + maxX) / 2,
        y: (minY + maxY) / 2,
    };
}
