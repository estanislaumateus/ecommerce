
// E-commerce functionality
class EcommerceStore {
    constructor() {
        this.products = [];
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 9;

        this.init();
    }

    init() {
        this.loadProducts();
        this.bindEvents();
        this.updateCartUI();
        this.setupFilters();
    }

    loadProducts() {
        // Sample products data
        this.products = [
            {
                id: 1,
                name: "iPhone 15 Pro Max",
                price: 8999,
                originalPrice: 9999,
                category: "smartphones",
                brand: "apple",
                rating: 5,
                reviews: 234,
                image: "./images/Iphone15Promax.jpg",
                description: "O mais avançado iPhone já criado com chip A17 Pro e câmera profissional.",
                features: ["Chip A17 Pro", "Câmera 48MP", "Tela 6.7\"", "5G"],
                inStock: true,
                discount: 10
            },
            {
                id: 2,
                name: "Samsung Galaxy S24 Ultra",
                price: 7499,
                originalPrice: 7999,
                category: "smartphones",
                brand: "samsung",
                rating: 5,
                reviews: 189,
                image: "./images/samsungs24ULtra.jpg",
                description: "Galaxy S24 Ultra com S Pen integrada e câmera de 200MP.",
                features: ["S Pen", "Câmera 200MP", "Tela 6.8\"", "5G"],
                inStock: true,
                discount: 6
            },
            {
                id: 3,
                name: "MacBook Pro M3",
                price: 12999,
                originalPrice: 13999,
                category: "laptops",
                brand: "apple",
                rating: 5,
                reviews: 156,
                image: "./images/macBookProm3.jpg",
                description: "MacBook Pro com chip M3 para performance profissional.",
                features: ["Chip M3", "16GB RAM", "512GB SSD", "Tela Retina"],
                inStock: true,
                discount: 7
            },
            {
                id: 4,
                name: "Dell XPS 13",
                price: 6999,
                originalPrice: 7499,
                category: "laptops",
                brand: "dell",
                rating: 4,
                reviews: 98,
                image: "./images/DellXPS13.jpg",
                description: "Ultrabook premium com design elegante e performance excepcional.",
                features: ["Intel i7", "16GB RAM", "512GB SSD", "Tela 13.3\""],
                inStock: true,
                discount: 7
            },
            {
                id: 5,
                name: "iPad Pro 12.9",
                price: 8499,
                originalPrice: 8999,
                category: "tablets",
                brand: "apple",
                rating: 5,
                reviews: 167,
                image: "./images/IpadPro12.jpg",
                description: "iPad Pro com chip M2 e tela Liquid Retina XDR.",
                features: ["Chip M2", "Tela 12.9\"", "Wi-Fi 6E", "USB-C"],
                inStock: true,
                discount: 6
            },
            {
                id: 6,
                name: "AirPods Pro 2ª Geração",
                price: 1899,
                originalPrice: 2199,
                category: "acessorios",
                brand: "apple",
                rating: 5,
                reviews: 445,
                image: "./images/AirPodsPro.jpg",
                description: "AirPods Pro com cancelamento ativo de ruído aprimorado.",
                features: ["Cancelamento de Ruído", "Áudio Espacial", "Resistente à Água", "MagSafe"],
                inStock: true,
                discount: 14
            },
            {
                id: 7,
                name: "PlayStation 5",
                price: 3999,
                originalPrice: 4299,
                category: "gaming",
                brand: "sony",
                rating: 5,
                reviews: 312,
                image: "./images/PlayStation5.jpg",
                description: "Console PlayStation 5 com SSD ultra-rápido e gráficos 4K.",
                features: ["SSD 825GB", "4K Gaming", "Ray Tracing", "DualSense"],
                inStock: true,
                discount: 7
            },
            {
                id: 8,
                name: "Echo Dot 5ª Geração",
                price: 349,
                originalPrice: 399,
                category: "smart-home",
                brand: "amazon",
                rating: 4,
                reviews: 567,
                image: "./images/EchoDot5.jpg",
                description: "Smart speaker com Alexa e som melhorado.",
                features: ["Alexa", "Wi-Fi", "Bluetooth", "Controle Smart Home"],
                inStock: true,
                discount: 13
            },
            {
                id: 9,
                name: "Samsung Galaxy Tab S9",
                price: 4999,
                originalPrice: 5499,
                category: "tablets",
                brand: "samsung",
                rating: 4,
                reviews: 89,
                image: "./images/SamsungGalaxytab.jpg",
                description: "Tablet premium com S Pen incluída e tela AMOLED.",
                features: ["S Pen", "Tela AMOLED", "8GB RAM", "256GB"],
                inStock: true,
                discount: 9
            }
        ];

        this.filteredProducts = [...this.products];
        this.renderProducts();
    }

    bindEvents() {
        // Cart events
        document.getElementById('cart-btn').addEventListener('click', () => this.toggleCart());
        document.getElementById('close-cart').addEventListener('click', () => this.closeCart());

        // Modal events
        document.getElementById('close-modal').addEventListener('click', () => this.closeModal());
        document.getElementById('product-modal').addEventListener('click', (e) => {
            if (e.target.id === 'product-modal') this.closeModal();
        });

        // Search
        document.getElementById('search-btn').addEventListener('click', () => this.search());
        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.search();
        });

        // Sort
        document.getElementById('sort-select').addEventListener('change', (e) => this.sortProducts(e.target.value));

        // Category cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                this.filterByCategory(category);
            });
        });

        // Overlay
        document.getElementById('overlay').addEventListener('click', () => {
            this.closeCart();
            this.closeModal();
        });
    }

    setupFilters() {
        // Price range filters
        const minPrice = document.getElementById('min-price');
        const maxPrice = document.getElementById('max-price');
        const minDisplay = document.getElementById('min-price-display');
        const maxDisplay = document.getElementById('max-price-display');

        minPrice.addEventListener('input', (e) => {
            minDisplay.textContent = e.target.value;
            this.applyFilters();
        });

        maxPrice.addEventListener('input', (e) => {
            maxDisplay.textContent = e.target.value;
            this.applyFilters();
        });

        // Category filters
        document.querySelectorAll('.category-filter').forEach(filter => {
            filter.addEventListener('change', () => this.applyFilters());
        });

        // Brand filters
        document.querySelectorAll('.brand-filter').forEach(filter => {
            filter.addEventListener('change', () => this.applyFilters());
        });

        // Rating filters
        document.querySelectorAll('.rating-filter').forEach(filter => {
            filter.addEventListener('change', () => this.applyFilters());
        });

        // Clear filters
        document.getElementById('clear-filters').addEventListener('click', () => this.clearFilters());
    }

    renderProducts() {
        const grid = document.getElementById('products-grid');
        const loading = document.getElementById('loading');

        loading.classList.remove('hidden');

        setTimeout(() => {
            loading.classList.add('hidden');

            if (this.filteredProducts.length === 0) {
                grid.innerHTML = `
                            <div class="col-span-full text-center py-12">
                                <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
                                <p class="text-gray-500 text-lg">Nenhum produto encontrado</p>
                            </div>
                        `;
                return;
            }

            const startIndex = (this.currentPage - 1) * this.productsPerPage;
            const endIndex = startIndex + this.productsPerPage;
            const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

            grid.innerHTML = productsToShow.map(product => this.createProductCard(product)).join('');

            // Bind product events
            this.bindProductEvents();
        }, 500);
    }

    createProductCard(product) {
        const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

        return `
                    <div class="product-card bg-white rounded-lg shadow-lg overflow-hidden">
                        ${product.discount > 0 ? `<div class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold z-10">-${discountPercentage}%</div>` : ''}
                        <div class="relative">
                            <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover">
                            <button class="absolute top-2 right-2 bg-white text-gray-600 p-2 rounded-full hover:text-red-500 transition duration-300 wishlist-btn" data-id="${product.id}">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                        <div class="p-6">
                            <h3 class="text-lg font-semibold mb-2 line-clamp-2">${product.name}</h3>
                            <div class="flex items-center mb-2">
                                <div class="flex text-yellow-400 mr-2">
                                    ${this.renderStars(product.rating)}
                                </div>
                                <span class="text-sm text-gray-600">(${product.reviews})</span>
                            </div>
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <span class="text-2xl font-bold text-primary">R$ ${product.price.toLocaleString('pt-BR')}</span>
                                    ${product.originalPrice > product.price ? `<span class="text-sm text-gray-500 line-through ml-2">R$ ${product.originalPrice.toLocaleString('pt-BR')}</span>` : ''}
                                </div>
                            </div>
                            <div class="flex space-x-2">
                                <button class="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary transition duration-300 add-to-cart-btn" data-id="${product.id}">
                                    <i class="fas fa-shopping-cart mr-2"></i>Comprar
                                </button>
                                <button class="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300 view-product-btn" data-id="${product.id}">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
    }

    renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    bindProductEvents() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('.add-to-cart-btn').dataset.id);
                this.addToCart(productId);
            });
        });

        // View product buttons
        document.querySelectorAll('.view-product-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('.view-product-btn').dataset.id);
                this.viewProduct(productId);
            });
        });

        // Wishlist buttons
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const icon = e.target.closest('.wishlist-btn').querySelector('i');
                icon.classList.toggle('fas');
                icon.classList.toggle('far');
                this.showNotification('Produto adicionado aos favoritos!', 'info');
            });
        });
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.showNotification(`${product.name} adicionado ao carrinho!`);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartFooter = document.getElementById('cart-footer');
        const cartTotal = document.getElementById('cart-total');
        const emptyCart = document.getElementById('empty-cart');

        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Update cart count
        if (totalItems > 0) {
            cartCount.textContent = totalItems;
            cartCount.classList.remove('hidden');
        } else {
            cartCount.classList.add('hidden');
        }

        // Update cart items
        if (this.cart.length === 0) {
            emptyCart.classList.remove('hidden');
            cartFooter.classList.add('hidden');
        } else {
            emptyCart.classList.add('hidden');
            cartFooter.classList.remove('hidden');

            cartItems.innerHTML = `
                        <div class="space-y-4">
                            ${this.cart.map(item => `
                                <div class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                                    <div class="flex-1">
                                        <h4 class="font-semibold text-sm">${item.name}</h4>
                                        <p class="text-primary font-bold">R$ ${item.price.toLocaleString('pt-BR')}</p>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <button class="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 transition duration-300" onclick="store.updateQuantity(${item.id}, ${item.quantity - 1})">
                                            <i class="fas fa-minus text-xs"></i>
                                        </button>
                                        <span class="w-8 text-center">${item.quantity}</span>
                                        <button class="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 transition duration-300" onclick="store.updateQuantity(${item.id}, ${item.quantity + 1})">
                                            <i class="fas fa-plus text-xs"></i>
                                        </button>
                                    </div>
                                    <button class="text-red-500 hover:text-red-700 transition duration-300" onclick="store.removeFromCart(${item.id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    `;
        }

        cartTotal.textContent = `R$ ${totalPrice.toLocaleString('pt-BR')}`;
    }

    viewProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = `
                    <div class="grid md:grid-cols-2 gap-8">
                        <div>
                            <img src="${product.image}" alt="${product.name}" class="w-full rounded-lg">
                        </div>
                        <div>
                            <h1 class="text-3xl font-bold mb-4">${product.name}</h1>
                            <div class="flex items-center mb-4">
                                <div class="flex text-yellow-400 mr-2">
                                    ${this.renderStars(product.rating)}
                                </div>
                                <span class="text-gray-600">(${product.reviews} avaliações)</span>
                            </div>
                            <div class="mb-6">
                                <span class="text-3xl font-bold text-primary">R$ ${product.price.toLocaleString('pt-BR')}</span>
                                ${product.originalPrice > product.price ? `<span class="text-lg text-gray-500 line-through ml-2">R$ ${product.originalPrice.toLocaleString('pt-BR')}</span>` : ''}
                            </div>
                            <p class="text-gray-600 mb-6">${product.description}</p>
                            <div class="mb-6">
                                <h3 class="font-semibold mb-2">Características:</h3>
                                <ul class="space-y-1">
                                    ${product.features.map(feature => `<li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>${feature}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="flex space-x-4">
                                <button class="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-secondary transition duration-300" onclick="store.addToCart(${product.id}); store.closeModal();">
                                    <i class="fas fa-shopping-cart mr-2"></i>Adicionar ao Carrinho
                                </button>
                                <button class="bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-300">
                                    <i class="fas fa-heart mr-2"></i>Favoritar
                                </button>
                            </div>
                        </div>
                    </div>
                `;

        document.getElementById('product-modal').classList.remove('hidden');
        document.getElementById('product-modal').classList.add('flex');
        document.getElementById('overlay').classList.remove('hidden');
    }

    toggleCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('overlay');

        if (cartSidebar.classList.contains('translate-x-full')) {
            cartSidebar.classList.remove('translate-x-full');
            overlay.classList.remove('hidden');
        } else {
            this.closeCart();
        }
    }

    closeCart() {
        document.getElementById('cart-sidebar').classList.add('translate-x-full');
        document.getElementById('overlay').classList.add('hidden');
    }

    closeModal() {
        document.getElementById('product-modal').classList.add('hidden');
        document.getElementById('product-modal').classList.remove('flex');
        document.getElementById('overlay').classList.add('hidden');
    }

    search() {
        const query = document.getElementById('search-input').value.toLowerCase().trim();

        if (query === '') {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = this.products.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query) ||
                product.brand.toLowerCase().includes(query)
            );
        }

        this.currentPage = 1;
        this.renderProducts();
    }

    filterByCategory(category) {
        // Update category filter
        document.querySelectorAll('.category-filter').forEach(filter => {
            filter.checked = filter.value === category || filter.value === 'all';
        });

        this.applyFilters();

        // Scroll to products
        document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
    }

    applyFilters() {
        const minPrice = parseInt(document.getElementById('min-price').value);
        const maxPrice = parseInt(document.getElementById('max-price').value);

        const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked')).map(cb => cb.value);
        const selectedBrands = Array.from(document.querySelectorAll('.brand-filter:checked')).map(cb => cb.value);
        const selectedRatings = Array.from(document.querySelectorAll('.rating-filter:checked')).map(cb => parseInt(cb.value));

        this.filteredProducts = this.products.filter(product => {
            // Price filter
            if (product.price < minPrice || product.price > maxPrice) return false;

            // Category filter
            if (selectedCategories.length > 0 && !selectedCategories.includes('all') && !selectedCategories.includes(product.category)) return false;

            // Brand filter
            if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;

            // Rating filter
            if (selectedRatings.length > 0 && !selectedRatings.some(rating => product.rating >= rating)) return false;

            return true;
        });

        this.currentPage = 1;
        this.renderProducts();
    }

    clearFilters() {
        // Reset price sliders
        document.getElementById('min-price').value = 0;
        document.getElementById('max-price').value = 5000;
        document.getElementById('min-price-display').textContent = '0';
        document.getElementById('max-price-display').textContent = '5000';

        // Reset checkboxes
        document.querySelectorAll('.category-filter, .brand-filter, .rating-filter').forEach(cb => {
            cb.checked = cb.value === 'all';
        });

        // Reset search
        document.getElementById('search-input').value = '';

        this.filteredProducts = [...this.products];
        this.currentPage = 1;
        this.renderProducts();
    }

    sortProducts(sortBy) {
        switch (sortBy) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                this.filteredProducts.sort((a, b) => b.id - a.id);
                break;
            default:
                // relevance - keep original order
                break;
        }

        this.renderProducts();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notification-text');

        notificationText.textContent = message;

        // Set color based on type
        notification.className = `fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg notification z-50 ${type === 'success' ? 'bg-green-500' :
                type === 'error' ? 'bg-red-500' :
                    'bg-blue-500'
            } text-white`;

        notification.classList.remove('hidden');

        setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
    }
}

// Utility functions
function scrollToProducts() {
    document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
}

// Initialize store
let store;
document.addEventListener('DOMContentLoaded', () => {
    store = new EcommerceStore();
});
