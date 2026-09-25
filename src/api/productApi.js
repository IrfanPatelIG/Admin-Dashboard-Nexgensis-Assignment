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