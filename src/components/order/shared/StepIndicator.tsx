"use client";

type Props = {
    step: number;
    onStepOneClick: () => void;
};

export default function StepIndicator({ step, onStepOneClick }: Props) {
    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            {[1, 2, 3, 4].map((num) => (
                <div key={num} className="flex items-center">
                    {num === 1 ? (
                        <button
                            type="button"
                            onClick={onStepOneClick}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                                step >= num ? "bg-[#1ED760] text-black" : "bg-slate-800 text-slate-400"
                            } ${step > 1 ? "cursor-pointer" : "cursor-default"}`}
                        >
                            {num}
                        </button>
                    ) : (
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                                step >= num ? "bg-[#1ED760] text-black" : "bg-slate-800 text-slate-400"
                            }`}
                        >
                            {num}
                        </div>
                    )}

                    {num < 4 && (
                        <div
                            className={`w-12 h-1 transition-colors ${step > num ? "bg-[#1ED760]" : "bg-slate-800"}`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}