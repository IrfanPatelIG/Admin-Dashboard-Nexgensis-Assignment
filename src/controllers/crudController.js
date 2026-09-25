import { addProduct, updateProduct, deleteProduct } from '../api/productApi'

export const createProduct = async (product, signal) => {
    const data = await addProduct(product, signal)

    if (signal?.aborted) return null

    return data
}

export const editProduct = async (id, product, signal) => {
    const data = await updateProduct(id, product, signal)

    if (signal?.aborted) return null
    
    return data
}

export const removeProduct = async (id, signal) => {
    const data = await deleteProduct(id, signal)

    if (signal?.aborted) return null

    return data
}