import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import DateTimeDialog from '../components/DateTimeDialog';
import { Link } from 'react-router-dom';
import api from "../services/api";

const steps = ['retirada', 'info', 'cartão', 'conferir'];

// Schema com regex para telefone no formato 99 99999-9999
const telefoneRegex = /^\d{2} \d{5}-\d{4}$/;

const lojaSchema = z.object({
    nome: z.string().min(1, 'Nome obrigatório'),
    telefone: z.string().min(1, 'Telefone obrigatório').regex(telefoneRegex, 'Telefone inválido. Formato: 99 99999-9999'),
    dataHora: z.object({
        date: z.string(),
        time: z.string(),
    }).nullable().refine(val => val !== null, 'Selecione data e hora'),
});

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
});

const CheckoutPage = () => {
    const [step, setStep] = useState('retirada');
    const [tipoRetirada, setTipoRetirada] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [dataHora, setDataHora] = useState(null);
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
    });
    const [cards, setCards] = useState([]);
    const [cardImages, setCardImages] = useState({}); // {cardId: imageUrl}
    const [cartao, setCartao] = useState({
        id: null,
        mensagem: '',
        incluirCartao: true, // Novo estado para controlar se o cliente quer incluir cartão
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchSettingsAndCards = async () => {
            try {
                // Buscar configurações
                const settingsResponse = await api.get("/settings");
                const settingsData = settingsResponse.data;
                setSettings(settingsData);

                // Buscar cartões
                const cardsResponse = await api.get("/cards");
                const cardsData = cardsResponse.data;

                // Buscar imagens antes de setar os cartões
                const cardsWithImages = await Promise.all(
                    cardsData.map(async (card) => {
                        try {
                            const imageResponse = await api.get(`/products/${card.id}/images`);
                            const image = imageResponse.data[0]?.image
                                ? `${api.defaults.baseURL}${imageResponse.data[0].image}`
                                : "/placeholder.jpg";
                            return { ...card, image };
                        } catch (err) {
                            console.error(`Erro ao carregar imagem para o cartão ${card.id}:`, err);
                            return { ...card, image: "/placeholder.jpg" };
                        }
                    })
                );

                // Agora sim, atualizar os cartões com as imagens já presentes
                setCards(cardsWithImages);
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
            }
        };

        fetchSettingsAndCards();
    }, []);



    // Função para formatar telefone como "99 99999-9999"
    const formatarTelefone = (valor) => {
        const numeros = valor.replace(/\D/g, '').slice(0, 11);
        if (numeros.length <= 2) return numeros;
        if (numeros.length <= 7) return numeros.slice(0, 2) + ' ' + numeros.slice(2);
        return numeros.slice(0, 2) + ' ' + numeros.slice(2, 7) + '-' + numeros.slice(7);
    };

    // Validação individual dos campos após cada input
    const validarCampo = (campo, valor) => {
        try {
            if (tipoRetirada === 'loja') {
                if (campo === 'dataHora') {
                    lojaSchema.pick({ dataHora: true }).parse({ dataHora: valor });
                } else {
                    lojaSchema.pick({ [campo]: true }).parse({ [campo]: valor });
                }
            } else if (tipoRetirada === 'entrega') {
                if (campo === 'dataHora') {
                    entregaSchema.pick({ dataHora: true }).parse({ dataHora: valor });
                } else {
                    entregaSchema.pick({ [campo]: true }).parse({ [campo]: valor });
                }
            }
            setErrors(prev => ({ ...prev, [campo]: null }));
        } catch (e) {
            if (e instanceof z.ZodError) {
                setErrors(prev => ({ ...prev, [campo]: e.errors[0].message }));
            }
        }
    };

    // Atualiza o input e valida o campo na hora
    const handleChange = (campo, valor) => {
        setInputs(prev => ({ ...prev, [campo]: valor }));
        if (campo !== 'pontoReferencia') validarCampo(campo, valor);
    };

    // Validar dataHora separadamente
    useEffect(() => {
        if (dataHora !== null) validarCampo('dataHora', dataHora);
    }, [dataHora]);

    const nextStep = () => {
        if (step === 'info') {
            try {
                if (tipoRetirada === 'loja') {
                    lojaSchema.parse({ ...inputs, dataHora });
                } else if (tipoRetirada === 'entrega') {
                    entregaSchema.parse({ ...inputs, dataHora });
                }
                setErrors({});
                const currentIndex = steps.indexOf(step);
                if (currentIndex < steps.length - 1) setStep(steps[currentIndex + 1]);
            } catch (e) {
                if (e instanceof z.ZodError) {
                    const formErrors = {};
                    for (const err of e.errors) {
                        formErrors[err.path[0]] = err.message;
                    }
                    setErrors(formErrors);
                }
            }
        } else if (step === 'cartão') {
            // Se o cliente optou por não incluir cartão, pode avançar
            if (!cartao.incluirCartao) {
                setErrors({});
                const currentIndex = steps.indexOf(step);
                if (currentIndex < steps.length - 1) setStep(steps[currentIndex + 1]);
                return;
            }

            // Validate card selection
            if (!cartao.id) {
                setErrors(prev => ({ ...prev, cartao: 'Selecione um tipo de cartão' }));
                return;
            }

            // Validate message
            if (cartao.mensagem.length === 0) {
                setErrors(prev => ({ ...prev, mensagem: 'Escreva uma mensagem para o cartão' }));
                return;
            }

            // Get selected card to check limits
            const selectedCard = cards.find(c => c.id === cartao.id);
            if (!selectedCard) {
                setErrors(prev => ({ ...prev, cartao: 'Cartão selecionado inválido' }));
                return;
            }

            // Determine max chars based on card type
            const maxChars = selectedCard.name.includes('cortesia') ? 100 : 300;

            if (cartao.mensagem.length > maxChars) {
                setErrors(prev => ({ ...prev, mensagem: `Mensagem muito longa. Limite: ${maxChars} caracteres` }));
                return;
            }

            setErrors({});
            const currentIndex = steps.indexOf(step);
            if (currentIndex < steps.length - 1) setStep(steps[currentIndex + 1]);
        } else {
            const currentIndex = steps.indexOf(step);
            if (currentIndex < steps.length - 1) setStep(steps[currentIndex + 1]);
        }
    };

    const prevStep = () => {
        const currentIndex = steps.indexOf(step);
        if (currentIndex > 0) setStep(steps[currentIndex - 1]);
    };

    const resetForm = () => {
        setStep('retirada');
        setTipoRetirada(null);
        setInputs({
            nome: '',
            telefone: '',
            numeroCasa: '',
            rua: '',
            setor: '',
            pontoReferencia: '',
        });
        setCartao({
            id: null,
            mensagem: '',
            incluirCartao: true,
        });
        setErrors({});
        setDataHora(null);
    };

    // Função para obter o texto do botão do cartão
    const getCardButtonText = (card) => {
        if (card.name.includes('cortesia')) {
            return `Cartão Cortesia (Grátis) - Até 80 caracteres`;
        } else if (card.name.includes('customizado')) {
            return `Cartão Customizado (R$ ${card.price}) - Até 120 caracteres`;
        }
        return card.name;
    };

    // Função para obter o cartão selecionado
    const getSelectedCard = () => {
        return cards.find(c => c.id === cartao.id);
    };

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
                                        setTipoRetirada('loja');
                                        nextStep();
                                    }}
                                    className="py-3 rounded-lg border-2 border-dark bg-white text-dark font-semibold hover:bg-dark hover:text-white transition"
                                >
                                    Retirar na Loja
                                </button>
                                <button
                                    onClick={() => {
                                        setTipoRetirada('entrega');
                                        nextStep();
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
                                    placeholder={tipoRetirada === 'loja' ? 'Nome de quem vai Retirar?' : 'Nome de quem vai Receber'}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.nome ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-dark`}
                                    value={inputs.nome}
                                    onChange={(e) => handleChange('nome', e.target.value)}
                                />
                                {errors.nome && <p className="text-red-600 text-sm">{errors.nome}</p>}

                                <input
                                    type="tel"
                                    placeholder={tipoRetirada === 'loja' ? 'Telefone de quem vai retirar?' : 'Telefone de quem vai Receber?'}
                                    maxLength={14}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.telefone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-dark`}
                                    value={inputs.telefone}
                                    onChange={(e) => {
                                        const valorFormatado = formatarTelefone(e.target.value);
                                        handleChange('telefone', valorFormatado);
                                    }}
                                />
                                {errors.telefone && <p className="text-red-600 text-sm">{errors.telefone}</p>}

                                {tipoRetirada === 'entrega' && (
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Rua"
                                            className={`w-full px-4 py-3 rounded-lg border ${errors.rua ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-dark`}
                                            value={inputs.rua}
                                            onChange={(e) => handleChange('rua', e.target.value)}
                                        />
                                        {errors.rua && <p className="text-red-600 text-sm">{errors.rua}</p>}

                                        <input
                                            type="text"
                                            placeholder="Número da casa"
                                            className={`w-full px-4 py-3 rounded-lg border ${errors.numeroCasa ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-dark`}
                                            value={inputs.numeroCasa}
                                            onChange={(e) => handleChange('numeroCasa', e.target.value)}
                                        />
                                        {errors.numeroCasa && <p className="text-red-600 text-sm">{errors.numeroCasa}</p>}

                                        <input
                                            type="text"
                                            placeholder="Setor"
                                            className={`w-full px-4 py-3 rounded-lg border ${errors.setor ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-dark`}
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
                                    className={`w-full py-3 rounded-lg border ${errors.dataHora ? 'border-red-500' : 'border-gray-300'} bg-white text-dark font-semibold hover:bg-dark hover:text-white transition`}
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

                    {step === 'cartão' && (
                        <motion.div
                            key="cartão"
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 40 }}
                            className="space-y-6 bg-white p-6 rounded-lg shadow-md"
                        >
                            <h2 className="text-2xl font-semibold mb-4 text-dark">Cartão de Mensagem</h2>

                            <div className="space-y-4">
                                <div className="flex items-center mb-4">
                                    <input
                                        type="checkbox"
                                        id="incluirCartao"
                                        checked={cartao.incluirCartao}
                                        onChange={(e) => setCartao(prev => ({ ...prev, incluirCartao: e.target.checked }))}
                                        className="mr-2 h-5 w-5"
                                    />
                                    <label htmlFor="incluirCartao" className="text-dark">
                                        Incluir cartão de mensagem com o pedido
                                    </label>
                                </div>

                                {cartao.incluirCartao && (
                                    <>
                                        <div className="flex flex-col gap-4">
                                            {cards.map(card => (
                                                <button
                                                    key={card.id}
                                                    onClick={() => setCartao(prev => ({ ...prev, id: card.id }))}
                                                    className={`rounded-lg border-2 w-full ${cartao.id === card.id
                                                            ? 'border-dark bg-dark text-white'
                                                            : 'border-dark bg-white text-dark'
                                                        } font-semibold transition flex flex-col md:flex-row items-start md:items-center gap-4 p-4`}
                                                >
                                                    <div className="w-full md:w-20 aspect-square overflow-hidden rounded">
                                                        <img
                                                            src={card.image}
                                                            alt={card.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col min-w-0 mt-2 md:mt-0">
                                                        <div className="text-base md:text-lg font-semibold">
                                                            {getCardButtonText(card)}
                                                        </div>
                                                        {card.description && (
                                                            <div className="text-sm font-normal text-gray-600 dark:text-gray-300">
                                                                {card.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>

                                        {errors.cartao && <p className="text-red-600 text-sm">{errors.cartao}</p>}

                                        {cartao.id && (
                                            <div className="mt-4">
                                                <label className="block mb-2 text-dark">Escreva sua mensagem:</label>
                                                <textarea
                                                    placeholder="Digite sua mensagem aqui..."
                                                    className={`w-full px-4 py-3 rounded-lg border ${errors.mensagem ? 'border-red-500' : 'border-gray-300'
                                                        } focus:outline-none focus:ring-2 focus:ring-dark`}
                                                    rows={4}
                                                    value={cartao.mensagem}
                                                    onChange={(e) => {
                                                        const selectedCard = getSelectedCard();
                                                        const maxChars = selectedCard?.name.includes('cortesia') ? 80 : 120;
                                                        if (e.target.value.length <= maxChars) {
                                                            setCartao(prev => ({ ...prev, mensagem: e.target.value }));
                                                        }
                                                    }}
                                                />
                                                <div
                                                    className={`text-sm mt-1 ${cartao.mensagem.length >= (getSelectedCard()?.name.includes('cortesia') ? 100 : 300)
                                                            ? 'text-red-600'
                                                            : 'text-gray-500'
                                                        }`}
                                                >
                                                    {cartao.mensagem.length}/{getSelectedCard()?.name.includes('cortesia') ? 80 : 120} caracteres
                                                </div>
                                                {errors.mensagem && <p className="text-red-600 text-sm">{errors.mensagem}</p>}
                                            </div>
                                        )}
                                    </>
                                )}


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
                                <p><strong>Cartão incluído:</strong> {cartao.incluirCartao ? 'Sim' : 'Não'}</p>
                                {cartao.incluirCartao && cartao.id && (
                                    <>
                                        <p><strong>Tipo de cartão:</strong> {getSelectedCard()?.name} {getSelectedCard()?.price > 0 ? `(R$ ${getSelectedCard()?.price})` : '(Grátis)'}</p>
                                        {cartao.mensagem && (
                                            <>
                                                <p><strong>Mensagem:</strong></p>
                                                <div className="bg-gray-100 p-3 rounded whitespace-pre-line">
                                                    {cartao.mensagem}
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
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
                                            dataHora,
                                            settings,
                                            cartao: cartao.incluirCartao ? {
                                                ...cartao,
                                                cardInfo: getSelectedCard()
                                            } : null
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
    );
}

export default CheckoutPage