import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit, Trash2, Search } from 'lucide-react'
import { useCategoryList,useDeleteCategory } from '../../hooks/useCategory'
import { formatDate } from '../util/utilPages'


const CategoryList =  () => {

  const [searchTerm, setSearchTerm] = useState('')
  const { data: categories, isLoading } = useCategoryList()

  const deleteNews = useDeleteCategory();

  const handleDelete = (categoryId) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteNews.mutate(categoryId);
    }
  };


  let amountCategory = categories?.category
  let filteredNews = []
   console.log(amountCategory)

  if(Array.isArray(amountCategory)) {
      filteredNews = amountCategory.filter(item => {

      const NameMatch = item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      const descriptionMatch = item?.description?.toLowerCase().includes(searchTerm.toLowerCase())
      
      return NameMatch || descriptionMatch
    })
  } else {
    filteredNews = []
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
        <Link
          to="/category/add-category"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create Category
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* News Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created Date
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Created
              </th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredNews.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(item.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Link
                    to={`/category/edit/${item.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit className="h-4 w-4 inline" />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredNews.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No news Category found.
          </div>
        )}
      </div>
    </div>
  )

}

export default CategoryList