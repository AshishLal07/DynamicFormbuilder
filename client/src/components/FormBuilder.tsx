"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import formAPi from "../api/api"

interface Field {
  name: string
  label: string
  type: string
  required: boolean
  order: number
  options?: string[]
  validation?: { min?: number; max?: number; regex?: string }
}

interface FormData {
  title: string
  description: string
  fields: Field[]
}

interface FormBuilderProps {
  onSave: () => void
}

export default function FormBuilder({ onSave }: FormBuilderProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    fields: [],
  })
  const [currentField, setCurrentField] = useState<Partial<Field>>({})
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(!!id)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  useEffect(() => {
    if (id) {
      fetchForm()
    }
  }, [id])

  const fetchForm = async () => {
    try {
      const response = await formAPi.get(`/api/forms/${id}`)
      setFormData(response.data)
    } catch (error) {
      alert("Failed to load form")
    } finally {
      setLoading(false)
    }
  }

  const addField = () => {
    if (!currentField.name || !currentField.label || !currentField.type) {
      alert("Fill all field details")
      return
    }

    const newField: Field = {
      name: currentField.name as string,
      label: currentField.label as string,
      type: currentField.type as string,
      required: currentField.required || false,
      order: editingIndex !== null ? editingIndex : formData.fields.length,
      options: currentField.options,
      validation: currentField.validation,
    }

    if (editingIndex !== null) {
      const updated = [...formData.fields]
      updated[editingIndex] = newField
      setFormData({ ...formData, fields: updated })
      setEditingIndex(null)
    } else {
      setFormData({
        ...formData,
        fields: [...formData.fields, newField].sort((a, b) => a.order - b.order),
      })
    }

    setCurrentField({})
  }

  const removeField = (index: number) => {
    setFormData({
      ...formData,
      fields: formData.fields.filter((_, i) => i !== index),
    })
  }

  const editField = (index: number) => {
    setCurrentField(formData.fields[index])
    setEditingIndex(index)
  }

  const handleSave = async () => {
    if (!formData.title || !formData.description || formData.fields.length === 0) {
      alert("Fill form title, description, and add at least one field")
      return
    }

    try {
      if (id) {
        await formAPi.put(`/api/forms/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        await formAPi.post(`/api/forms`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }
      onSave()
      navigate("/admin")
    } catch (error) {
      alert("Failed to save form")
    }
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null)
      return
    }

    const newFields = [...formData.fields]
    const draggedField = newFields[draggedIndex]
    newFields.splice(draggedIndex, 1)
    newFields.splice(targetIndex, 0, draggedField)

    newFields.forEach((field, idx) => {
      field.order = idx
    })

    setFormData({ ...formData, fields: newFields })
    setDraggedIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }


  if (loading) return <p className="text-center p-4">Loading...</p>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold mb-6">{id ? "Edit Form" : "Create New Form"}</h1>

          <div className="mb-6 space-y-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">Form Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter form title"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter form description"
                rows={3}
              />
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Add Field</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Field Name</label>
                <input
                  type="text"
                  value={currentField.name || ""}
                  onChange={(e) => setCurrentField({ ...currentField, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="unique_field_name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Field Label</label>
                <input
                  type="text"
                  value={currentField.label || ""}
                  onChange={(e) => setCurrentField({ ...currentField, label: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="User-friendly label"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Field Type</label>
                <select
                  value={currentField.type || ""}
                  onChange={(e) => setCurrentField({ ...currentField, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Select type</option>
                  <option value="text">Text</option>
                  <option value="textarea">Textarea</option>
                  <option value="number">Number</option>
                  <option value="email">Email</option>
                  <option value="date">Date</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="radio">Radio</option>
                  <option value="select">Select</option>
                  <option value="file">File</option>
                </select>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium mt-6">
                  <input
                    type="checkbox"
                    checked={currentField.required || false}
                    onChange={(e) => setCurrentField({ ...currentField, required: e.target.checked })}
                    className="mr-2"
                  />
                  Required
                </label>
              </div>
            </div>

            {(currentField.type === "radio" || currentField.type === "select" || currentField.type === "checkbox") && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Options (comma-separated)</label>
                <input
                  type="text"
                  value={currentField.options?.join(", ") || ""}
                  onChange={(e) =>
                    setCurrentField({ ...currentField, options: e.target.value.split(",").map((o) => o.trim()) })
                  }
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Option 1, Option 2, Option 3"
                />
              </div>
            )}

            <button onClick={addField} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              {editingIndex !== null ? "Update Field" : "Add Field"}
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold mb-4">Fields ({formData.fields.length})</h2>
            <p className="text-sm text-gray-600 mb-3">Drag and drop fields to reorder them</p>
            {formData.fields.length === 0 ? (
              <p className="text-gray-500">No fields added yet</p>
            ) : (
              <div className="space-y-2">
                {formData.fields.map((field, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex justify-between items-center p-3 bg-gray-50 rounded border cursor-move transition-all ${draggedIndex === index
                        ? "opacity-50 border-indigo-600 bg-indigo-50"
                        : "border-gray-300 hover:border-indigo-400"
                      }`}
                  >
                    <div className="flex items-center flex-1">
                      <div className="text-gray-400 mr-3 text-lg">⋮⋮</div>
                      <div>
                        <p className="font-medium">{field.label}</p>
                        <p className="text-sm text-gray-600">
                          Type: {field.type} {field.required ? "(Required)" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => editField(index)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeField(index)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-medium"
            >
              {id ? "Update Form" : "Create Form"}
            </button>
            <button
              onClick={() => navigate("/admin")}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
