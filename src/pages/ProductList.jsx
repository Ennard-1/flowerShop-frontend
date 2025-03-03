import React, { useEffect, useState } from "react";
import api from "../services/api";
import EditProductDialog from "../components/EditProductDialog";
import EditProductImagesDialog from "../components/EditProductImagesDialog";
import AddProductDialog from "../components/AddProductDialog";
import TagManagerDialog from "../components/TagManagerDialog";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get("/products");
                const productsData = response.data;

                // Buscar a primeira imagem para cada produto
                const productsWithImages = await Promise.all(
                    productsData.map(async (product) => {
                        try {
                            const imageResponse = await api.get(`/products/${product.id}/images`);
                            const firstImage = imageResponse.data.length > 0 ? imageResponse.data[0].image : null;
                            return { ...product, image: firstImage };
                        } catch (error) {
                            console.error(`Erro ao buscar imagem para o produto ${product.id}:`, error);
                            return { ...product, image: null };
                        }
                    })
                );

                setProducts(productsWithImages);
                setFilteredProducts(productsWithImages);
            } catch (error) {
                console.error("Erro ao carregar produtos:", error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        setFilteredProducts(
            products.filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, products]);

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setIsEditDialogOpen(true);
    };

    const handleImagesClick = (product) => {
        setSelectedProduct(product);
        setIsImageDialogOpen(true);
    };

    return (
        <div className="flex flex-col h-screen">
            {/* Barra Superior */}
            <div className="flex justify-between bg-gray-100 p-4">
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={() => setIsAddDialogOpen(true)}
                >
                    Adicionar Produto
                </button>
                <button
                    className="bg-green-500 text-white py-2 px-4 rounded"
                    onClick={() => setIsTagDialogOpen(true)}
                >
                    Gerenciar Tags
                </button>
            </div>

            {/* Conteúdo Principal */}
            <div className="flex-1 p-6 overflow-auto">
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
                            className="flex items-center border p-4 rounded shadow hover:shadow-lg"
                            key={product.id}
                        >
                            {/* Imagem */}
                            <img
                                 src={product.image ? `${api.defaults.baseURL}${product.image}` : "/placeholder.jpg"}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded mr-4"
                            />
                            {/* Informações */}
                            <div className="flex-1">
                                <h5 className="text-lg font-bold">{product.name}</h5>
                                <p className="text-gray-700">Quantidade: {product.quantity}</p>
                                <p className="text-gray-700">Preço: R$ {product.price.toFixed(2)}</p>
                            </div>
                            {/* Botões */}
                            <div className="flex flex-col space-y-2">
                                <button
                                    className="bg-blue-500 text-white py-1 px-2 rounded"
                                    onClick={() => handleEditClick(product)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="bg-gray-500 text-white py-1 px-2 rounded"
                                    onClick={() => handleImagesClick(product)}
                                >
                                    Imagens
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dialogs */}
            <EditProductDialog
                isOpen={isEditDialogOpen}
                product={selectedProduct}
                onClose={() => setIsEditDialogOpen(false)}
            />
            <EditProductImagesDialog
                isOpen={isImageDialogOpen}
                product={selectedProduct}
                onClose={() => setIsImageDialogOpen(false)}
            />
            <AddProductDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
            />
            <TagManagerDialog
                isOpen={isTagDialogOpen}
                onClose={() => setIsTagDialogOpen(false)}
            />
        </div>
    );
};

export default ProductList;
