import React, { useState } from 'react'
import Calendar from './Calendar'

export default function DateTimeDialog({ open, onClose, onSelect, settings }) {
  const [step, setStep] = useState('date')
  const [selectedDate, setSelectedDate] = useState(null) // "DD/MM/YYYY"
  const [selectedTime, setSelectedTime] = useState('12:00')
  const [error, setError] = useState('')

  if (!open) return null

  // converte "DD/MM/YYYY" para "YYYY-MM-DD"
  const formatDateForSettings = (dateStr) => {
    const [day, month, year] = dateStr.split('/')
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  // obtém dia da semana em português a partir de um objeto Date
  const getDayName = (date) => {
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    return dayNames[date.getDay()]
  }

  // verifica se data está disponível no calendário (data ou dia da semana)
  const isDateAvailable = (dateStr) => {
    const dateFormatted = formatDateForSettings(dateStr)
    if (settings.specificAvailableDates && settings.specificAvailableDates[dateFormatted]) {
      return true
    }
    // verifica se o dia da semana está em availableSchedule
    const [day, month, year] = dateStr.split('/').map(Number)
    const date = new Date(year, month - 1, day)
    const dayName = getDayName(date)
    return !!settings.availableSchedule[dayName]
  }

  // verifica se horário está dentro de algum intervalo válido para a data selecionada
  const isValidTime = () => {
    if (!selectedDate) return false
    const dateFormatted = formatDateForSettings(selectedDate)
    const [selectedHour, selectedMinute] = selectedTime.split(':').map(Number)
    const selectedTotal = selectedHour * 60 + selectedMinute

    // primeiro verifica se existe um intervalo específico para a data
    let intervals = []
    if (settings.specificAvailableDates && settings.specificAvailableDates[dateFormatted]) {
      intervals = settings.specificAvailableDates[dateFormatted]
    } else {
      // usa intervalo do dia da semana
      const [day, month, year] = selectedDate.split('/').map(Number)
      const date = new Date(year, month - 1, day)
      const dayName = getDayName(date)
      intervals = settings.availableSchedule[dayName] || []
    }

    // verifica se selectedTime está dentro de algum intervalo
    return intervals.some(({ start, end }) => {
      const [startH, startM] = start.split(':').map(Number)
      const [endH, endM] = end.split(':').map(Number)
      const startTotal = startH * 60 + startM
      const endTotal = endH * 60 + endM
      return selectedTotal >= startTotal && selectedTotal <= endTotal
    })
  }

  const handleDateSelect = (dateStr) => {
    if (!isDateAvailable(dateStr)) {
      setError('Data indisponível para entrega. Por favor, escolha outro dia.')
      return
    }

    setSelectedDate(dateStr)
    setError('')
    setStep('time')
  }

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value)
    if (error) setError('')
  }

  const handleConfirm = () => {
    if (!isValidTime()) {
      setError('Horário indisponível para entrega nesta data. Por favor, escolha outro horário.')
      return
    }

    setError('')
    onSelect({ date: selectedDate, time: selectedTime })
    onClose()
    setStep('date')
    setSelectedDate(null)
    setSelectedTime('12:00')
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        {step === 'date' && (
          <>
            <h2 className="text-2xl font-semibold mb-6 text-dark">Escolha o dia</h2>
            <div className="calendar-container mb-4">
              <Calendar
                selected={selectedDate}
                onSelect={handleDateSelect}
                availableDays={Object.keys(settings.availableSchedule)}
                specificAvailableDates={settings.specificAvailableDates ? Object.keys(settings.specificAvailableDates) : []}
              />
            </div>
            {error && <p className="text-red-600 mb-4 font-medium">{error}</p>}
            <button
              onClick={onClose}
              className="mt-4 w-full py-3 bg-dark text-background rounded-lg hover:brightness-90 transition"
            >
              Cancelar
            </button>
          </>
        )}

        {step === 'time' && (
          <>
            <h2 className="text-2xl font-semibold mb-6 text-dark">Escolha a hora</h2>
            <input
              type="time"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-dark text-dark"
              value={selectedTime}
              onChange={handleTimeChange}
              step="900"
              aria-label="Selecione o horário"
            />
            {error && <p className="text-red-600 mb-4 font-medium">{error}</p>}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setStep('date')
                  setSelectedDate(null)
                  setError('')
                }}
                className="flex-1 py-3 bg-dark text-background rounded-lg hover:brightness-90 transition"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 bg-dark text-background rounded-lg hover:brightness-90 transition disabled:brightness-50 disabled:cursor-not-allowed"
                disabled={!selectedDate}
              >
                Confirmar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
