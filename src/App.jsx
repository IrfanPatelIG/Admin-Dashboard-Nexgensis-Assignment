import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const [pageSize, setPageSize] = useState(10)
  const [totalProducts, setTotalProducts] = useState(0)

  // https://dummyjson.com/products?limit=100&skip=10
  const fetchProducts = async() => {
    const skip = (page - 1) * pageSize

    const res = await fetch(`https://dummyjson.com/products?limit=${pageSize}&skip=${skip}`)
    const data = await res.json()
    if (data?.products) {
      setProducts(data.products)
      setTotalPages(Math.ceil(data.total/pageSize))
      setTotalProducts(data.total)
    }
    console.log(data)
  }

  console.log(products)

  // useEffect(() => {
  //   fetchProducts()
  // }, [])

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

export default App


// For Front-end based pagination

// <div className='App'>
//   {
//     products.length > 0 && (<div className='products'>
//       {products.slice(page * 10 - 10, page * 10).map((prod) => {
//           return <span className='product-single' key={prod.id}>
//               <img className='product-img' src={prod.thumbnail} alt={prod.title} />
//               <span>{prod.title}</span>
//             </span>
//         })}
//     </div>)
//   }

//   {products.length > 0 && (
//     <div className='pagination'>
//       <span className={page === 1? "pagination-disabled" : ""} onClick={() => { selectedPageHandler(page-1) }}>◀</span>
//       {
//         [...Array(products.length/10)].map((e, i) => {
//           return <span className={page === i+1? "pagination-selected" : ""} onClick={() => { selectedPageHandler(i+1) }} key={i}>{i+1}</span>
//         })
//       }
//       <span className={page >= products.length/10? "pagination-disabled" : ""} onClick={() => { selectedPageHandler(page+1) }}>▶</span>
//     </div>
//   )}
// </div>