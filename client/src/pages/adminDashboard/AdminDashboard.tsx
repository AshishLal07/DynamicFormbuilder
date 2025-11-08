"use client"

import { useState, useEffect } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import FormBuilder from "../../components/FormBuilder"
import Submissions from "../../components/Submissions"
import formAPi from "../../api/api"

interface Form {
  _id: string
  title: string
  description: string
}

export default function AdminDashboard() {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchForms()
  }, [])

  const fetchForms = async () => {
    try {
      const response = await formAPi.get(`/api/forms`)
      if(response.status === 200){
          setForms(response.data)
      }
    } catch (error) {
      console.error("Failed to fetch forms")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return
    try {
      await formAPi.delete(`/api/forms/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setForms(forms.filter((f) => f._id !== id))
    } catch (error) {
      alert("Failed to delete form")
    }
  }

  
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
              <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Form Builder Admin</h1>
                <div className="space-x-4">
                  <button
                    onClick={() => navigate("/admin/new")}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  >
                    + New Form
                  </button>
                  <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                    Logout
                  </button>
                </div>
              </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6">
              {loading ? (
                <p className="text-center text-gray-500">Loading forms...</p>
              ) : forms.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No forms yet. Create your first form!</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {Array.isArray(forms) && forms.map((form) => (
                    <div key={form._id} className="bg-white rounded-lg shadow p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">{form.title}</h2>
                          <p className="text-gray-600 mt-1">{form.description}</p>
                        </div>
                        <div className="space-x-2">
                              <button
                            onClick={() => navigate(`/forms/${form._id}`)}
                            className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                          >
                            Preview Form
                          </button>
                          <button
                            onClick={() => navigate(`/admin/edit/${form._id}`)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => navigate(`/admin/submissions/${form._id}`)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            Submissions
                          </button>
                          <button
                            onClick={() => handleDelete(form._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>
        }
      />
      <Route path="/new" element={<FormBuilder onSave={fetchForms} />} />
      <Route path="/edit/:id" element={<FormBuilder onSave={fetchForms} />} />
      <Route path="/submissions/:formId" element={<Submissions />} />
    </Routes>
  )
}
