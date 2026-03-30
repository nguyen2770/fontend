import { useState, useRef, useEffect } from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function TimeInput({
    value = null,
    defaultValue = "",
    onChange,
    placeholder = "HH:MM",
    style = {},
    disabled = false
}) {
    const inputRef = useRef(null);

    const getInitDigits = (val) => {
        if (!val) return "";
        if (dayjs.isDayjs(val)) return val.format("HHmm");
        return dayjs(val, "HH:mm").format("HHmm");
    };

    const [digits, setDigits] = useState(() =>
        getInitDigits(value || defaultValue)
    );

    useEffect(() => {
        if (value === null || value === undefined) {
            setDigits("");
        } else if (dayjs.isDayjs(value) && value.isValid()) {
            setDigits(value.format("HHmm"));
        }
    }, [value]);

    const clamp = (num, max) => {
        const n = parseInt(num || "0", 10);
        return Math.min(n, max).toString().padStart(2, "0");
    };

    const formatToHHMM = (d) => {
        if (!d) return "";

        if (d.length === 1) {
            const hh = clamp(d, 23);
            return `${hh}:00`;
        }

        if (d.length === 2) {
            const hh = clamp(d, 23);
            return `${hh}:00`;
        }

        if (d.length === 3) {
            const hh = clamp(d.slice(0, 2), 23);
            const mm = clamp("0" + d.slice(2), 59);
            return `${hh}:${mm}`;
        }

        if (d.length >= 4) {
            const hh = clamp(d.slice(0, 2), 23);
            const mm = clamp(d.slice(2, 4), 59);
            return `${hh}:${mm}`;
        }
    };

    const applyAutoColon = (d) => {
        if (d.length <= 2) return d;
        return d.slice(0, 2) + ":" + d.slice(2);
    };

    const getDigitsFromDisplay = (v) =>
        v.replace(/\D/g, "").slice(0, 4);

    const forceCaretToEnd = () => {
        const el = inputRef.current;
        if (!el) return;
        requestAnimationFrame(() => {
            el.selectionStart = el.value.length;
            el.selectionEnd = el.value.length;
        });
    };

    const emitDayjs = (digits) => {
        if (!digits) {
            onChange?.(null);
            return;
        }

        const formatted = formatToHHMM(digits);
        const [hh, mm] = formatted.split(":").map(Number);

        // ✅ Tạo dayjs object với ngày hôm nay + giờ/phút đã nhập
        const d = dayjs().hour(hh).minute(mm).second(0).millisecond(0);

        onChange?.(d);
    };

    const handleChange = (e) => {
        let v = e.target.value.replace(/[^\d:]/g, "");
        let d = getDigitsFromDisplay(v);

        setDigits(d);

        if (d.length === 4) {
            emitDayjs(d);
        }
    };

    const handleBlur = () => {
        emitDayjs(digits);
        if (digits) {
            const t = formatToHHMM(digits);
            setDigits(t.replace(":", ""));
        }
    };

    const displayValue = (() => {
        if (!digits) return "";
        if (digits.length === 4) return formatToHHMM(digits);
        return applyAutoColon(digits);
    })();

    return (
        <div style={{ position: "relative", width: "100%", ...style }}>
            <input
                ref={inputRef}
                value={displayValue}
                onChange={handleChange}
                disabled={disabled}
                onBlur={handleBlur}
                onClick={forceCaretToEnd}
                onKeyDown={forceCaretToEnd}
                placeholder={placeholder}
                style={{
                    width: "100%",
                    height: 32,
                    paddingRight: 26,
                    paddingLeft: 10,
                    boxSizing: "border-box",
                    display: "block",
                    border: "1px solid #d9d9d9",
                    borderRadius: 6,
                    fontSize: 14,
                    outline: "none",
                }}

                onMouseEnter={(e) => {
                    if (document.activeElement !== e.target) {
                        e.target.style.borderColor = "#4096ff";
                        e.target.style.boxShadow = "0 0 0 1px rgba(24,144,255,.2)";
                    }
                }}
                onMouseLeave={(e) => {
                    if (document.activeElement !== e.target) {
                        e.target.style.borderColor = "#d9d9d9";
                        e.target.style.boxShadow = "none";
                    }
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = "#4096ff";
                    e.target.style.boxShadow = "0 0 0 1px rgba(24,144,255,.2)";
                }}
                onBlurCapture={(e) => {
                    e.target.style.borderColor = "#d9d9d9";
                    e.target.style.boxShadow = "none";
                }}
            />
            <div
                style={{
                    position: "absolute",
                    right: 11,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    height: 16,
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <ClockCircleOutlined
                    style={{
                        fontSize: 16,
                        color: "rgba(0,0,0,0.25)",
                    }}
                />
            </div>


        </div>
    );
}