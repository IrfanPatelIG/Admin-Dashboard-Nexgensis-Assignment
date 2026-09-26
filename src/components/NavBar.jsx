import { useNavigate } from 'react-router-dom'

function NavBar(props) {
    const navigate = useNavigate()

    const handleSearchInChange = (e) => {
        const value = e.target.value
        props.setSearch(value)
        props.setPage(1)
        props.updateUrl({newPage: 1, newSearch: value})
    }

    const handleCategoryDropChange = (e) => {
        const value = e.target.value
        props.setSelectedCategory(value)
        props.setPage(1)
        props.updateUrl({newPage: 1, newCategory: value})
    }

    const handleSortByDropChnage = (e) => {
        const value = e.target.value
        props.setSortBy(value)
        props.setPage(1)
        props.updateUrl({newPage:1, newSort: value})
    }

    return (
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
                        onClick={props.onLogout}>Logout
                    </button>
                </div>
            </div>

            <div className='w-full flex gap-3 items-center justify-end 
                    max-[800px]:flex-wrap max max-[620px]:w-full *:max-[620px]:w-full! max-[620px]:justify-between max-[430px]:flex-wrap-reverse'>
                <input type="search" value={props.search} onChange={handleSearchInChange} placeholder='Search Products..' 
                className='max-[460px]:w-full lg:w-[380px] max-lg:w-[270px] px-3 py-2 border rounded duration-500 ease-in-out'/>

                <div className='flex flex-wrap gap-2 items-center justify-end *:duration-500 *:ease-in-out
                        max-[620px]:justify-between *:max-[400px]:text-[14px] *:max-[400px]:p-2 *:max-[425px]:w-[48%] 
                        *:max-[425px]:justify-between *:max-[200px]:flex-wrap max-300'>
                    <select value={props.selectedCategory} onChange={handleCategoryDropChange} className='select-primary'>
                        <option value="">
                            All Categories
                        </option>
                        {props.categories.map((category) => {
                            return <option key={category.slug} value={category.slug}>
                                {category.name}
                            </option>
                        })}
                    </select>

                    <select value={props.sortBy} onChange={handleSortByDropChnage} className='select-primary'>
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
    )
}

export default NavBar