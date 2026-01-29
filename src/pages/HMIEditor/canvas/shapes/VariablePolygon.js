import { Factory } from "konva/lib/Factory";
import { Shape } from "konva/lib/Shape";
import {
    getNumberOrArrayOfNumbersValidator,
    getNumberValidator,
} from "konva/lib/Validators";
import { _registerNode } from "konva/lib/Global";
import { Util } from "konva/lib/Util";
import Konva from "konva/lib/Core";

export class VariablePolygon extends Shape {
    _sceneFunc(context) {
        const points = this._getPoints(),
            sides = this.sides(),
            radiusX = this.radiusX(),
            radiusY = this.radiusY(),
            cornerRadius = this.cornerRadius();

        context.beginPath();

        if (!cornerRadius) {
            context.moveTo(points[0].x, points[0].y);
            for (let n = 1; n < points.length; n++) {
                context.lineTo(points[n].x, points[n].y);
            }
        } else {
            const baseRadius = Math.min(radiusX, radiusY);
            Util.drawRoundedPolygonPath(
                context,
                points,
                sides,
                baseRadius,
                cornerRadius,
            );
        }

        context.closePath();
        context.fillStrokeShape(this);
    }

    _getPoints() {
        const sides = this.attrs.sides || 3;
        const radiusX = this.attrs.radiusX || 0;
        const radiusY = this.attrs.radiusY || radiusX; // по умолчанию круг
        const points = [];

        for (let n = 0; n < sides; n++) {
            const angle = (n * 2 * Math.PI) / sides;
            points.push({
                x: radiusX * Math.sin(angle),
                y: -radiusY * Math.cos(angle),
            });
        }

        return points;
    }

    getSelfRect() {
        const points = this._getPoints();

        let minX = points[0].x;
        let maxX = points[0].x;
        let minY = points[0].y;
        let maxY = points[0].y;

        points.forEach((point) => {
            minX = Math.min(minX, point.x);
            maxX = Math.max(maxX, point.x);
            minY = Math.min(minY, point.y);
            maxY = Math.max(maxY, point.y);
        });

        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
        };
    }

    getWidth() {
        return this.radiusX() * 2;
    }

    getHeight() {
        return this.radiusY() * 2;
    }

    setWidth(width) {
        this.radiusX(width / 2);
    }

    setHeight(height) {
        this.radiusY(height / 2);
    }
}
VariablePolygon.prototype.className = "VariablePolygon";
VariablePolygon.prototype._centroid = true;
VariablePolygon.prototype._attrsAffectingSize = ["radiusX", "radiusY"];
_registerNode(VariablePolygon);

Konva.VariablePolygon = VariablePolygon;

Factory.addGetterSetter(VariablePolygon, "radiusX", 0, getNumberValidator());
Factory.addGetterSetter(VariablePolygon, "radiusY", 0, getNumberValidator());
Factory.addGetterSetter(VariablePolygon, "sides", 3, getNumberValidator());
Factory.addGetterSetter(
    VariablePolygon,
    "cornerRadius",
    0,
    getNumberOrArrayOfNumbersValidator(4),
);
