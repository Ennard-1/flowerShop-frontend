import React, { useState } from 'react'
import Calendar from './Calendar'

export default function DateTimeDialog({ open, onClose, onSelect, settings }) {
  const [step, setStep] = useState('date')
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState('12:00')
  const [error, setError] = useState('')

  if (!open) return null

  const isSpecificAvailableDate = (dateStr) => {
    return settings.specificAvailableDates.includes(dateStr)
  }

  const isDayAvailable = (date) => {
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    const dayName = dayNames[date.getDay()]
    return settings.availableDays.includes(dayName)
  }

  const handleDateSelect = (dateStr) => {
    const [day, month, year] = dateStr.split('/').map(Number)
    const date = new Date(year, month - 1, day)

    if (!isSpecificAvailableDate(dateStr) && !isDayAvailable(date)) {
      setError('Data indisponível para entrega. Por favor, escolha outro dia.')
      return
    }

    setSelectedDate(dateStr)
    setError('')
    setStep('time')
  }

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value)
  }

  const isValidTime = () => {
    const [selectedHour, selectedMinute] = selectedTime.split(':').map(Number)
    const [openHour, openMinute] = settings.openingHour.split(':').map(Number)
    const [closeHour, closeMinute] = settings.closingHour.split(':').map(Number)

    const selected = selectedHour * 60 + selectedMinute
    const opening = openHour * 60 + openMinute
    const closing = closeHour * 60 + closeMinute

    return selected >= opening && selected <= closing
  }

  const handleConfirm = () => {
    if (!isValidTime()) {
      setError(`O horário de entrega é entre ${settings.openingHour} e ${settings.closingHour}.`)
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
                availableDays={settings.availableDays}
                specificAvailableDates={settings.specificAvailableDates}
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
