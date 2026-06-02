"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";

/* ─────────────────────────────────────────────
   Custom Select — کامپوننت انتخابگر سفارشی
───────────────────────────────────────────── */
interface SelectOption {
    value: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder: string;
}

function CustomSelect({ value, onChange, options, placeholder }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleOutside(e: MouseEvent | TouchEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleOutside);
        document.addEventListener("touchstart", handleOutside);
        return () => {
            document.removeEventListener("mousedown", handleOutside);
            document.removeEventListener("touchstart", handleOutside);
        };
    }, []);

    useEffect(() => {
        if (isOpen && value && listRef.current) {
            const selected = listRef.current.querySelector("[data-selected='true']") as HTMLElement;
            if (selected) {
                selected.scrollIntoView({ block: "nearest" });
            }
        }
    }, [isOpen, value]);

    const selectedLabel = options.find((o) => o.value === value)?.label;

    return (
        <div ref={ref} className="relative flex-1 min-w-0">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={`
                    w-full flex items-center justify-between gap-1
                    border rounded-xl px-2 sm:px-3 py-3
                    text-sm font-medium
                    transition-all duration-200 cursor-pointer select-none
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1ED760]/40
                    ${isOpen
                        ? "border-[#1ED760] bg-[#181818] shadow-[0_0_0_3px_rgba(30,215,96,0.08)]"
                        : "border-[#2a2a2a] bg-[#121212] hover:border-[#3a3a3a] hover:bg-[#161616]"
                    }
                `}
            >
                <span className={`truncate ${selectedLabel ? "text-white" : "text-slate-500"}`}>
                    {selectedLabel ?? placeholder}
                </span>
                <ChevronDown
                    className={`
                        shrink-0 w-3.5 h-3.5 transition-all duration-200
                        ${isOpen ? "rotate-180 text-[#1ED760]" : "text-slate-500"}
                    `}
                />
            </button>

            <div
                className={`
                    absolute top-[calc(100%+6px)] left-0 right-0 z-[9999]
                    bg-[#181818] border border-[#2a2a2a] rounded-xl
                    shadow-[0_8px_32px_rgba(0,0,0,0.6)]
                    overflow-hidden
                    transition-all duration-200 origin-top
                    ${isOpen
                        ? "opacity-100 scale-y-100 pointer-events-auto"
                        : "opacity-0 scale-y-95 pointer-events-none"
                    }
                `}
                style={{ transformOrigin: "top" }}
            >
                <div
                    ref={listRef}
                    className="max-h-52 overflow-y-auto scrollbar-hide"
                    style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#2a2a2a transparent",
                    }}
                >
                    {options.map((opt) => {
                        const isSelected = opt.value === value;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                data-selected={isSelected}
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={`
                                    w-full cursor-pointer text-left flex items-center justify-between
                                    px-3 py-2.5 text-sm
                                    transition-colors duration-100
                                    ${isSelected
                                        ? "bg-[#1ED760]/10 text-[#1ED760] font-medium"
                                        : "text-slate-200 hover:bg-white/[0.05] active:bg-white/[0.08]"
                                    }
                                `}
                            >
                                <span>{opt.label}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   BirthDatePicker — منطق اصلاح شده تاریخ
───────────────────────────────────────────── */
interface BirthDatePickerProps {
    value: string;
    onChange: (value: string) => void;
}

export default function BirthDatePicker({ value, onChange }: BirthDatePickerProps) {
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    useEffect(() => {
        if (value) {
            const parts = value.split("-");
            if (parts.length === 3) {
                setYear(parts[0]);
                setMonth(parts[1]); // ذخیره عددی مثل 01, 02, 03
                setDay(parts[2]);
            }
        }
    }, [value]);

    useEffect(() => {
        if (day && month && year) {
            const newValue = `${year}-${month}-${day}`;
            if (newValue !== value) {
                onChange(newValue);
            }
        }
    }, [day, month, year, onChange, value]);

    const yearOptions = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 100 }, (_, i) => {
            const y = String(currentYear - i);
            return { value: y, label: y };
        });
    }, []);

    const monthOptions = useMemo(() => {
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        return months.map((name, index) => ({
            value: String(index + 1).padStart(2, "0"), // ذخیره عددی
            label: name, // نمایش به صورت اسم ماه
        }));
    }, []);

    const dayOptions = useMemo(() => {
        const daysInMonth =
            month && year
                ? new Date(Number(year), Number(month), 0).getDate()
                : 31;

        return Array.from({ length: daysInMonth }, (_, i) => {
            const d = String(i + 1).padStart(2, "0");
            return { value: d, label: d };
        });
    }, [month, year]);

    const handleMonthChange = (newMonth: string) => {
        setMonth(newMonth);
        const daysInNewMonth = new Date(Number(year || 2000), Number(newMonth), 0).getDate();
        if (Number(day) > daysInNewMonth) {
            setDay("");
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <label className="flex items-center gap-2 text-sm text-slate-400">
                <Calendar className="w-4 h-4" />
                تاریخ تولد (میلادی)
                <span className="text-red-500">*</span>
            </label>

            <div className="flex gap-2 w-full" dir="ltr">
                <CustomSelect
                    value={year}
                    onChange={setYear}
                    options={yearOptions}
                    placeholder="سال"
                />
                <CustomSelect
                    value={month}
                    onChange={handleMonthChange}
                    options={monthOptions}
                    placeholder="ماه"
                />
                <CustomSelect
                    value={day}
                    onChange={setDay}
                    options={dayOptions}
                    placeholder="روز"
                />
            </div>
        </div>
    );
}