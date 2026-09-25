import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'
import { getProducts, searchProducts, getCategories, getProductsByCategory } from '../api/productApi'

function Products() {
    const navigate = useNavigate()
    
    const [products, setProducts] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)

    const [pageSize, setPageSize] = useState(10)
    const [totalProducts, setTotalProducts] = useState(0)

    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")

    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("")


    useEffect(() => {
        const searchTimer = setTimeout(() => {
            console.log("Seatching product with debounce")
            setDebouncedSearch(search.trim())
        }, 500)

        return () => clearTimeout(searchTimer)
    }, [search])

    // https://dummyjson.com/products?limit=100&skip=10
    const fetchProducts = async (signal) => {
        const skip = (page - 1) * pageSize

        let data
        
        if (selectedCategory) {
            data = await getProductsByCategory(selectedCategory, pageSize, skip, signal)
        } else if (debouncedSearch) {
            data = await searchProducts(debouncedSearch, pageSize, skip, signal)
        } else {
            data = await getProducts(pageSize, skip, signal)
        }

        if (data?.products) {
            setProducts(data.products)
            setTotalPages(Math.ceil(data.total/pageSize)) // because it gives a fraction value
            setTotalProducts(data.total)
        }
        console.log(data)
    }

    useEffect(() => {
        const controller = new AbortController()

        fetchProducts(controller.signal).catch((error) => {
            if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
                return
            }
            console.error("Failed to fetch products:", error)
        })

        return () => controller.abort()
    }, [page, pageSize, debouncedSearch, selectedCategory])

    useEffect(() => {
        const controller = new AbortController()

        getCategories(controller.signal).then((data) => {
            setCategories(data)
        })
        .catch((error) => {
            if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
                return
            }
            console.error("Failed to fetch categories:", error)
        })

        return () => controller.abort()
    }, [])

    const selectedPageHandler = (selectedPage) => {
        if (selectedPage > 0 && selectedPage <= totalPages) {
            setPage(selectedPage)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }

    return (
        <div className='w-screen App font-sans'>
            <nav className='w-full flex flex-wrap gap-4 justify-between items-center py-4 px-5 sticky top-0 bg-secondary z-10'>
                <h1 className='text-3xl font-bold '>Products</h1>
                <div className='flex flex-wrap justify-end gap-3 items-center'>
                    <input type="search" value={search} onChange={(e) => {
                        setSearch(e.target.value)
                        setPage(1)
                    }} placeholder='Search Products..' className='px-3 py-2 border rounded'/>

                    <select value={selectedCategory} onChange={(e) => {
                        setSelectedCategory(e.target.value)
                        setPage(1)
                    }} className='bg-[#dbd7d7] text-sm border text-slate-700 border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md cursor-pointer'>
                        <option value="">
                            All Categories
                        </option>
                        {categories.map((category) => {
                            return <option key={category.slug} value={category.slug}>
                                {category.name}
                            </option>
                        })}
                    </select>

                    <button className='btn-primary mr-5' onClick={handleLogout}>Logout</button>
                </div>
            </nav>

        {products.length > 0 && (
            <div className='w-[98%] px-5'>

                {/* Desktop: Table */}
                <table className='hidden md:table table-fixed w-full border mx-auto my-4 border-gray-400'>
                    <thead className="h-15 bg-[#2b2b2b] w-full">
                        <tr>
                            <th className='table-head-cell w-[7%]'>Sr. no.</th>
                            <th className='table-head-cell w-[20%]'>Image</th>
                            <th className='table-head-cell w-[30%]'>Title</th>
                            <th className='table-head-cell w-[18%]'>Category</th>
                            <th className='table-head-cell w-[12%]'>Rating</th>
                            <th className='table-head-cell w-[13%]'>Stock</th>
                        </tr>
                    </thead>
                    <tbody className="bg-[#181818] w-full">
                        {products.map((prod) => {
                            return <tr key={prod.id} className='hover:bg-[#1c1b1b] cursor-pointer w-full'>
                                <td className='table-data-cell'>{prod.id}</td>
                                <td className='table-data-cell'><img className='h-35 mx-auto object-cover' src={prod.thumbnail} alt={prod.title} /></td>
                                <td className='table-data-cell'><span>{prod.title}</span></td>
                                <td className='table-data-cell'><span>{prod.category}</span></td>
                                <td className='table-data-cell'><span>{prod.rating}</span></td>
                                <td className='table-data-cell'><span>{prod.stock}</span></td>
                            </tr>
                        })}
                    </tbody>
                </table>

                {/* Mobile: Cards */}
                <div className='md:hidden flex flex-col gap-4 my-3'>
                    {products.map((prod) => {
                        return <div className='h-fit w-[95%] mx-auto p-2 bg-product-card hover:bg-[#212121] hover:scale-105 hover:rounded-2xl transition-all ease-in-out rounded' key={prod.id}>
                            <img className='w-full h-50 mb-2 object-contain border-b' src={prod.thumbnail} alt={prod.title} />
                            <div className='flex gap-4 flex-col'>
                                <div className='text-2xl'>{prod.title}</div>
                                <div className='pl-3'><span className='text-gray-500'>Category:</span> {prod.category}</div>
                                <div className='w-full flex gap-3 justify-between px-3'>
                                    <div><span className='text-gray-500'>Rating:</span> {prod.rating}</div>
                                    <div><span className='text-gray-500'>Stock:</span> {prod.stock}</div>
                                </div>
                            </div>
                        </div>
                    })}
                </div>

            </div>)
        }


        {/* Pagination 10, 20, 50 */}
        {products.length > 0 && (
            
            <div className='w-full pagination bg-secondary'>
            <div className="flex flex-1 items-start gap-3">
                <span>
                Showing {(page - 1) * pageSize + 1}–
                {Math.min(page * pageSize, totalProducts)} of {totalProducts}
                </span>

                <select value={pageSize}
                onChange={(e) => {
                    setPageSize(Number(e.target.value))
                    setPage(1)
                }}
                className='bg-[#dbd7d7] text-sm border text-slate-700 border-slate-200 rounded focus:outline-none focus:border-slate-400 focus:shadow-md cursor-pointer'>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                </select>
            </div>

            <div className='flex flex-1 flex-wrap items-center justify-center'>
                <span className={`${page === 1? "pagination-disabled" : ""} mx-1 page-btn`} onClick={() => { selectedPageHandler(page-1) }}>◀</span>
                {
                [...Array(totalPages)].map((e, i) => {
                    return <span className={`${page === i+1? "pagination-selected" : ""} page-btn`} onClick={() => { selectedPageHandler(i+1) }} key={i}>{i+1}</span>
                })
                }
                <span className={`${page === totalPages? "pagination-disabled" : ""} mx-1 page-btn`} onClick={() => { selectedPageHandler(page+1) }}>▶</span> 
            </div>
            </div>
        )}
        </div>
    )
}

export default Products