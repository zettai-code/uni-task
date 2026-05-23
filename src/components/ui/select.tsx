'use client'

import { type SelectHTMLAttributes, forwardRef } from 'react'

interface SelectOption {
  readonly value: string
  readonly label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  readonly label?: string
  readonly error?: string
  readonly options: readonly SelectOption[]
  readonly placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ label, error, options, placeholder, className = '', id, ...props }, ref) {
    const selectId = id ?? label?.replace(/\s/g, '-').toLowerCase()

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)
