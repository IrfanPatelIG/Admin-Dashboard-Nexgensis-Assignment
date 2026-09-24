import { useEffect, useState } from 'react'
import '../App.css'
import { getProducts } from '../api/productApi'

function Products() {
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const [pageSize, setPageSize] = useState(10)
  const [totalProducts, setTotalProducts] = useState(0)

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
    <div className='App'>
      {
        products.length > 0 && (<div className='products'>
          {products.map((prod) => {
              return <span className='product-single' key={prod.id}>
                  <img className='product-img' src={prod.thumbnail} alt={prod.title} />
                  <span>{prod.title}</span>
                </span>
            })}
        </div>)
      }

      {products.length > 0 && (
        
        <div className='pagination'>
          <div className="pagination-info">
            <span>
              Showing {(page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, totalPages * pageSize)} of {totalProducts}
            </span>

            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value))
                setPage(1)
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className='pagination-btns'>
            <span className={page === 1? "pagination-disabled" : ""} onClick={() => { selectedPageHandler(page-1) }}>◀</span>
            {
              [...Array(totalPages)].map((e, i) => {
                return <span className={page === i+1? "pagination-selected" : ""} onClick={() => { selectedPageHandler(i+1) }} key={i}>{i+1}</span>
              })
            }
            <span className={page >= totalPages? "pagination-disabled" : ""} onClick={() => { selectedPageHandler(page+1) }}>▶</span> 
          </div>
        </div>
      )}
    </div>
  )
}

export default Products