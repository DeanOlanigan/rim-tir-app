import { Icon } from "@chakra-ui/react";

export const TirLoaderIcon = ({ ...props }) => (
    <Icon {...props}>
        <svg viewBox="0 20 550 450">
            <g>
                <path
                    style={{
                        fill: "rgb(11, 72, 9)",
                    }}
                    d="M 299.784 418.898 L 327.588 326.215 L 262.712 391.094 L 244.174 316.946 L 207.101 418.898 L 114.417 418.898 C 114.381 418.898 207.101 150.117 207.101 150.117 L 299.784 150.117 L 318.32 224.265 L 392.467 150.117 L 485.15 150.117 L 392.467 418.898 L 299.784 418.898 Z"
                />
                <path
                    style={{
                        fill: "rgb(18, 124, 16)",
                    }}
                    d="M 290.516 409.629 L 318.32 316.946 L 253.442 381.824 L 234.906 307.679 L 197.833 409.629 L 105.15 409.629 C 105.113 409.629 197.833 140.85 197.833 140.85 L 290.516 140.85 L 309.053 214.995 L 383.199 140.85 L 475.882 140.85 L 383.199 409.629 L 290.516 409.629 Z"
                />
                <animateTransform
                    type="scale"
                    additive="sum"
                    attributeName="transform"
                    values="1 1;1.05 1.05;1 1"
                    dur="2s"
                    fill="freeze"
                    keyTimes="0; 0.5; 1"
                    calcMode="spline"
                    keySplines="0 0 0.58 1; 0 0 0.58 1"
                    repeatCount="indefinite"
                />
                <animateMotion
                    path="M 3.628 4.422 L 3.628 -16.286"
                    calcMode="spline"
                    dur="2s"
                    fill="freeze"
                    keyTimes="0; 0.5; 1"
                    keyPoints="0; 1; 0"
                    repeatCount="indefinite"
                    keySplines="0 0 0.58 1; 0 0 0.58 1"
                />
            </g>
            <g>
                <path
                    style={{ fill: "rgb(132, 132, 132)" }}
                    d="M 63.315 391.25 L 154.475 87.379 L 346.917 87.379 C 417.82 87.379 387.433 300.089 296.275 300.089 L 194.985 300.089 L 164.605 391.25 L 63.315 391.25 Z M 261.215 239.315 C 281.475 239.315 306.405 158.283 276.015 158.283 L 235.495 158.283 L 210.565 239.315 L 261.215 239.315 Z"
                />
                <path
                    style={{ fill: "rgb(255, 255, 255)" }}
                    d="M 53.185 381.121 L 144.345 77.25 L 336.788 77.25 C 407.691 77.25 377.304 289.96 286.145 289.96 L 184.855 289.96 L 154.475 381.121 L 53.185 381.121 Z M 251.085 229.186 C 271.345 229.186 296.275 148.154 265.885 148.154 L 225.365 148.154 L 200.445 229.186 L 251.085 229.186 Z"
                />
                <animateMotion
                    path="M 0.789 1.69 L 0.789 -19.018"
                    calcMode="spline"
                    dur="2s"
                    fill="freeze"
                    keyTimes="0; 0.5; 1"
                    keyPoints="0; 1; 0"
                    keySplines="0 0 0.58 1; 0 0 0.58 1"
                    repeatCount="indefinite"
                />
                <animateTransform
                    type="scale"
                    additive="sum"
                    attributeName="transform"
                    values="1 1;1.05 1.05;1 1"
                    dur="2s"
                    fill="freeze"
                    keyTimes="0; 0.5; 1"
                    calcMode="spline"
                    keySplines="0.42 0 1 1; 0.42 0 1 1"
                    repeatCount="indefinite"
                />
            </g>
        </svg>
    </Icon>
);
