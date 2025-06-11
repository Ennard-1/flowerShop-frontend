import { useEffect, useState } from "react";
import api from "../services/api";

const allDays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

const StoreSettingsDialog = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    availableDays: {},
    specificAvailableDates: [],
    deliveryFee: 0.0,
  });

  const [loading, setLoading] = useState(false);
  const [newSpecificDate, setNewSpecificDate] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    api.get("/settings")
      .then((res) => {
        const data = res.data;
        setSettings({
          availableDays: data.availableSchedule || {},
          specificAvailableDates: data.specificAvailableDates || [],
          deliveryFee: data.deliveryFee || 0.0,
        });
      })
      .catch((err) => {
        console.error("Erro ao carregar configurações:", err);
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  const toggleDay = (day) => {
    setSettings((prev) => {
      const isActive = !!prev.availableDays[day];
      const updated = { ...prev.availableDays };
      if (isActive) {
        delete updated[day];
      } else {
        updated[day] = [{ start: "", end: "" }];
      }
      return { ...prev, availableDays: updated };
    });
  };

  const handleIntervalChange = (day, index, field, value) => {
    setSettings((prev) => {
      const updatedIntervals = [...(prev.availableDays[day] || [])];
      updatedIntervals[index] = {
        ...updatedIntervals[index],
        [field]: value,
      };
      return {
        ...prev,
        availableDays: {
          ...prev.availableDays,
          [day]: updatedIntervals,
        },
      };
    });
  };

  const addInterval = (day) => {
    setSettings((prev) => ({
      ...prev,
      availableDays: {
        ...prev.availableDays,
        [day]: [...(prev.availableDays[day] || []), { start: "", end: "" }],
      },
    }));
  };

  const removeInterval = (day, index) => {
    setSettings((prev) => {
      const filtered = prev.availableDays[day].filter((_, i) => i !== index);
      return {
        ...prev,
        availableDays: { ...prev.availableDays, [day]: filtered },
      };
    });
  };

  const handleFeeChange = (e) => {
    const value = parseFloat(e.target.value);
    setSettings((prev) => ({
      ...prev,
      deliveryFee: isNaN(value) ? 0 : value,
    }));
  };

  const addSpecificDate = () => {
    if (!newSpecificDate) return;
    const [year, month, day] = newSpecificDate.split("-");
    const formatted = `${day}/${month}/${year}`;
    if (!settings.specificAvailableDates.includes(formatted)) {
      setSettings((prev) => ({
        ...prev,
        specificAvailableDates: [...prev.specificAvailableDates, formatted].sort(),
      }));
      setNewSpecificDate("");
    }
  };

  const removeSpecificDate = (date) => {
    setSettings((prev) => ({
      ...prev,
      specificAvailableDates: prev.specificAvailableDates.filter((d) => d !== date),
    }));
  };

  const handleSave = async () => {
    try {
      await api.put("/settings", settings);
      alert("Configurações salvas com sucesso.");
      onClose();
    } catch (err) {
      console.error("Erro ao salvar configurações:", err);
      alert("Erro ao salvar configurações.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Configurações da Loja</h2>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
            {/* Dias e horários */}
            <div>
              <h3 className="font-semibold mb-2">Dias Disponíveis e Horários</h3>
              {allDays.map((day) => {
                const enabled = !!settings.availableDays[day];
                const intervals = settings.availableDays[day] || [];

                return (
                  <div key={day} className="border p-3 mb-3 rounded">
                    <label className="flex items-center gap-2 font-medium">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={() => toggleDay(day)}
                      />
                      {day}
                    </label>

                    {enabled && (
                      <div className="mt-2 space-y-2">
                        {intervals.map((interval, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="time"
                              value={interval.start}
                              onChange={(e) =>
                                handleIntervalChange(day, index, "start", e.target.value)
                              }
                              className="border p-1 rounded"
                            />
                            <span>até</span>
                            <input
                              type="time"
                              value={interval.end}
                              onChange={(e) =>
                                handleIntervalChange(day, index, "end", e.target.value)
                              }
                              className="border p-1 rounded"
                            />
                            <button
                              type="button"
                              onClick={() => removeInterval(day, index)}
                              className="text-red-500 font-bold"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addInterval(day)}
                          className="text-blue-600 text-sm"
                        >
                          + Adicionar horário
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Datas específicas */}
            <div>
              <h3 className="font-semibold mb-2">Datas Específicas Disponíveis</h3>
              <div className="flex gap-2 mb-2">
                <input
                  type="date"
                  value={newSpecificDate}
                  onChange={(e) => setNewSpecificDate(e.target.value)}
                  className="border p-2 rounded w-full"
                />
                <button
                  type="button"
                  onClick={addSpecificDate}
                  className="bg-blue-600 text-white px-3 py-2 rounded"
                >
                  Adicionar
                </button>
              </div>
              <ul className="max-h-40 overflow-y-auto border rounded p-2">
                {settings.specificAvailableDates.length === 0 ? (
                  <li className="text-gray-500">Nenhuma data adicionada</li>
                ) : (
                  settings.specificAvailableDates.map((date) => (
                    <li key={date} className="flex justify-between items-center mb-1">
                      <span>{date}</span>
                      <button
                        type="button"
                        onClick={() => removeSpecificDate(date)}
                        className="text-red-600 font-bold"
                      >
                        &times;
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Taxa de entrega */}
            <div>
              <label className="block font-medium mb-1">Taxa de Entrega (R$)</label>
              <input
                type="number"
                step="0.01"
                value={settings.deliveryFee}
                onChange={handleFeeChange}
                className="border p-2 rounded w-full"
              />
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Salvar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default StoreSettingsDialog;
