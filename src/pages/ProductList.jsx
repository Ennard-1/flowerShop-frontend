import React, { useEffect, useState } from "react";
import api from "../services/api"; // Axios configurado com baseURL do backend
import EditProductDialog from "../components/EditProductDialog";
import TagManagerDialog from "../components/TagManagerDialog";


const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [showTagDialog, setShowTagDialog] = useState(false);
    // Carregar os produtos ao montar o componente
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get("/products"); // Sua rota para listar produtos
                setProducts(response.data);
            } catch (error) {
                console.error("Erro ao carregar produtos:", error);
            }
        };

        fetchProducts();
    }, []);

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setSelectedProduct(null);
        setIsDialogOpen(false);
    };

    const handleSave = async (updatedProduct) => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("Token não encontrado. Faça login novamente.");
            return;
        }

        try {
            console.log(updatedProduct)
            const response = await api.put(
                `/products/${updatedProduct.id}`,
                updatedProduct,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Adicionando o token no cabeçalho
                    },
                }
            );

            console.log('Produto atualizado com sucesso:', response.data);
        } catch (error) {
            console.error('Erro ao atualizar o produto:', error);
        }
    };


    return (
        <div className="container py-4">
            <h1 className="text-center mb-4">Lista de Produtos</h1>
            <div className="row">
                {products.map((product) => (
                    <div
                        className="col-md-4 mb-4"
                        key={product.id}
                        onClick={() => handleEdit(product)}
                    >
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">Quantidade: {product.quantity}</p>
                                <p className="card-text">Preço: R$ {product.price.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal para editar produto */}

            <button onClick={() => setShowTagDialog(true)}>Gerenciar Tags</button>
            {showTagDialog && (
                <TagManagerDialog onClose={() => setShowTagDialog(false)} />
            )}
            {isDialogOpen && selectedProduct && (
                <EditProductDialog
                    isOpen={handleEdit}
                    product={selectedProduct}
                    onClose={handleDialogClose}
                    onSave={handleSave}
                />
            )}
        </div>

    );
};

export default ProductList;
