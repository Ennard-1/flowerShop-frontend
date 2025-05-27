import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { z } from 'zod'
import DateTimeDialog from '../components/DateTimeDialog'
import { Link } from 'react-router-dom'
import api from "../services/api";
const steps = ['retirada', 'info', 'conferir']

// Schema com regex para telefone no formato 99 99999-9999
const telefoneRegex = /^\d{2} \d{5}-\d{4}$/

const lojaSchema = z.object({
    nome: z.string().min(1, 'Nome obrigatório'),
    telefone: z.string().min(1, 'Telefone obrigatório').regex(telefoneRegex, 'Telefone inválido. Formato: 99 99999-9999'),
    dataHora: z.object({
        date: z.string(),
        time: z.string(),
    }).nullable().refine(val => val !== null, 'Selecione data e hora'),
})

const entregaSchema = z.object({
    nome: z.string().min(1, 'Nome obrigatório'),
    telefone: z.string().min(1, 'Telefone obrigatório').regex(telefoneRegex, 'Telefone inválido. Formato: 99 99999-9999'),
    rua: z.string().min(1, 'Rua obrigatória'),
    numeroCasa: z.string().min(1, 'Número da casa obrigatório'),
    setor: z.string().min(1, 'Setor obrigatório'),
    pontoReferencia: z.string().optional(),
    dataHora: z.object({
        date: z.string(),
        time: z.string(),
    }).nullable().refine(val => val !== null, 'Selecione data e hora'),
})

export default function CheckoutPage() {
    const [step, setStep] = useState('retirada')
    const [tipoRetirada, setTipoRetirada] = useState(null)
    const [showDialog, setShowDialog] = useState(false)
    const [dataHora, setDataHora] = useState(null)
    const [settings, setSettings] = useState({
        openingHour: "",
        closingHour: "",
        availableDays: [],
        specificAvailableDates: [],
        deliveryFee: 0,
    });
    const [inputs, setInputs] = useState({
        nome: '',
        telefone: '',
        rua: '',
        numeroCasa: '',
        setor: '',
        pontoReferencia: '',
    })

    const [errors, setErrors] = useState({})

    // Função para formatar telefone como "99 99999-9999"
    const formatarTelefone = (valor) => {
        const numeros = valor.replace(/\D/g, '').slice(0, 11) // max 11 números
        if (numeros.length <= 2) return numeros
        if (numeros.length <= 7) return numeros.slice(0, 2) + ' ' + numeros.slice(2)
        return numeros.slice(0, 2) + ' ' + numeros.slice(2, 7) + '-' + numeros.slice(7)
    }

    // Validação individual dos campos após cada input
    const validarCampo = (campo, valor) => {
        try {
            if (tipoRetirada === 'loja') {
                // Para loja: só nome, telefone e dataHora
                if (campo === 'dataHora') {
                    lojaSchema.pick({ dataHora: true }).parse({ dataHora: valor })
                } else {
                    lojaSchema.pick({ [campo]: true }).parse({ [campo]: valor })
                }
            } else if (tipoRetirada === 'entrega') {
                if (campo === 'dataHora') {
                    entregaSchema.pick({ dataHora: true }).parse({ dataHora: valor })
                } else {
                    entregaSchema.pick({ [campo]: true }).parse({ [campo]: valor })
                }
            }
            setErrors(prev => ({ ...prev, [campo]: null }))
        } catch (e) {
            if (e instanceof z.ZodError) {
                setErrors(prev => ({ ...prev, [campo]: e.errors[0].message }))
            }
        }
    }

    // Atualiza o input e valida o campo na hora
    const handleChange = (campo, valor) => {
        setInputs(prev => ({ ...prev, [campo]: valor }))

        // Validar só se não for pontoReferencia que é opcional
        if (campo !== 'pontoReferencia') validarCampo(campo, valor)
    }

    // Validar dataHora separadamente
    useEffect(() => {
        api.get("/settings").then((res) => {
            const data = res.data;
            data.openingHour = data.openingHour?.slice(0, 5) || "08:00";
            data.closingHour = data.closingHour?.slice(0, 5) || "18:00";
            data.availableDays = data.availableDays || [];
            data.specificAvailableDates = data.specificAvailableDates || [];
            setSettings(data);
             console.log(data)

        })
            .catch((err) => {
                console.error("Erro ao carregar configurações:", err);

            });

        if (dataHora !== null) validarCampo('dataHora', dataHora)
    }, [dataHora])

    const nextStep = () => {
        if (step === 'info') {
            try {
                if (tipoRetirada === 'loja') {
                    lojaSchema.parse({ ...inputs, dataHora })
                } else if (tipoRetirada === 'entrega') {
                    entregaSchema.parse({ ...inputs, dataHora })
                }
                setErrors({})
                const currentIndex = steps.indexOf(step)
                if (currentIndex < steps.length - 1) setStep(steps[currentIndex + 1])
            } catch (e) {
                if (e instanceof z.ZodError) {
                    const formErrors = {}
                    for (const err of e.errors) {
                        formErrors[err.path[0]] = err.message
                    }
                    setErrors(formErrors)
                }
            }
        } else {
            const currentIndex = steps.indexOf(step)
            if (currentIndex < steps.length - 1) setStep(steps[currentIndex + 1])
        }
    }

    const prevStep = () => {
        const currentIndex = steps.indexOf(step)
        if (currentIndex > 0) setStep(steps[currentIndex - 1])
    }

    const resetForm = () => {
        setStep('retirada')
        setTipoRetirada(null)
        setInputs({
            nome: '',
            telefone: '',
            numeroCasa: '',
            rua: '',
            setor: '',
            pontoReferencia: '',
        })
        setErrors({})
        setDataHora(null)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-background min-h-screen px-4 py-10"
        >
            <div className="container mx-auto max-w-4xl">
                <h1 className="mb-8 text-center text-3xl font-bold text-dark">Checkout</h1>

                <AnimatePresence mode="wait">
                    {step === 'retirada' && (
                        <motion.div
                            key="retirada"
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 40 }}
                            className="space-y-6 bg-white p-6 rounded-lg shadow-md"
                        >
                            <h2 className="text-2xl font-semibold mb-4 text-dark">Como deseja retirar?</h2>
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => {
                                        setTipoRetirada('loja')
                                        nextStep()
                                    }}
                                    className="py-3 rounded-lg border-2 border-dark bg-white text-dark font-semibold hover:bg-dark hover:text-white transition"
                                >
                                    Retirar na Loja
                                </button>
                                <button
                                    onClick={() => {
                                        setTipoRetirada('entrega')
                                        nextStep()
                                    }}
                                    className="py-3 rounded-lg border-2 border-dark bg-white text-dark font-semibold hover:bg-dark hover:text-white transition"
                                >
                                    Entrega (+ R${settings.deliveryFee})
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 'info' && (
                        <motion.div
                            key="info"
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 40 }}
                            className="space-y-6 bg-white p-6 rounded-lg shadow-md"
                        >
                            <h2 className="text-2xl font-semibold mb-4 text-dark">Informações do pedido</h2>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Nome"
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.nome ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-dark`}
                                    value={inputs.nome}
                                    onChange={(e) => handleChange('nome', e.target.value)}
                                />
                                {errors.nome && <p className="text-red-600 text-sm">{errors.nome}</p>}

                                <input
                                    type="tel"
                                    placeholder="Telefone (ex: 99 99999-9999)"
                                    maxLength={14}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.telefone ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-dark`}
                                    value={inputs.telefone}
                                    onChange={(e) => {
                                        const valorFormatado = formatarTelefone(e.target.value)
                                        handleChange('telefone', valorFormatado)
                                    }}
                                />
                                {errors.telefone && <p className="text-red-600 text-sm">{errors.telefone}</p>}

                                {tipoRetirada === 'entrega' && (
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Rua"
                                            className={`w-full px-4 py-3 rounded-lg border ${errors.rua ? 'border-red-500' : 'border-gray-300'
                                                } focus:outline-none focus:ring-2 focus:ring-dark`}
                                            value={inputs.rua}
                                            onChange={(e) => handleChange('rua', e.target.value)}
                                        />
                                        {errors.rua && <p className="text-red-600 text-sm">{errors.rua}</p>}

                                        <input
                                            type="text"
                                            placeholder="Número da casa"
                                            className={`w-full px-4 py-3 rounded-lg border ${errors.numeroCasa ? 'border-red-500' : 'border-gray-300'
                                                } focus:outline-none focus:ring-2 focus:ring-dark`}
                                            value={inputs.numeroCasa}
                                            onChange={(e) => handleChange('numeroCasa', e.target.value)}
                                        />
                                        {errors.numeroCasa && <p className="text-red-600 text-sm">{errors.numeroCasa}</p>}

                                        <input
                                            type="text"
                                            placeholder="Setor"
                                            className={`w-full px-4 py-3 rounded-lg border ${errors.setor ? 'border-red-500' : 'border-gray-300'
                                                } focus:outline-none focus:ring-2 focus:ring-dark`}
                                            value={inputs.setor}
                                            onChange={(e) => handleChange('setor', e.target.value)}
                                        />
                                        {errors.setor && <p className="text-red-600 text-sm">{errors.setor}</p>}

                                        <input
                                            type="text"
                                            placeholder="Ponto de referência (opcional)"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-dark"
                                            value={inputs.pontoReferencia}
                                            onChange={(e) => handleChange('pontoReferencia', e.target.value)}
                                        />
                                    </>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setShowDialog(true)}
                                    className={`w-full py-3 rounded-lg border ${errors.dataHora ? 'border-red-500' : 'border-gray-300'
                                        } bg-white text-dark font-semibold hover:bg-dark hover:text-white transition`}
                                >
                                    {dataHora
                                        ? `Agendado para: ${dataHora.date} às ${dataHora.time}`
                                        : 'Selecionar data e hora'}
                                </button>
                                {errors.dataHora && <p className="text-red-600 text-sm">{errors.dataHora}</p>}
                            </div>

                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={prevStep}
                                    className="py-3 px-6 rounded-lg bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400 transition"
                                >
                                    Voltar
                                </button>
                                <button
                                    onClick={nextStep}
                                    className="py-3 px-6 rounded-lg bg-dark text-white font-semibold hover:bg-black transition"
                                >
                                    Próximo
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 'conferir' && (
                        <motion.div
                            key="conferir"
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 40 }}
                            className="space-y-6 bg-white p-6 rounded-lg shadow-md"
                        >
                            <h2 className="text-2xl font-semibold mb-4 text-dark">Confirme seus dados</h2>
                            <div className="space-y-2">
                                <p><strong>Nome:</strong> {inputs.nome}</p>
                                <p><strong>Telefone:</strong> {inputs.telefone}</p>
                                {tipoRetirada === 'entrega' && (
                                    <>
                                        <p><strong>Rua:</strong> {inputs.rua}</p>
                                        <p><strong>Número:</strong> {inputs.numeroCasa}</p>
                                        <p><strong>Setor:</strong> {inputs.setor}</p>
                                        {inputs.pontoReferencia && <p><strong>Ponto de referência:</strong> {inputs.pontoReferencia}</p>}
                                    </>
                                )}
                                <p><strong>Data e Hora:</strong> {dataHora ? `${dataHora.date} às ${dataHora.time}` : '-'}</p>
                            </div>

                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={prevStep}
                                    className="py-3 px-6 rounded-lg bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400 transition"
                                >
                                    Voltar
                                </button>
                                <Link
                                    to="/pedido"
                                    state={{
                                        deliveryInfo: {
                                            tipoRetirada,
                                            ...inputs,
                                            dataHora,settings
                                        }
                                    }}
                                    className="py-3 px-6 rounded-lg bg-dark text-white font-semibold hover:bg-black transition"
                                >
                                    Confirmar
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {showDialog && (
                    <DateTimeDialog
                        open={showDialog}
                        onClose={() => setShowDialog(false)}
                        onSelect={(data) => setDataHora(data)}
                        settings={settings}
                    />
                )}

                <div className="mt-8 text-center text-sm text-gray-500">
                    <Link to="/">Voltar à página inicial</Link>
                </div>
            </div>
        </motion.div>
    )
}
