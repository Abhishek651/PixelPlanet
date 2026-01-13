import React from 'react';
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import {
  DatePicker as AriaDatePicker,
  Dialog as AriaDialog,
  Group,
  Label,
  DateInput,
  DateSegment,
  Button as AriaButton,
  Popover
} from "react-aria-components";
import { Button } from "./button";
import { Calendar } from "./calendar";

export const DatePicker = ({ 
  label, 
  value, 
  onChange, 
  minValue,
  className = '',
  required = false,
  ...props 
}) => {
  const handleChange = (date) => {
    if (onChange) {
      // Convert to ISO string for compatibility with existing code
      if (date) {
        const jsDate = new Date(date.year, date.month - 1, date.day);
        onChange(jsDate.toISOString());
      } else {
        onChange('');
      }
    }
  };

  // Convert ISO string to DateValue if value is provided
  const dateValue = value ? parseDate(value.split('T')[0]) : null;

  return (
    <AriaDatePicker
      value={dateValue}
      onChange={handleChange}
      minValue={minValue || today(getLocalTimeZone())}
      className={`flex flex-col gap-2 ${className}`}
      {...props}
    >
      {label && (
        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Group className="flex items-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden">
        <DateInput className="flex-1 px-4 py-2 flex items-center gap-1">
          {(segment) => (
            <DateSegment
              segment={segment}
              className="px-0.5 tabular-nums outline-none rounded-sm focus:bg-blue-600 focus:text-white text-gray-900 dark:text-white"
            />
          )}
        </DateInput>
        <AriaButton className="px-3 py-2 border-l border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
          <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">calendar_today</span>
        </AriaButton>
      </Group>
      <Popover className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 p-6 mt-2">
        <AriaDialog className="outline-none">
          <Calendar />
          <div className="grid grid-cols-2 gap-3 border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <Button size="md" color="secondary" onClick={() => onChange('')}>
              Clear
            </Button>
            <Button size="md" color="primary" onClick={(close) => close && close()}>
              Apply
            </Button>
          </div>
        </AriaDialog>
      </Popover>
    </AriaDatePicker>
  );
};

// DateTime Picker variant for datetime-local replacement
export const DateTimePicker = ({ 
  label, 
  value, 
  onChange, 
  minValue,
  className = '',
  required = false,
  ...props 
}) => {
  const handleChange = (date) => {
    if (onChange) {
      if (date) {
        // Create datetime string in local format
        const jsDate = new Date(date.year, date.month - 1, date.day);
        const dateTimeString = jsDate.toISOString().slice(0, 16);
        onChange(dateTimeString);
      } else {
        onChange('');
      }
    }
  };

  // Convert datetime-local string to DateValue
  const dateValue = value ? parseDate(value.split('T')[0]) : null;

  return (
    <AriaDatePicker
      value={dateValue}
      onChange={handleChange}
      minValue={minValue || today(getLocalTimeZone())}
      className={`flex flex-col gap-2 ${className}`}
      {...props}
    >
      {label && (
        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Group className="flex items-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden">
        <DateInput className="flex-1 px-4 py-2 flex items-center gap-1">
          {(segment) => (
            <DateSegment
              segment={segment}
              className="px-0.5 tabular-nums outline-none rounded-sm focus:bg-blue-600 focus:text-white text-gray-900 dark:text-white"
            />
          )}
        </DateInput>
        <input
          type="time"
          defaultValue="23:59"
          className="px-3 py-2 border-l border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white outline-none"
        />
        <AriaButton className="px-3 py-2 border-l border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
          <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">calendar_today</span>
        </AriaButton>
      </Group>
      <Popover className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 p-6 mt-2">
        <AriaDialog className="outline-none">
          <Calendar />
          <div className="grid grid-cols-2 gap-3 border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <Button size="md" color="secondary" onClick={() => onChange('')}>
              Clear
            </Button>
            <Button size="md" color="primary" onClick={(close) => close && close()}>
              Apply
            </Button>
          </div>
        </AriaDialog>
      </Popover>
    </AriaDatePicker>
  );
};
