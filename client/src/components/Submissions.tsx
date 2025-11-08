"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import formAPi from "../api/api"

interface Submission {
  _id: string
  formId: string
  data: Record<string, any>
  createdAt: string
}

interface PaginationData {
  page: number
  limit: number
  total: number
  pages: number
}

export default function Submissions() {
  const { formId } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubmissions()
  }, [page, limit])

  const fetchSubmissions = async () => {
    try {
      const response = await formAPi.get(
        `/api/submissions/form/${formId}?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setSubmissions(response.data.submissions)
      setPagination(response.data.pagination)
    } catch (error) {
      alert("Failed to fetch submissions")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this submission?")) return
    try {
      await formAPi.delete(`/api/submissions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchSubmissions()
    } catch (error) {
      alert("Failed to delete submission")
    }
  }

  return (
    <div className="h-[95vh] bg-gray-50 p-6 ">
      <div className="h-full flex flex-col max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Form Submissions</h1>
          <button
            onClick={() => navigate("/admin")}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back to Admin
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading submissions...</p>
        ) : submissions.length === 0 ? (
          <p className="text-center text-gray-500">No submissions yet</p>
        ) : (
          <>
            <div className=" flex-1 bg-white rounded-lg shadow overflow-scroll">
              <table className="w-full ">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-700">Submitted At</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-700">Data</th>
                    <th className="px-6 py-3 text-center font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody >
                  {submissions.map((submission) => (
                    <tr key={submission._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm">{new Date(submission.createdAt).toLocaleString()}</td>
                      <td className="px-6 py-3 text-sm">
                        <details className="cursor-pointer">
                          <summary className="text-indigo-600 hover:underline">View Data</summary>
                          <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-auto max-h-48">
                            {JSON.stringify(submission.data, null, 2)}
                          </pre>
                        </details>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <button
                          onClick={() => handleDelete(submission._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination && (
              <div className="mt-6 flex justify-between items-center">
                <div>
                  <label className="mr-2">Items per page:</label>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value))
                      setPage(1)
                    }}
                    className="px-3 py-2 border rounded"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                <div className="space-x-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-3 py-2 border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-2">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                    disabled={page === pagination.pages}
                    className="px-3 py-2 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
