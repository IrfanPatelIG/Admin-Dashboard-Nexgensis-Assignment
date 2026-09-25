import { getProducts, searchProducts, 
        getProductsByCategory, getAllProductsByCategory, getAllProducts } from '../api/productApi'
import { getProductById } from '../api/productApi'

export const sortProducts = (products, sortBy) => {
    const sortedProducts = [...products]

    switch (sortBy) {
        case "price-asc":
            return sortedProducts.sort((a, b) => a.price - b.price)

        case "price-desc":
            return sortedProducts.sort((a, b) => b.price - a.price)

        case "rating-asc":
            return sortedProducts.sort((a, b) => a.rating - b.rating)

        case "rating-desc":
            return sortedProducts.sort((a, b) => b.rating - a.rating)

        case "title-asc":
            return sortedProducts.sort((a, b) =>
                a.title.localeCompare(b.title)
            )

        case "title-desc":
            return sortedProducts.sort((a, b) =>
                b.title.localeCompare(a.title)
            )

        default:
            return sortedProducts
    }
}

export const filterProducts = (products, search) => {
    if (!search) return products

    const query = search.toLowerCase()

    return products.filter((product) => {
        return (
            product.title?.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query) ||
            product.brand?.toLowerCase().includes(query)
        )
    })
}

export const fetchProductData = async ({page, pageSize, debouncedSearch, selectedCategory, sortBy, signal,}) => {
    const skip = (page - 1) * pageSize

    // SORTING ACTIVE
    if (sortBy) {
        let data

        if (selectedCategory) {
            data = await getAllProductsByCategory(
                selectedCategory,
                signal
            )
        } else {
            data = await getAllProducts(signal)
        }

        if (signal.aborted) return null

        let filteredProducts = data.products

        // Search
        filteredProducts = filterProducts(filteredProducts, debouncedSearch)

        // Sort
        const sortedProducts = sortProducts(filteredProducts, sortBy)

        // Pagination
        const paginatedProducts = sortedProducts.slice(skip, skip + pageSize)

        return {
            products: paginatedProducts,
            total: sortedProducts.length,
            totalPages: Math.ceil(sortedProducts.length / pageSize),
        }
    }


    // CATEGORY + SEARCH
    if (selectedCategory && debouncedSearch) {

        const data = await getAllProductsByCategory(selectedCategory, signal)

        if (signal.aborted) return null

        const filteredProducts = filterProducts(data.products, debouncedSearch)

        const total = filteredProducts.length

        const paginatedProducts = filteredProducts.slice(skip, skip + pageSize)

        return {
            products: paginatedProducts,
            total,
            totalPages: Math.ceil(total / pageSize),
        }
    }


    // CATEGORY ONLY
    if (selectedCategory) {

        const data = await getProductsByCategory(selectedCategory, pageSize, skip, signal)

        return {
            products: data.products,
            total: data.total,
            totalPages: Math.ceil(data.total / pageSize),
        }
    }


    // SEARCH ONLY
    if (debouncedSearch) {

        const data = await searchProducts(debouncedSearch, pageSize, skip, signal)

        return {
            products: data.products,
            total: data.total,
            totalPages: Math.ceil(data.total / pageSize),
        }
    }

    // ALL PRODUCTS
    const data = await getProducts(pageSize, skip, signal)

    return {
        products: data.products,
        total: data.total,
        totalPages: Math.ceil(data.total / pageSize),
    }
}

export const fetchProductById = async (id, signal) => {
    const product = await getProductById(id, signal)

    if (signal.aborted) return null

    return product
}