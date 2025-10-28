"use client"
import { useEffect, useRef, useState } from "react";
import { ScaleSelectorProps } from "./interface";

const ScaleSelector: React.FC<ScaleSelectorProps> = ({ scale, scales, setScale }) => {
    const [indx, setIndx] = useState(scales.indexOf(scale));
    const containerRef2 = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        setIndx(scales.indexOf(scale));
    }, [scale, scales]);

    useEffect(() => {
        setScale(String(scales[indx]));
    }, [indx, scale, setScale]);

    useEffect(() => {
        setIndx(0)
        const container = containerRef2.current;
        if (!container) return;
        
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            
            setIndx(prevIndx => {
                if (e.deltaY < 0) {
                    return prevIndx > 0 ? prevIndx - 1 : scales.length - 1;
                } else {
                    return prevIndx < (scales.length - 1) ? prevIndx + 1 : 0;
                }
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

    return (
        <div ref={containerRef2} className="flex flex-col min-h-1/2">
            <button onClick={handleUp} className="bg-transparent italic rounded max-h-6 text-violet-500/75 text-center hover:text-gray-500 active:text-white">
                prev scale
            </button>
            <h4 className="font-mono text-white/15 text-lg text-center"> {indx <= 0 ? scales[scales.length-1] : scales[indx-1]} </h4>
            <h4 className="font-mono text-white text-4xl font-bold text-center text-wrap"> {scales[indx]} </h4>
            <h4 className="font-mono text-white/15 text-lg text-center"> {indx >= (scales.length-1) ? scales[0] : scales[indx+1]} </h4>
            <button onClick={handleDown} className="bg-transparent italic rounded max-h-6 text-violet-500/75 text-center hover:text-gray-500 active:text-white">
                next scale
            </button>
        </div>
    );
}

export default ScaleSelector;