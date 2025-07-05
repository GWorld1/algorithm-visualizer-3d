"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  value?: string
  defaultValue?: string
  placeholder?: string
  options: SelectOption[]
  onValueChange?: (value: string) => void
  disabled?: boolean
  className?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    value, 
    defaultValue, 
    placeholder, 
    options, 
    onValueChange, 
    disabled = false, 
    className,
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [selectedValue, setSelectedValue] = React.useState(value || defaultValue || '')
    const selectRef = React.useRef<HTMLDivElement>(null)

    // Handle controlled/uncontrolled state
    const currentValue = value !== undefined ? value : selectedValue

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (optionValue: string) => {
      if (value === undefined) {
        setSelectedValue(optionValue)
      }
      onValueChange?.(optionValue)
      setIsOpen(false)
    }

    const selectedOption = options.find(option => option.value === currentValue)
    const displayText = selectedOption?.label || placeholder || 'Select...'

    return (
      <div ref={selectRef} className="relative">
        {/* Hidden native select for form compatibility */}
        <select
          ref={ref}
          value={currentValue}
          onChange={(e) => handleSelect(e.target.value)}
          className="sr-only"
          disabled={disabled}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom select trigger */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            isOpen && "ring-2 ring-ring ring-offset-2",
            className
          )}
        >
          <span className={cn(
            currentValue ? "text-white" : "text-gray-400"
          )}>
            {displayText}
          </span>
          <ChevronDown className={cn(
            "h-4 w-4 opacity-50 transition-transform",
            isOpen && "rotate-180"
          )} />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className={cn(
            "absolute top-full z-50 mt-1 w-full rounded-md border bg-popover shadow-md",
            "animate-in fade-in-0 zoom-in-95"
          )}>
            <div className="max-h-60 overflow-auto p-1 ">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  disabled={option.disabled}
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                    "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                    "disabled:pointer-events-none disabled:opacity-50 text-muted-foreground",
                    currentValue === option.value && "bg-accent text-accent-foreground"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
)

Select.displayName = "Select"

export { Select }
