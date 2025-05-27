import { useEffect, useState } from "react";
import api from "../services/api";

const allDays = [
    "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"
];

const StoreSettingsDialog = ({ isOpen, onClose }) => {
    const [settings, setSettings] = useState({
        openingHour: "08:00",
        closingHour: "18:00",
        availableDays: [],
        specificAvailableDates: [],
        deliveryFee: 0.0,
    });

    const [loading, setLoading] = useState(true);
    const [newSpecificDate, setNewSpecificDate] = useState("");

    useEffect(() => {
        if (isOpen) {
            api
                .get("/settings")
                .then((res) => {
                    const data = res.data;
                    data.openingHour = data.openingHour?.slice(0, 5) || "08:00";
                    data.closingHour = data.closingHour?.slice(0, 5) || "18:00";
                    data.availableDays = data.availableDays || [];
                    data.specificAvailableDates = data.specificAvailableDates || [];
                    setSettings(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Erro ao carregar configurações:", err);
                    setLoading(false);
                });
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings((prev) => ({ ...prev, [name]: value }));
    };

    const handleDayToggle = (day) => {
        setSettings((prev) => {
            const isSelected = prev.availableDays.includes(day);
            const newDays = isSelected
                ? prev.availableDays.filter((d) => d !== day)
                : [...prev.availableDays, day];
            return { ...prev, availableDays: newDays };
        });
    };

    const handleFeeChange = (e) => {
        const value = parseFloat(e.target.value);
        setSettings((prev) => ({ ...prev, deliveryFee: isNaN(value) ? 0 : value }));
    };

    // Adiciona uma data específica se válida e ainda não adicionada
    const addSpecificDate = () => {
        if (newSpecificDate && !settings.specificAvailableDates.includes(newSpecificDate)) {
            setSettings((prev) => ({
                ...prev,
                specificAvailableDates: [...prev.specificAvailableDates, newSpecificDate].sort(),
            }));
            setNewSpecificDate("");
        }
    };

    // Remove uma data específica da lista
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
        } catch (error) {
            console.error("Erro ao salvar configurações:", error);
            alert("Erro ao salvar configurações.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Configurações da Loja</h2>

                {loading ? (
                    <p>Carregando...</p>
                ) : (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSave();
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block mb-1 font-medium">Horário de Abertura</label>
                            <input
                                type="time"
                                name="openingHour"
                                value={settings.openingHour}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Horário de Fechamento</label>
                            <input
                                type="time"
                                name="closingHour"
                                value={settings.closingHour}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Dias Disponíveis</label>
                            <div className="flex flex-wrap gap-2">
                                {allDays.map((day) => (
                                    <label key={day} className="flex items-center space-x-1">
                                        <input
                                            type="checkbox"
                                            checked={settings.availableDays.includes(day)}
                                            onChange={() => handleDayToggle(day)}
                                        />
                                        <span>{day}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Specific Available Dates */}
                        <div>
                            <label className="block mb-1 font-medium">Datas Específicas Disponíveis</label>
                            <div className="flex space-x-2 mb-2">
                                <input
                                    type="date"
                                    value={newSpecificDate}
                                    onChange={(e) => {
                                        const isoDate = e.target.value // exemplo: '2025-05-11'
                                        const [year, month, day] = isoDate.split('-')
                                        const formatted = `${day}/${month}/${year}` // '11/05/2025'
                                        setNewSpecificDate(formatted)
                                    }}
                                    className="border p-2 rounded flex-grow"
                                />

                                <button
                                    type="button"
                                    onClick={addSpecificDate}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Adicionar
                                </button>
                            </div>
                            <ul className="max-h-40 overflow-y-auto border rounded p-2">
                                {settings.specificAvailableDates.length === 0 && (
                                    <li className="text-gray-500">Nenhuma data adicionada</li>
                                )}
                                {settings.specificAvailableDates.map((date) => (
                                    <li key={date} className="flex justify-between items-center mb-1">
                                        <span>{date}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeSpecificDate(date)}
                                            className="text-red-500 hover:text-red-700 font-bold"
                                        >
                                            &times;
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Taxa de Entrega (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="deliveryFee"
                                value={settings.deliveryFee}
                                onChange={handleFeeChange}
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-400 text-white px-4 py-2 rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded"
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
