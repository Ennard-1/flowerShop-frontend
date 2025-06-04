import React, { useEffect, useState } from "react";
import { getCart, clearCart } from "../services/cart";
import { useLocation, useNavigate } from "react-router-dom";

const OrderSummaryPage = () => {

  const [whatsMessage, setWhatsMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;

  useEffect(() => {
    const items = getCart();
    const deliveryInfo = location.state?.deliveryInfo;
    console.log("item:", deliveryInfo);

    const { encoded } = generateWhatsappMessage(items, deliveryInfo);
    setWhatsMessage(encoded);

    // Aguarda 3 segundos e redireciona para o WhatsApp
    const timeout = setTimeout(() => {
      window.location.href = `https://wa.me/${whatsappNumber}?text=${encoded}`;
      // clearCart(); // Descomente se quiser esvaziar o carrinho após redirecionar
    }, 3000);

    return () => clearTimeout(timeout);
  }, [location.state, whatsappNumber]);

  const generateWhatsappMessage = (items, deliveryData) => {
    if (!items || items.length === 0)
      return { raw: "Carrinho vazio.", encoded: encodeURIComponent("Carrinho vazio.") };

    let message = "*📦 NOVO PEDIDO* 🎉\n\n";

    // Seção de informações de entrega/retirada
    if (deliveryData) {
      if (deliveryData.tipoRetirada === 'entrega') {
        message += "*ENTREGA* 🚚\n";
        message += `• Nome: *${deliveryData.nome}*\n`;
        message += `• Telefone: *${deliveryData.telefone}*\n`;
        message += `• Endereço: Rua *${deliveryData.rua}*, Nº *${deliveryData.numeroCasa}*, Setor *${deliveryData.setor}*\n`;
        if (deliveryData.pontoReferencia) {
          message += `• Ponto de referência: *${deliveryData.pontoReferencia}*\n`;
        }
        message += `• Taxa de entrega: *R$ ${Number(deliveryData.settings.deliveryFee).toFixed(2)}*\n`;
      } else {
        message += "*RETIRADA NA LOJA* 🏪\n";
        message += `• Nome: *${deliveryData.nome}*\n`;
        message += `• Telefone: *${deliveryData.telefone}*\n`;
      }
      message += `• Data/Hora: *${deliveryData.dataHora.date} às ${deliveryData.dataHora.time}*\n\n`;
    }

    // Seção de itens do pedido
    message += "*ITENS DO PEDIDO*\n";
    items.forEach((item, index) => {
      message += `*${index + 1}.* ${item.name} - R$ ${Number(item.price).toFixed(2)}\n`;
      message += `  Quantidade: *${item.quantity}*\n`;

      // Adiciona informações específicas se for um cartão
      if (item.tagCartao && item.text) {
        message += `  Mensagem: *"${item.text}"*\n`;
      }

      message += `\n`;
    });

    // Seção do cartão adicional (se houver)
    if (deliveryData?.cartao?.incluirCartao && deliveryData.cartao.id) {
      const card = deliveryData.cartao.cardInfo;
      message += `*CARTÃO ADICIONAL*\n`;
      message += `• Tipo: *${card.name}* ${Number(card.price) > 0 ? `(R$ ${Number(card.price).toFixed(2)})` : '(Grátis)'}\n`;

      message += `• Mensagem: *"${deliveryData.cartao.mensagem}"*\n\n`;
    } else if (deliveryData?.cartao !== null) {
      message += `*SEM CARTÃO ADICIONAL*\n\n`;
    }

    // Cálculo do total
    const subtotal = items.reduce(
      (acc, item) => acc + Number(item.price) * Number(item.quantity),
      0
    );

    const cardFee = deliveryData?.cartao?.incluirCartao ? (Number(deliveryData.cartao.cardInfo?.price) || 0) : 0;
    const deliveryFee = deliveryData?.tipoRetirada === 'entrega' ? Number(deliveryData.settings.deliveryFee) : 0;

    const total = subtotal + deliveryFee + cardFee;

    message += `*RESUMO DE VALORES*\n`;
    message += `• Subtotal: R$ ${subtotal.toFixed(2)}\n`;
    if (deliveryFee > 0) {
      message += `• Taxa de entrega: R$ ${deliveryFee.toFixed(2)}\n`;
    }
    if (cardFee > 0) {
      message += `• Cartão adicional: R$ ${cardFee.toFixed(2)}\n`;
    }
    message += `*TOTAL A PAGAR: R$ ${total.toFixed(2)}*\n\n`;

    message += "*Obrigado pelo seu pedido!* ❤️";

    return {
      raw: message,
      encoded: encodeURIComponent(message),
    };
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <div className="max-w-md text-center bg-white rounded-lg p-6 shadow-md">
        <h1 className="text-2xl font-bold text-dark mb-4">Obrigado pelo seu pedido! 🎉</h1>
        <p className="text-muted mb-4">Estamos preparando tudo para você.</p>
        <p className="text-muted">{decodeURIComponent(whatsMessage)}</p>

        {/* Opcional: Mostrar preview da mensagem */}
        <div className="mt-6 p-4 bg-gray-100 rounded text-left">
          <h2 className="font-semibold mb-2">Resumo do pedido:</h2>
          <pre className="whitespace-pre-wrap text-sm">{decodeURIComponent(whatsMessage)}</pre>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryPage;