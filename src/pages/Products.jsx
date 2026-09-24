import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'
import { getProducts } from '../api/productApi'

function Products() {
    const navigate = useNavigate()
    
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const [pageSize, setPageSize] = useState(10)
  const [totalProducts, setTotalProducts] = useState(0)


  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  // https://dummyjson.com/products?limit=100&skip=10
  const fetchProducts = async() => {
    const skip = (page - 1) * pageSize

    const data = await getProducts(pageSize, skip)  // Data is comming from here via productApi->Axios
    if (data?.products) {
      setProducts(data.products)
      setTotalPages(Math.ceil(data.total/pageSize))
      setTotalProducts(data.total)
    }
    console.log(data)
  }

  useEffect(() => {
    fetchProducts()
  }, [page, pageSize])

  function selectedPageHandler(selectedPage) {
    if (selectedPage > 0 && selectedPage <= totalPages) {
      setPage(selectedPage)
    }
  }

  return (
    <div className='w-screen App font-sans'>
        <nav className='w-full flex justify-between items-center py-4 px-5 sticky top-0 bg-secondary z-10'>
            <h1 className='text-3xl font-bold '>Products</h1>
            <button className='btn-primary' onClick={handleLogout}>Logout</button>
        </nav>

      {products.length > 0 && (
        <div className='w-full px-5'>

            {/* Desktop: Table */}
            <table className='hidden md:table table-fixed w-full border mx-auto my-4 border-gray-400'>
                <thead className="h-15 bg-[#2b2b2b] w-full">
                <th className='table-head-cell w-[7%]'>Sr. no.</th>
                <th className='table-head-cell w-[20%]'>Image</th>
                <th className='table-head-cell w-[30%]'>Title</th>
                <th className='table-head-cell w-[18%]'>Category</th>
                <th className='table-head-cell w-[12%]'>Rating</th>
                <th className='table-head-cell w-[13%]'>Stock</th>
                </thead>
                <tbody className="bg-[#181818] w-full">
                    {products.map((prod) => {
                        return <tr className='hover:bg-[#1c1b1b] cursor-pointer w-full'>
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
              }}>
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