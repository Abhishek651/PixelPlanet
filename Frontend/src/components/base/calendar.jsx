import React from 'react';
import {
  Calendar as AriaCalendar,
  CalendarGrid,
  CalendarCell,
  Heading,
  Button as AriaButton,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarGridBody
} from 'react-aria-components';

export const Calendar = (props) => {
  return (
    <AriaCalendar {...props} className="w-full">
      <header className="flex items-center justify-between pb-4">
        <AriaButton slot="previous" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <span className="material-symbols-outlined">chevron_left</span>
        </AriaButton>
        <Heading className="text-lg font-semibold text-gray-900 dark:text-white" />
        <AriaButton slot="next" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <span className="material-symbols-outlined">chevron_right</span>
        </AriaButton>
      </header>
      <CalendarGrid className="w-full border-collapse">
        <CalendarGridHeader>
          {(day) => (
            <CalendarHeaderCell className="text-xs font-medium text-gray-500 dark:text-gray-400 pb-2 text-center">
              {day}
            </CalendarHeaderCell>
          )}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => (
            <CalendarCell
              date={date}
              className={({ isSelected, isDisabled, isOutsideMonth }) =>
                `w-10 h-10 text-sm rounded-lg flex items-center justify-center cursor-pointer
                ${isSelected ? 'bg-blue-600 text-white font-semibold' : ''}
                ${isDisabled ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : ''}
                ${isOutsideMonth ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}
                ${!isSelected && !isDisabled ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : ''}`
              }
            />
          )}
        </CalendarGridBody>
      </CalendarGrid>
    </AriaCalendar>
  );
};
