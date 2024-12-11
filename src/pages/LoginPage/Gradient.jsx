import { useEffect, useRef } from "react";

function Gradient() {
    const interBubbleRef = useRef(null);
    const curPos = useRef({ x: 0, y: 0 });
    const tgPos = useRef({ x: 0, y: 0 });
    
    useEffect(() => {
        const move = () => {
            const { x: curX, y: curY } = curPos.current;
            const { x: tgX, y: tgY } = tgPos.current;

            curPos.current.x += (tgX - curX) / 20;
            curPos.current.y += (tgY - curY) / 20;

            if (interBubbleRef.current) {
                interBubbleRef.current.style.transform = `translate(${curPos.current.x}px, ${curPos.current.y}px)`;
            };

            requestAnimationFrame(move);
        };

        const handleMouseMove = (event) => {
            tgPos.current.x = event.clientX;
            tgPos.current.y = event.clientY;
        };
    
        window.addEventListener("mousemove", handleMouseMove);
        move();

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };

    }, []);

    return (
        <div className="gradient-bg">
            <svg xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
                        <feBlend in="SourceGraphic" in2="goo" />
                    </filter>
                </defs>
            </svg>
            <div className="gradients-container">
                <div className="g1"></div>
                <div className="g2"></div>
                <div className="g3"></div>
                <div className="g4"></div>
                <div className="g5"></div>
                <div className="interactive" ref={interBubbleRef}></div>
            </div>
        </div>  
    );
}

export default Gradient;
