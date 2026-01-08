import React, { useCallback, useEffect, useState, useRef } from 'react';

interface RangeSliderProps {
    min: number;
    max: number;
    step?: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
    unit?: string;
}

/**
 * Slider bi-directionnel personnalisé pour PharmaGN.
 */
export const RangeSlider: React.FC<RangeSliderProps> = ({
    min,
    max,
    step = 1,
    value,
    onChange,
    unit = ""
}) => {
    const [minVal, setMinVal] = useState(value[0]);
    const [maxVal, setMaxVal] = useState(value[1]);
    const minValRef = useRef(value[0]);
    const maxValRef = useRef(value[1]);
    const range = useRef<HTMLDivElement>(null);

    // Convertir en pourcentage
    const getPercent = useCallback(
        (value: number) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );

    // Ajuster la barre de progression (track)
    useEffect(() => {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxValRef.current);

        if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [minVal, getPercent]);

    useEffect(() => {
        const minPercent = getPercent(minValRef.current);
        const maxPercent = getPercent(maxVal);

        if (range.current) {
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [maxVal, getPercent]);

    // Déclencher le onChange après modification
    useEffect(() => {
        setMinVal(value[0]);
        setMaxVal(value[1]);
        minValRef.current = value[0];
        maxValRef.current = value[1];
    }, [value]);

    return (
        <div className="flex flex-col gap-4 py-4 px-2">
            <div className="relative w-full h-1.5 bg-slate-100 rounded-full">
                <div
                    ref={range}
                    className="absolute h-full bg-primary rounded-full"
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={minVal}
                    onChange={(event) => {
                        const value = Math.min(Number(event.target.value), maxVal - step);
                        setMinVal(value);
                        minValRef.current = value;
                        onChange([value, maxVal]);
                    }}
                    className="thumb thumb--left"
                    style={{ zIndex: minVal > max - 100 ? "5" : undefined }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={maxVal}
                    onChange={(event) => {
                        const value = Math.max(Number(event.target.value), minVal + step);
                        setMaxVal(value);
                        maxValRef.current = value;
                        onChange([minVal, value]);
                    }}
                    className="thumb thumb--right"
                />
            </div>

            <div className="flex items-center justify-between mt-2">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Min</span>
                    <span className="text-[11px] font-bold text-slate-700">{minVal.toLocaleString()} {unit}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Max</span>
                    <span className="text-[11px] font-bold text-slate-700">{maxVal.toLocaleString()} {unit}</span>
                </div>
            </div>

            <style>{`
                .thumb,
                .thumb::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    -webkit-tap-highlight-color: transparent;
                }

                .thumb {
                    pointer-events: none;
                    position: absolute;
                    height: 0;
                    width: 100%;
                    outline: none;
                    background: transparent;
                    -webkit-appearance: none;
                }

                .thumb--left {
                    z-index: 3;
                }

                .thumb--right {
                    z-index: 4;
                }

                /* For Chrome browsers */
                .thumb::-webkit-slider-thumb {
                    background-color: #fff;
                    border: 2px solid #22c55e;
                    border-radius: 50%;
                    box-shadow: 0 0 1px 1px #ced4da;
                    cursor: pointer;
                    height: 18px;
                    width: 18px;
                    margin-top: 4px;
                    pointer-events: all;
                    position: relative;
                }

                /* For Firefox browsers */
                .thumb::-moz-range-thumb {
                    background-color: #fff;
                    border: 2px solid #22c55e;
                    border-radius: 50%;
                    box-shadow: 0 0 1px 1px #ced4da;
                    cursor: pointer;
                    height: 18px;
                    width: 18px;
                    margin-top: 4px;
                    pointer-events: all;
                    position: relative;
                }
            `}</style>
        </div>
    );
};
