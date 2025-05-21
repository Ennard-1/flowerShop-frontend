"use client";

import React, { useEffect, useState } from "react";
import { getCart } from "../services/cart";
import { ClipboardCopy, ClipboardCheck, Send } from "lucide-react";

const OrderSummaryPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [whatsMessage, setWhatsMessage] = useState("");
  const [rawMessage, setRawMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const items = getCart();
    setCartItems(items);

    const { raw, encoded } = generateWhatsappMessage(items);
    setRawMessage(raw);
    setWhatsMessage(encoded);
  }, []);

  const generateWhatsappMessage = (items) => {
    if (!items || items.length === 0)
      return { raw: "Carrinho vazio.", encoded: encodeURIComponent("Carrinho vazio.") };
  
    let message = "*📦 Novo Pedido:*\n\n";
  
    items.forEach((item, index) => {
      const isCartao = item.tagCartao;
      const quantity = isCartao ? 1 : item.quantity;
  
      // Exibindo o nome do produto, índice e preço
      message += `*${index + 1}.* ${item.name} - R$ ${item.price.toFixed(2)}\n`;
  
      // Exibindo a quantidade, se não for cartão
      if (!isCartao) {
        message += `  Quantidade: *${quantity}* \n`;
      } 
  
      // Exibindo a mensagem do cartão, se existir
      if (isCartao && item.text) {
        message += `  _Mensagem do Cartão:_ "${item.text}"\n`;
      }
  
      message += `\n`;
    });
  
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    message += `*Total:* R$ ${total.toFixed(2)}\n\n`;
 
    return {
      raw: message,
      encoded: encodeURIComponent(message),
    };
  };
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(rawMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  console.log(whatsappNumber)
  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-lg p-6 shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-dark">Resumo do Pedido</h1>

        {cartItems.length === 0 ? (
          <p className="text-muted">Seu carrinho está vazio.</p>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {cartItems.map((item, index) => (
                <div key={index} className="border-b pb-3">
                  <p className="font-medium text-dark">{item.name}</p>
                  <p className="text-sm text-muted">
                    Quantidade: {item.tagCartao ? 1 : item.quantity} • R$ {item.price.toFixed(2)}
                  </p>
                  {item.tagCartao && item.text && (
                    <p className="mt-1 text-sm italic text-gray-600">Mensagem: “{item.text}”</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
              >
                <Send className="w-5 h-5" />
                Enviar Pedido via WhatsApp
              </a>

              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 w-full bg-gray-200 hover:bg-gray-300 text-black font-medium py-2 rounded-lg transition"
              >
                {copied ? (
                  <>
                    <ClipboardCheck className="w-5 h-5" />
                    Mensagem copiada!
                  </>
                ) : (
                  <>
                    <ClipboardCopy className="w-5 h-5" />
                    Copiar mensagem manualmente
                  </>
                )}
              </button>
            </div>

            <textarea
              className="w-full mt-4 text-sm bg-gray-100 p-3 rounded border border-gray-300 text-gray-700"
              rows={8}
              readOnly
              value={rawMessage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default OrderSummaryPage;
