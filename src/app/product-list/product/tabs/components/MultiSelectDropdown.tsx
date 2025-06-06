"use client";

import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronDown, X } from "lucide-react";
import clsx from "clsx";

// ── Dropdown option interface ───────────────────────────────────────────────
export interface DropdownOption {
  value: string;
  display_name: string;
}

// ── Props for MultiSelectDropdown component ────────────────────────────────
interface MultiSelectDropdownProps {
  label: string;
  options: DropdownOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

// ── MultiSelectDropdown component ──────────────────────────────────────────
export default function MultiSelectDropdown({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = "Select options",
}: MultiSelectDropdownProps) {
  // ── Toggle selection of an option ──────────────────────────────
  const handleToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  // ── Clear all selected options ────────────────────────────────
  const clearAll = () => onChange([]);

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="w-full">
      {/* ── Label ────────────────────────────────────────── */}
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>

      {/* ── Listbox for multi-select ────────────────────── */}
      <Listbox value={selectedValues} onChange={onChange} multiple>
        <div className="relative">
          {/* ── Button to open dropdown ───────────────────── */}
          <Listbox.Button
            className="
              relative w-full cursor-default rounded-md
              bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-600
              py-2 pl-3 pr-10 text-left text-sm
              text-gray-900 dark:text-gray-100
              shadow-sm dark:shadow-none
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
            "
          >
            <span className="block truncate">
              {selectedValues.length > 0
                ? options
                    .filter(opt => selectedValues.includes(opt.value))
                    .map(opt => opt.display_name)
                    .join(", ")
                : placeholder}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </span>
          </Listbox.Button>

          {/* ── Dropdown options with transition ───────────── */}
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className="
                absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md
                bg-white dark:bg-gray-800
                py-1 text-sm text-gray-900 dark:text-gray-100
                shadow-lg ring-1 ring-black dark:ring-white ring-opacity-5 dark:ring-opacity-10
                focus:outline-none
              "
            >
              {options.map(option => (
                <Listbox.Option key={option.value} value={option.value} as={Fragment}>
                  {({ active, selected }) => (
                    <li
                      className={clsx(
                        "cursor-default select-none relative py-2 pl-10 pr-4",
                        active ? "bg-red-100 dark:bg-red" : "",
                        selected ? "font-medium text-gray-900 dark:text-gray-100" : "font-normal"
                      )}
                      onClick={() => handleToggle(option.value)}
                    >
                      <span className="block truncate">{option.display_name}</span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <Check className="h-4 w-4 text-green-600" />
                        </span>
                      )}
                    </li>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

      {/* ── Selected tags and clear button ───────────────── */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedValues.map(value => {
            const item = options.find(opt => opt.value === value);
            return (
              <span
                key={value}
                className="
                  flex items-center gap-1 px-2 py-1 text-sm
                  bg-gray-100 dark:bg-gray-700
                  text-gray-900 dark:text-gray-100
                  rounded-full
                "
              >
                {item?.display_name || value}
                <button
                  onClick={() => handleToggle(value)}
                  className="hover:text-red-600 dark:hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            );
          })}
          <button
            onClick={clearAll}
            className="text-sm text-red-500 dark:text-red-400 hover:underline ml-auto"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
