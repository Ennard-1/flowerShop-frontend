import React, { useEffect, useState } from "react";
import api from "../services/api"; // Axios configurado com baseURL do backend
import EditProductDialog from "../components/EditProductDialog";
import TagManagerDialog from "../components/TagManagerDialog";
import AddProductDialog from "../components/AddProductDialog";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showTagDialog, setShowTagDialog] = useState(false);

    // Carregar os produtos ao montar o componente
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get("/products"); // Sua rota para listar produtos
                setProducts(response.data);
                setFilteredProducts(response.data);
            } catch (error) {
                console.error("Erro ao carregar produtos:", error);
            }
        };

        fetchProducts();
    }, []);

    // Filtrar produtos com base no termo de pesquisa
    useEffect(() => {
        setFilteredProducts(
            products.filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, products]);

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setShowEditDialog(true);
    };

    const handleEditClose = () => {
        setSelectedProduct(null);
        setShowEditDialog(false);
    };

    const handleAddClose = () => {

        setShowAddDialog(false);
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-100 p-4">
                <h2 className="text-xl font-bold mb-4">Menu</h2>
                <button
                    className="w-full bg-blue-500 text-white py-2 rounded mb-4"
                    onClick={() => setShowAddDialog(true)}
                >
                    Adicionar Produto
                </button>
                <button
                    className="w-full bg-green-500 text-white py-2 rounded"
                    onClick={() => setShowTagDialog(true)}
                >
                    Gerenciar Tags
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">Lista de Produtos</h1>

                {/* Barra de Pesquisa */}
                <input
                    type="text"
                    placeholder="Pesquisar produtos..."
                    className="w-full p-2 border border-gray-300 rounded mb-6"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Lista de Produtos */}
                <div className="grid grid-cols-3 gap-4">
                    {filteredProducts.map((product) => (
                        <div
                            className="border p-4 rounded shadow cursor-pointer hover:shadow-lg"
                            key={product.id}
                            onClick={() => handleEdit(product)}
                        >
                            <h5 className="text-lg font-bold">{product.name}</h5>
                            <p className="text-gray-700">Quantidade: {product.quantity}</p>
                            <p className="text-gray-700">Preço: R$ {product.price.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dialogs */}
            {showTagDialog && (
                <TagManagerDialog onClose={() => setShowTagDialog(false)} />
            )}
            {showEditDialog && (
                <EditProductDialog
                    isOpen={showEditDialog}
                    product={selectedProduct}
                    onClose={handleEditClose}
                />
            )}
            {showAddDialog && (
                <AddProductDialog
                    isOpen={showAddDialog}
                    onClose={handleAddClose} />
            )}
        </div>
    );
};

export default ProductList;
