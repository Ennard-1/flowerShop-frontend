import React, { useEffect, useState } from "react";
import { getCart, clearCart } from "../services/cart"; // Adicione clearCart se quiser esvaziar o carrinho
import { useLocation, useNavigate } from "react-router-dom";

const OrderSummaryPage = () => {
  const [whatsMessage, setWhatsMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;

  useEffect(() => {
    const items = getCart();
    const deliveryInfo = location.state?.deliveryInfo;

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

    if (deliveryData) {
      if (deliveryData.tipoRetirada === 'entrega') {
        message += "*ENTREGA* 🚚\n";
        message += ` Nome do destinatário: *${deliveryData.nome}*\n`;
        message += `Telefone: *${deliveryData.telefone}*\n\n`;
        message += `Endereço: Rua ${deliveryData.rua}, Numero ${deliveryData.numeroCasa} - Setor ${deliveryData.setor}*\n`;
        if (deliveryData.pontoReferencia) {
          message += `Ponto de referência: *${deliveryData.pontoReferencia}*\n`;
        }
        message += `Taxa de entrega: *R$ ${deliveryData.settings.deliveryFee}*\n\n`;
      } else {
        message += "*RETIRADA NA LOJA* 🏪\n\n";
        message += `Nome: *${deliveryData.nome}*\n`;
        message += `Telefone: *${deliveryData.telefone}*\n\n`;
      }
      message += `Data/Hora: *${deliveryData.dataHora.date} às ${deliveryData.dataHora.time}*\n\n`;
    }

    message += "*ITENS DO PEDIDO*\n";
    items.forEach((item, index) => {
      const isCartao = item.tagCartao;
      const quantity = isCartao ? 1 : item.quantity;

      message += `*${index + 1}.* ${item.name} - R$ ${item.price}\n`;

      if (!isCartao) {
        message += `  Quantidade: *${quantity}* \n`;
      }

      if (isCartao && item.text) {
        message += `  Mensagem: *"${item.text}"*\n`;
      }

      message += `\n`;
    });

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = deliveryData?.tipoRetirada === 'entrega' ? subtotal + deliveryData.settings.deliveryFee : subtotal;

    message += `*Subtotal:* R$ ${subtotal}\n`;
    if (deliveryData?.tipoRetirada === 'entrega') {
      message += `*Taxa de entrega:* R$ ${deliveryData.settings.deliveryFee}\n`;
    }
    message += `*Total a pagar:* R$ ${total}\n\n`;

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
        <p className="text-muted">Você será redirecionado para o WhatsApp em instantes...</p>
      </div>
    </div>
  );
};

export default OrderSummaryPage;
