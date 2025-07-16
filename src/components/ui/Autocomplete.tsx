import React, { useState } from "react";

interface Option {
  label: string;
  value: string;
}

interface AutocompleteProps {
  id: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  id,
  options,
  value,
  onChange,
  placeholder,
  disabled,
}) => {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(input.toLowerCase()) ||
      opt.value.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div style={{ position: "relative" }}>
      <input
        id={id}
        type="text"
        value={options.find((o) => o.value === value)?.label || input}
        onChange={(e) => {
          setInput(e.target.value);
          setOpen(true);
          onChange(""); // clear selection on typing
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full border rounded px-2 py-1"
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <ul
          style={{
            position: "absolute",
            zIndex: 10,
            background: "white",
            border: "1px solid #ddd",
            width: "100%",
            maxHeight: 180,
            overflowY: "auto",
            margin: 0,
            padding: 0,
            listStyle: "none",
          }}
        >
          {filtered.map((opt) => (
            <li
              key={opt.value}
              style={{
                padding: "6px 12px",
                cursor: "pointer",
                background: value === opt.value ? "#f3f4f6" : "white",
              }}
              onMouseDown={() => {
                onChange(opt.value);
                setInput(opt.label);
                setOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};