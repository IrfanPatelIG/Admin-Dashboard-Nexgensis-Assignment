
function Pagination(props) {

    const selectedPageHandler = (selectedPage) => {
        if (selectedPage > 0 && selectedPage <= props.totalPages) {
            props.setPage(selectedPage)
            props.updateUrl({newPage: selectedPage})
        }
    }

    const pageClickHandler = (e) => {
        const value = Number(e.target.value)
        props.setPageSize(value)
        props.setPage(1)
    }

    return (
        <div className='w-full pagination bg-secondary'>
            <div className="flex flex-1 items-start gap-3">
                <span>
                    Showing {(props.page- 1) * props.pageSize + 1}–
                    {Math.min(props.page* props.pageSize, props.totalProducts)} of {props.totalProducts}
                </span>

                <select value={props.pageSize}
                    onChange={pageClickHandler}
                    className='select-primary px-2! py-1!'>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>

            <div className='flex flex-1 flex-wrap items-center justify-center'>
                <span className={`${props.page=== 1? "pagination-disabled" : ""} mx-1 page-btn`} 
                        onClick={() => { selectedPageHandler(props.page-1) }}>◀
                </span>
                {
                    [...Array(props.totalPages)].map((e, i) => {
                        return  <span className={`${props.page=== i+1? "pagination-selected" : ""} page-btn`} 
                                        onClick={() => { selectedPageHandler(i+1) }} key={i}>{i+1}
                                </span>
                        })
                }
                <span className={`${props.page=== props.totalPages? "pagination-disabled" : ""} mx-1 page-btn`} 
                        onClick={() => { selectedPageHandler(props.page+1) }}>▶
                </span> 
            </div>
        </div>
    )
}

export default Pagination