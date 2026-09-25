import api from "./axios";

export const getProducts = async (limit, skip, signal) => {
    const res = await api.get(`/products`, {
        params: { limit, skip, },
        signal,
    } )

    return res.data
}

export const searchProducts = async (query, limit, skip, signal) => {
    const res = await api.get(`/products/search`, {
        params: {q: query, limit, skip},
        signal,
    })

    return res.data;
}

export const getCategories = async (signal) => {
    const res = await api.get('/products/categories', {
        signal,
    })

    return res.data
}

export const getProductsByCategory = async (category, limit, skip, signal) => {
    const res = await api.get(`/products/category/${encodeURIComponent(category)}`, {
        params: {limit, skip},
        signal,
    })
    
    return res.data
}

export const getAllProductsByCategory = async (category, signal) => {
    const res = await api.get(`/products/category/${encodeURIComponent(category)}`, {
        params: {limit: 0},
        signal,
    })
    
    return res.data
}

export const getAllProducts = async (signal) => {
    const res = await api.get(`/products`, {
        params: {limit: 0},
        signal,
    })

    return res.data
}

export const getProductById = async (id, signal) => {
    const res = await api.get(`/products/${id}`, {signal,})

    return res.data
}