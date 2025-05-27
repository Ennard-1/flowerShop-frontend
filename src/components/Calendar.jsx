import React, { useState } from 'react'

function Calendar({ selected, onSelect, availableDays = [], specificAvailableDates = [] }) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const formatDateToDDMMYYYY = (date) => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const isAvailable = (date) => {
    const formatted = formatDateToDDMMYYYY(date)
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    const dayName = dayNames[date.getDay()]

    return specificAvailableDates.includes(formatted) || availableDays.includes(dayName)
  }

  const generateCalendarDays = (monthDate) => {
    const year = monthDate.getFullYear()
    const month = monthDate.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)

    const firstWeekDay = firstDayOfMonth.getDay()
    const daysInMonth = lastDayOfMonth.getDate()

    const days = []

    for (let i = firstWeekDay - 1; i >= 0; i--) {
      const d = new Date(year, month, -i)
      days.push({ date: d, currentMonth: false })
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i)
      days.push({ date: d, currentMonth: true })
    }

    while (days.length % 7 !== 0) {
      const lastDate = days[days.length - 1].date
      const d = new Date(lastDate)
      d.setDate(d.getDate() + 1)
      days.push({ date: d, currentMonth: false })
    }

    return days
  }

  const days = generateCalendarDays(currentMonth)
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  return (
    <div className="w-full max-w-4xl mx-auto p-2">
      <header className="flex justify-between items-center mb-4">
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
            )
          }
          className="px-3 py-1 rounded text-dark hover:bg-gray-200 transition-colors"
          aria-label="Mês anterior"
          type="button"
        >
          ‹
        </button>

        <h2 className="text-2xl font-bold text-dark capitalize">
          {currentMonth.toLocaleString('default', { month: 'long' })}{' '}
          {currentMonth.getFullYear()}
        </h2>

        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
            )
          }
          className="px-3 py-1 rounded text-dark hover:bg-gray-200 transition-colors"
          aria-label="Próximo mês"
          type="button"
        >
          ›
        </button>
      </header>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted mb-2">
        {dayNames.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map(({ date, currentMonth: isCurrent }, idx) => {
          const isSelected = selected === formatDateToDDMMYYYY(date)
          const isDateAvailable = isCurrent && isAvailable(date)
          const baseTextClass = isCurrent ? 'text-dark' : 'text-muted'
          const selectedClasses = isSelected
            ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-600'
            : ''
          const unavailableClasses = !isDateAvailable
            ? 'opacity-30 cursor-not-allowed'
            : 'hover:bg-blue-200 hover:text-blue-600 focus:ring-2 focus:ring-blue-400'

          return (
            <button
              key={idx}
              onClick={() => {
                if (isDateAvailable) onSelect(formatDateToDDMMYYYY(date))
              }}
              disabled={!isDateAvailable}
              className={`
                w-full aspect-square rounded-md
                ${baseTextClass} ${selectedClasses} ${unavailableClasses}
                focus:outline-none
                transition-colors
              `}
              aria-pressed={isSelected}
              type="button"
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar
