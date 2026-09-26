import '../App.css'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getCategories } from '../api/productApi'
import { fetchProductData } from '../controllers/productController'
import NavBar from '../components/NavBar'
import Pagination from '../components/Pagination'

function Products() {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    
    const [products, setProducts] = useState([])
    const [page, setPage] = useState(Number(searchParams.get("page")) || 1)
    const [totalPages, setTotalPages] = useState(0)

    const [pageSize, setPageSize] = useState(10)
    const [totalProducts, setTotalProducts] = useState(0)

    const [search, setSearch] = useState(searchParams.get("search") || "")
    const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("search") || "")

    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "")

    const [sortBy, setSortBy] = useState(searchParams.get("sort") || "")


    const updateUrl = ({
        newPage = page,
        newSearch = search,
        newCategory = selectedCategory,
        newSort = sortBy,
        replace = false
    }) => {
        const params = new URLSearchParams()

        if (newPage > 1) params.set("page", newPage)

        if (newSearch.trim()) params.set("search", newSearch.trim())

        if (newCategory) params.set("category", newCategory)

        if (newSort) params.set("sort", newSort)

        setSearchParams(params, {replace})
    }

    // https://dummyjson.com/products?limit=100&skip=10
    const fetchProducts = async (signal) => {
        const data = await fetchProductData({page, pageSize, debouncedSearch, selectedCategory, sortBy, signal,})

        if (!data || signal.aborted) return

        setProducts(data.products)
        setTotalProducts(data.total)
        setTotalPages(data.totalPages)

        console.log(data)
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }

    // Effect Hooks
    useEffect(() => {
        const searchTimer = setTimeout(() => {
            console.log("Seatching product with debounce")
            const value = search.trim()
            setDebouncedSearch(value)

            updateUrl({
                newPage: 1,
                newSearch: value,
                replace: true
            })
        }, 500)

        return () => clearTimeout(searchTimer)
    }, [search])

    useEffect(() => {
        const controller = new AbortController()

        fetchProducts(controller.signal).catch((error) => {
            if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
                return
            }
            console.error("Failed to fetch products:", error)
        })

        return () => controller.abort()
    }, [page, pageSize, debouncedSearch, selectedCategory, sortBy])

    useEffect(() => {
        const urlPage = Number(searchParams.get("page")) || 1
        const urlSearch = searchParams.get("search") || ""
        const urlCategory = searchParams.get("category") || ""
        const urlSort = searchParams.get("sort") || ""

        setPage(urlPage)
        setSearch(urlSearch)
        setDebouncedSearch(urlSearch)
        setSelectedCategory(urlCategory)
        setSortBy(urlSort)
    }, [searchParams])

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


    return (
        <div className='w-screen App font-sans'>
            <NavBar onLogout={handleLogout} setSearch={setSearch} setSelectedCategory={setSelectedCategory} setSortBy={setSortBy} 
                    setPage={setPage} updateUrl={updateUrl} 
                    search={search} categories={categories} selectedCategory={selectedCategory} sortBy={sortBy}/>

            {/* Products listing */}
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
                                return <tr key={prod.id} className='hover:bg-[#1c1b1b] ease-in-out duration-100 cursor-pointer w-full'
                                        onClick={() => { navigate(`/products/${prod.id}`) }}>
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
                            return <div onClick={() => { navigate(`/products/${prod.id}`) }} 
                                    className='h-fit w-[95%] mx-auto p-2 bg-product-card hover:bg-[#212121] hover:scale-105 hover:rounded-2xl transition-all ease-in-out rounded' key={prod.id}>
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
            {products.length > 0 && (<Pagination page={page} pageSize={pageSize} totalPages={totalPages} totalProducts={totalProducts}
                                    setPage={setPage} setPageSize={setPageSize} updateUrl={updateUrl} />)}
        </div>
    )
}

export default Products