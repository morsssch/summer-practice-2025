import type { JSX } from 'react';
import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import './DatePicker.scss';
import { Calendar } from 'lucide-react';

type DatePickerType = 'single' | 'range';

export interface DatePickerProps {
  type?: DatePickerType;
  value: string | [string, string] | null; // ISO string(s)
  onChange: (value: string | [string, string] | null) => void;
  label?: string;
  placeholder?: string | [string, string];
  required?: boolean;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  autoFocus?: boolean;
  dateFormat?: string;
  errorMessage?: string;
  weekStart?: 0 | 1;
  withTime?: boolean;
}

export interface DatePickerRef {
  validate: () => boolean;
  focus: () => void;
}

const DatePicker = forwardRef<DatePickerRef, DatePickerProps>((props, ref) => {
  const {
    type = 'single',
    value,
    onChange,
    label,
    placeholder = type === 'single' ? 'ДД.ММ.ГГГГ' : ['Начало', 'Конец'],
    required = false,
    disabled = false,
    minDate,
    maxDate,
    className = '',
    autoFocus = false,
    dateFormat = 'dd.mm.yyyy',
    errorMessage = 'Недопустимая дата',
    weekStart = 1,
    withTime = false,
  } = props;

  const formatDate = (date: Date | null): string => {
    if (!date || isNaN(date.getTime())) {
      return '';
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return dateFormat
      .toLowerCase()
      .replace('dd', day)
      .replace('mm', month)
      .replace('yyyy', String(year));
  };

  const formatTime = (date: Date | null): string => {
    if (!date || isNaN(date.getTime())) {
      return '';
    }
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const parseDateString = (str: string): Date | null => {
    const formatParts = dateFormat.toLowerCase().split(/[.\-/]/);
    const valueParts = str.split(/[.\-/]/);
    if (formatParts.length !== 3 || valueParts.length !== 3) {
      return null;
    }
    const day = parseInt(valueParts[formatParts.indexOf('dd')], 10);
    const month = parseInt(valueParts[formatParts.indexOf('mm')], 10) - 1;
    const year = parseInt(valueParts[formatParts.indexOf('yyyy')], 10);
    const date = new Date(year, month, day);
    return date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day
      ? date
      : null;
  };

  const parseTimeString = (str: string, baseDate: Date | null): Date | null => {
    if (!baseDate) {
      return null;
    }
    const [hours, minutes] = str.split(':').map(Number);
    if (
      isNaN(hours) ||
      isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return null;
    }
    const newDate = new Date(baseDate);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  };

  const formatRange = (
    range: [Date | null, Date | null] | null,
  ): [string, string] =>
    range ? [formatDate(range[0]), formatDate(range[1])] : ['', ''];

  const formatRangeTime = (
    range: [Date | null, Date | null] | null,
  ): [string, string] =>
    range ? [formatTime(range[0]), formatTime(range[1])] : ['', ''];

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const getDateFromISO = (iso: string | null): Date | null =>
    iso ? new Date(iso) : null;

  const toISO = (date: Date | null): string | null =>
    date && !isNaN(date.getTime()) ? date.toISOString() : null;

  // --------------------------
  // STATE
  // --------------------------
  const initialDate =
    type === 'single' && typeof value === 'string'
      ? getDateFromISO(value)
      : Array.isArray(value) && value[0]
        ? getDateFromISO(value[0])
        : new Date();
  const [inputValue, setInputValue] = useState<string | [string, string]>(
    type === 'single'
      ? formatDate(initialDate)
      : formatRange(
          Array.isArray(value)
            ? (value.map(getDateFromISO) as [Date | null, Date | null])
            : null,
        ),
  );
  const [inputTime, setInputTime] = useState<string | [string, string]>(
    withTime
      ? type === 'single'
        ? formatTime(initialDate)
        : formatRangeTime(
            Array.isArray(value)
              ? (value.map(getDateFromISO) as [Date | null, Date | null])
              : null,
          )
      : '',
  );
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(initialDate as Date);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // --------------------------
  // VALIDATION
  // --------------------------
  const validateDate = (date: Date | null): boolean => {
    if (required && !date) {
      return false;
    }
    if (date && minDate && date < minDate) {
      return false;
    }
    if (date && maxDate && date > maxDate) {
      return false;
    }
    return true;
  };

  const setDateError = (date: Date | null) => {
    if (required && !date) {
      setError(errorMessage);
    } else if (date && minDate && date < minDate) {
      setError(`Минимальная дата: ${formatDate(minDate)}`);
    } else if (date && maxDate && date > maxDate) {
      setError(`Максимальная дата: ${formatDate(maxDate)}`);
    } else {
      setError('');
    }
  };

  const validateRange = (dates: [Date | null, Date | null]): boolean => {
    const [start, end] = dates;
    if (required && (!start || !end)) {
      return false;
    }
    if (start && end && start > end) {
      return false;
    }
    if (start && minDate && start < minDate) {
      return false;
    }
    if (end && maxDate && end > maxDate) {
      return false;
    }
    return true;
  };

  const setRangeError = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    if (required && (!start || !end)) {
      setError(errorMessage);
    } else if (start && end && start > end) {
      setError('Начало должно быть раньше конца');
    } else if (start && minDate && start < minDate) {
      setError(`Минимальная дата: ${formatDate(minDate)}`);
    } else if (end && maxDate && end > maxDate) {
      setError(`Максимальная дата: ${formatDate(maxDate)}`);
    } else {
      setError('');
    }
  };

  // --------------------------
  // EVENT HANDLERS
  // --------------------------
  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index = 0,
  ) => {
    const val = e.target.value;

    if (type === 'single') {
      setInputValue(val);
      const parsed = parseDateString(val);
      const timeStr = typeof inputTime === 'string' ? inputTime : '';
      const finalDate = parsed ? combineDateTime(parsed, timeStr) : null;
      onChange(toISO(finalDate));
      if (parsed) {
        setCurrentMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
      }
    } else {
      const copy = [...(inputValue as [string, string])] as [string, string];
      copy[index] = val;
      setInputValue(copy);
      const parsed = copy.map(parseDateString) as [Date | null, Date | null];
      const timeStrs = inputTime as [string, string];
      const finalDates: [Date | null, Date | null] = [
        parsed[0] ? combineDateTime(parsed[0], timeStrs[0]) : null,
        parsed[1] ? combineDateTime(parsed[1], timeStrs[1]) : null,
      ];
      onChange(
        finalDates[0] && finalDates[1]
          ? [toISO(finalDates[0])!, toISO(finalDates[1])!]
          : null,
      );
      if (parsed[index]) {
        setCurrentMonth(
          new Date(parsed[index]!.getFullYear(), parsed[index]!.getMonth(), 1),
        );
      }
    }
    setTouched(true);
  };

  const handleTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index = 0,
  ) => {
    const val = e.target.value;

    if (type === 'single') {
      setInputTime(val);
      const date = parseDateString(inputValue as string);
      if (date) {
        const finalDate = combineDateTime(date, val);
        if (finalDate) {
          onChange(toISO(finalDate));
        } else {
          onChange(null);
        }
      }
    } else {
      const copy = [...(inputTime as [string, string])] as [string, string];
      copy[index] = val;
      setInputTime(copy);
      const dates = (inputValue as [string, string]).map(parseDateString) as [
        Date | null,
        Date | null,
      ];
      if (dates[0] && dates[1]) {
        const finalDates: [Date | null, Date | null] = [
          combineDateTime(dates[0], copy[0]),
          combineDateTime(dates[1], copy[1]),
        ];
        if (finalDates[0] && finalDates[1]) {
          onChange([toISO(finalDates[0])!, toISO(finalDates[1])!]);
        } else {
          onChange(null);
        }
      }
    }
    setTouched(true);
  };

  const combineDateTime = (date: Date, timeStr: string): Date | null => {
    if (!timeStr) {
      const now = new Date();
      date.setHours(now.getHours(), now.getMinutes(), 0, 0);
      return date;
    }
    return parseTimeString(timeStr, date);
  };

  const handleBlur = () => {
    setTouched(true);

    if (type === 'single') {
      const str = inputValue as string;
      const parsed = parseDateString(str);
      setDateError(parsed);
      setInputValue(formatDate(parsed));
      if (parsed && withTime && typeof inputTime === 'string') {
        const finalDate = combineDateTime(parsed, inputTime);
        onChange(toISO(finalDate));
      } else if (!parsed) {
        onChange(null);
      }
    } else {
      const raw = inputValue as [string, string];
      const parsed = raw.map(parseDateString) as [Date | null, Date | null];
      setRangeError(parsed);
      setInputValue(formatRange(parsed));
      if (parsed[0] && parsed[1] && withTime && Array.isArray(inputTime)) {
        const finalDates: [Date | null, Date | null] = [
          combineDateTime(parsed[0], inputTime[0]),
          combineDateTime(parsed[1], inputTime[1]),
        ];
        if (finalDates[0] && finalDates[1]) {
          onChange([toISO(finalDates[0])!, toISO(finalDates[1])!]);
        } else {
          onChange(null);
        }
      } else if (!parsed[0] || !parsed[1]) {
        onChange(null);
      }
    }
  };

  const handleDateSelect = (date: Date) => {
    const now = new Date();
    date.setHours(now.getHours(), now.getMinutes(), 0, 0);
    if (type === 'single') {
      setInputValue(formatDate(date));
      if (withTime) {
        setInputTime(formatTime(date));
      }
      onChange(toISO(date));
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
      setIsOpen(false);
      setError('');
    } else {
      const [start, end] = (inputValue as [string, string]).map(
        parseDateString,
      ) as [Date | null, Date | null];
      const newRange: [Date | null, Date | null] =
        !start || (start && end) ? [date, null] : [start, date];
      setInputValue(formatRange(newRange));
      if (withTime) {
        const timeStrs = inputTime as [string, string];
        setInputTime([
          newRange[0] ? formatTime(newRange[0]) : timeStrs[0],
          newRange[1] ? formatTime(newRange[1]) : timeStrs[1],
        ]);
      }
      const complete = newRange[0] && newRange[1];
      if (complete) {
        setIsOpen(false);
        if (withTime) {
          const finalDates: [Date | null, Date | null] = [
            combineDateTime(newRange[0]!, (inputTime as [string, string])[0]),
            combineDateTime(newRange[1]!, (inputTime as [string, string])[1]),
          ];
          if (finalDates[0] && finalDates[1]) {
            onChange([toISO(finalDates[0])!, toISO(finalDates[1])!]);
            setRangeError(finalDates);
          } else {
            onChange(null);
            setError('Недопустимое время');
          }
        } else {
          onChange([toISO(newRange[0])!, toISO(newRange[1])!]);
          setRangeError(newRange);
        }
      } else {
        onChange(null);
        setError('');
      }
      if (newRange[0]) {
        setCurrentMonth(
          new Date(newRange[0].getFullYear(), newRange[0].getMonth(), 1),
        );
      }
    }
  };

  const handleMonthChange = (offset: number) => {
    const m = new Date(currentMonth);
    m.setMonth(m.getMonth() + offset);
    setCurrentMonth(m);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  // --------------------------
  // CALENDAR RENDER
  // --------------------------
  const daysOfWeek =
    weekStart === 1
      ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
      : ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  const generateCalendarDays = (): JSX.Element[] => {
    const days: JSX.Element[] = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const offset =
      weekStart === 1
        ? startDayOfWeek === 0
          ? 6
          : startDayOfWeek - 1
        : startDayOfWeek;

    for (let i = 0; i < offset; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="calendar-day outside"
        />,
      );
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dayDate = new Date(year, month, d);
      const disabledDay =
        (minDate && dayDate < minDate) || (maxDate && dayDate > maxDate);
      const selected =
        (type === 'single' &&
          typeof value === 'string' &&
          isSameDay(getDateFromISO(value)!, dayDate)) ||
        (Array.isArray(value) &&
          value.some((v) => v && isSameDay(getDateFromISO(v)!, dayDate)));

      days.push(
        <div
          key={`day-${d}`}
          className={`calendar-day${disabledDay ? ' disabled' : ''}${selected ? ' selected' : ''}`}
          onClick={() => !disabledDay && handleDateSelect(dayDate)}
        >
          {d}
        </div>,
      );
    }

    return days;
  };

  // --------------------------
  // EFFECTS & REF
  // --------------------------
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!value) {
      setInputValue(type === 'single' ? '' : ['', '']);
      if (withTime) {
        setInputTime(type === 'single' ? '' : ['', '']);
      }
      setCurrentMonth(new Date());
      setError('');
    } else {
      const dates =
        type === 'single'
          ? getDateFromISO(value as string)
          : ((value as [string, string]).map(getDateFromISO) as [
              Date | null,
              Date | null,
            ]);
      setInputValue(
        type === 'single'
          ? formatDate(dates as Date)
          : formatRange(dates as [Date, Date]),
      );
      if (withTime) {
        setInputTime(
          type === 'single'
            ? formatTime(dates as Date)
            : formatRangeTime(dates as [Date, Date]),
        );
      }
      if (dates instanceof Date && !isNaN(dates.getTime())) {
        setCurrentMonth(new Date(dates.getFullYear(), dates.getMonth(), 1));
      } else if (
        Array.isArray(dates) &&
        dates[0] &&
        !isNaN(dates[0].getTime())
      ) {
        setCurrentMonth(
          new Date(dates[0].getFullYear(), dates[0].getMonth(), 1),
        );
      }
    }
  }, [value, type, dateFormat, withTime]);

  useImperativeHandle(ref, () => ({
    validate: () => {
      setTouched(true);
      if (type === 'single') {
        const parsed = parseDateString(inputValue as string);
        setDateError(parsed);
        return validateDate(parsed);
      } else {
        const parsed = (inputValue as [string, string]).map(
          parseDateString,
        ) as [Date | null, Date | null];
        setRangeError(parsed);
        return validateRange(parsed);
      }
    },
    focus: () => {
      if (type === 'single') {
        inputRef.current?.focus();
      } else {
        startRef.current?.focus();
      }
    },
  }));

  // --------------------------
  // JSX
  // --------------------------
  return (
    <div
      ref={wrapperRef}
      className={`date-picker ${className} ${disabled ? 'disabled' : ''}`}
    >
      {label && (
        <label className="date-picker-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      {type === 'single' ? (
        <div className="date-input-wrapper">
          <div className="input-group">
            <input
              ref={inputRef}
              type="text"
              value={inputValue as string}
              onChange={(e) => handleDateChange(e)}
              onBlur={handleBlur}
              onFocus={() => setIsOpen(true)}
              placeholder={placeholder as string}
              disabled={disabled}
              required={required}
              autoFocus={autoFocus}
              className={`date-input ${error && touched ? 'error' : ''}`}
            />
            {withTime && (
              <input
                ref={timeRef}
                type="text"
                value={inputTime as string}
                onChange={(e) => handleTimeChange(e)}
                onBlur={handleBlur}
                placeholder="чч:мм"
                disabled={disabled}
                className={`time-input ${error && touched ? 'error' : ''}`}
              />
            )}
          </div>
          <button
            type="button"
            className="calendar-toggle"
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
          >
            <Calendar />
          </button>
        </div>
      ) : (
        <div className="range-input-wrapper">
          <div className="input-group">
            <input
              ref={startRef}
              type="text"
              value={(inputValue as [string, string])[0]}
              onChange={(e) => handleDateChange(e, 0)}
              onBlur={handleBlur}
              onFocus={() => setIsOpen(true)}
              placeholder={(placeholder as [string, string])[0]}
              disabled={disabled}
              required={required}
              className={`date-input ${error && touched ? 'error' : ''}`}
            />
            {withTime && (
              <input
                ref={startTimeRef}
                type="text"
                value={(inputTime as [string, string])[0]}
                onChange={(e) => handleTimeChange(e, 0)}
                onBlur={handleBlur}
                placeholder="чч:мм"
                disabled={disabled}
                className={`time-input ${error && touched ? 'error' : ''}`}
              />
            )}
          </div>
          <span className="range-separator">—</span>
          <div className="input-group">
            <input
              ref={endRef}
              type="text"
              value={(inputValue as [string, string])[1]}
              onChange={(e) => handleDateChange(e, 1)}
              onBlur={handleBlur}
              onFocus={() => setIsOpen(true)}
              placeholder={`${(placeholder as [string, string])[1]}`}
              disabled={disabled}
              required={required}
              className={`date-input ${error && touched ? 'error' : ''}`}
            />
            {withTime && (
              <input
                ref={endTimeRef}
                type="text"
                value={(inputTime as [string, string])[1]}
                onChange={(e) => handleTimeChange(e, 1)}
                onBlur={handleBlur}
                placeholder="чч:мм"
                disabled={disabled}
                className={`time-input ${error && touched ? 'error' : ''}`}
              />
            )}
          </div>
          <button
            type="button"
            className="calendar-toggle"
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
          >
            <Calendar />
          </button>
        </div>
      )}

      {isOpen && (
        <div className="calendar-popup">
          <div className="calendar-header">
            <button
              type="button"
              className="month-nav prev"
              onClick={() => handleMonthChange(-1)}> {'<'} </button>
            <div className="current-month">
              {currentMonth.toLocaleDateString('ru-RU', {
                month: 'long',
                year: 'numeric',
              })}
            </div>
            <button
              type="button"
              className="month-nav next"
              onClick={() => handleMonthChange(1)}> {'>'} </button>
          </div>
          <div className="calendar-grid">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="day-header"
              >
                {day}
              </div>
            ))}
            {generateCalendarDays()}
          </div>
        </div>
      )}
      {error && touched && <div className="error-message">{error}</div>}
    </div>
  );
});

export default DatePicker;
