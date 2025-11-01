"use client"

import { useEffect, useRef, useState } from "react";
import { ScaleSelectorProps } from "./interface";

const ScaleSelector: React.FC<ScaleSelectorProps> = ({ scale, scales, setScale }) => {
    const [indx, setIndx] = useState(0);
    const containerRef2 = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (scales.length === 0) return;
        const newIndx = scales.indexOf(scale);
        setIndx(newIndx >= 0 ? newIndx : 0);
    }, [scale, scales]);

    useEffect(() => {
        if (scales.length === 0) return;
        setScale(scales[indx].toString());
    }, [indx, scales, setScale]);

    useEffect(() => {
        const container = containerRef2.current;
        if (!container || scales.length === 0) return;
        
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            
            setIndx(prevIndx => {
                return e.deltaY < 0
                    ? prevIndx > 0 ? prevIndx - 1 : scales.length - 1
                    : prevIndx < (scales.length - 1) ? prevIndx + 1 : 0;
            });
        };

        container.addEventListener("wheel", handleWheel);
        return () => container.removeEventListener("wheel", handleWheel);
    }, [scales]);

    const handleUp = () => {
        setIndx(prev => prev > 0 ? prev - 1 : scales.length - 1);
    };

    const handleDown = () => {
        setIndx(prev => prev < scales.length - 1 ? prev + 1 : 0);
    };

    if (scales.length === 0) {
        return <div className="flex flex-col min-h-1/2" />;
    }

    return (
        <div ref={containerRef2} className="flex flex-col min-h-1/2">
            <button onClick={handleUp} className="cursor-pointer bg-transparent italic rounded max-h-6 text-violet-500/75 text-center hover:text-gray-500 active:text-white">
                prev scale
            </button>
            <h4 className="text-white/15 text-lg text-center select-none">
                {indx <= 0 ? scales[scales.length - 1] : scales[indx - 1]}
            </h4>
            <h4 className="text-white text-4xl font-bold text-center text-wrap cursor-n-resize select-none">
                {scales[indx]}
            </h4>
            <h4 className="text-white/15 text-lg text-center select-none">
                {indx >= (scales.length - 1) ? scales[0] : scales[indx + 1]}
            </h4>
            <button onClick={handleDown} className="cursor-pointer bg-transparent italic rounded max-h-6 text-violet-500/75 text-center hover:text-gray-500 active:text-white">
                next scale
            </button>
        </div>
    );
}

export default ScaleSelector;