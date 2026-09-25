import '../App.css'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getCategories } from '../api/productApi'
import { fetchProductData } from '../controllers/productController'

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

    const selectedPageHandler = (selectedPage) => {
        if (selectedPage > 0 && selectedPage <= totalPages) {
            setPage(selectedPage)
            updateUrl({newPage: selectedPage})
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }

    return (
        <div className='w-screen App font-sans'>
            <nav className='w-full flex gap-4 justify-between items-center py-4 px-5 sticky top-0 bg-secondary z-10 
                            max-[620px]:flex-col max-[620px]:items-start max-[620px]:w-full'>
                <h1 className='text-3xl font-bold '>Products</h1>

                <div className='max-[800px]:w-full flex flex-col justify-end items-end gap-2.5 mr-5 max-md:mr-0'>
                    <div className='w-full flex flex-col-reverse gap-3 items-center justify-between'>
                        <div className='w-full flex gap-3 items-center justify-end 
                                max-[200px]:flex-wrap-reverse max-[620px]:justify-between 
                                *:max-[425px]:w-[48%] *:max-[425px]:text-[85%] max-300'>
                            <button className='btn-primary bg-green-600 hover:bg-green-700 
                                    max-[400px]:text-[14px] max-[400px]:p-2' 
                                onClick={() => navigate("/products/new")}>+ Add Product
                            </button>
                            <button className='btn-primary' 
                                onClick={handleLogout}>Logout
                            </button>
                        </div>
                    </div>

                    <div className='w-full flex gap-3 items-center justify-end 
                            max-[800px]:flex-wrap max max-[620px]:w-full *:max-[620px]:w-full! max-[620px]:justify-between max-[430px]:flex-wrap-reverse'>
                        <input type="search" value={search} onChange={(e) => {
                            const value = e.target.value
                            setSearch(value)
                            setPage(1)
                            updateUrl({newPage: 1, newSearch: value})
                        }} placeholder='Search Products..' 
                        className='max-[460px]:w-full lg:w-[380px] max-lg:w-[270px] px-3 py-2 border rounded '/>

                        <div className='flex flex-wrap gap-2 items-center justify-end 
                                max-[620px]:justify-between *:max-[400px]:text-[14px] *:max-[400px]:p-2 *:max-[425px]:w-[48%] 
                                *:max-[425px]:justify-between *:max-[200px]:flex-wrap max-300'>
                            <select value={selectedCategory} onChange={(e) => {
                                const value = e.target.value
                                setSelectedCategory(value)
                                setPage(1)
                                updateUrl({newPage: 1, newCategory: value})
                            }} className='select-primary'>
                                <option value="">
                                    All Categories
                                </option>
                                {categories.map((category) => {
                                    return <option key={category.slug} value={category.slug}>
                                        {category.name}
                                    </option>
                                })}
                            </select>

                            <select value={sortBy} onChange={(e) => {
                                const value = e.target.value
                                setSortBy(value)
                                setPage(1)
                                updateUrl({newPage:1, newSort: value})
                            }} className='select-primary'>
                                <option value="">Default Sort</option>
                                <option value="price-asc">Price: Low → High</option>
                                <option value="price-desc">Price: High → Low</option>
                                <option value="rating-asc">Rating: Low → High</option>
                                <option value="rating-desc">Rating: High → Low</option>
                                <option value="title-asc">Title: A → Z</option>
                                <option value="title-desc">Title: Z → A</option>
                            </select>
                        </div>
                    </div>
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
        {products.length > 0 && (
            
            <div className='w-full pagination bg-secondary'>
            <div className="flex flex-1 items-start gap-3">
                <span>
                Showing {(page - 1) * pageSize + 1}–
                {Math.min(page * pageSize, totalProducts)} of {totalProducts}
                </span>

                <select value={pageSize}
                onChange={(e) => {
                    const value = Number(e.target.value)
                    setPageSize(value)
                    setPage(1)
                }}
                className='select-primary px-2! py-1!'>
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