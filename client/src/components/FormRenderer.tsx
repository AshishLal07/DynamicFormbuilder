"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import formAPi from "../api/api"

interface FieldDef {
  _id?: string
  name: string
  label: string
  type: string
  required: boolean
  options?: string[]
  validation?: { min?: number; max?: number; regex?: string }
}

interface FormDef {
  _id: string
  title: string
  description: string
  fields: FieldDef[]
}

export default function FormRenderer() {
  const { id } = useParams()
  const [form, setForm] = useState<FormDef | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchForm()
  }, [id])

  const fetchForm = async () => {
    try {
      const response = await formAPi.get(`/api/forms/${id}`)
      setForm(response.data)
    } catch (error) {
      alert("Form not found")
    } finally {
      setLoading(false)
    }
  }
  console.log(form);
  
  if (loading) return <p className="text-center p-4">Loading...</p>
  if (!form) return <p className="text-center p-4 text-red-600">Form not found</p>
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <h1 className="text-3xl font-bold text-green-600 mb-4">Success!</h1>
          <p className="text-gray-600 mb-6">Your submission has been saved.</p>
          <button
            onClick={() => {
              setSubmitted(false)
              fetchForm()
            }}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    )
  }

  // Build Yup schema dynamically
  const schema: any = {}
  form.fields.forEach((field) => {
    let fieldSchema: any = Yup.string()

    if (field.required) {
      fieldSchema = fieldSchema.required(`${field.label} is required`)
    }

    if (field.type === "email") {
      fieldSchema = fieldSchema.email("Invalid email")
    }

    if (field.type === "number") {
      fieldSchema = Yup.number()
      if (field.required) {
        fieldSchema = fieldSchema.required(`${field.label} is required`)
      }
      if (field.validation?.min !== undefined) {
        fieldSchema = fieldSchema.min(field.validation.min)
      }
      if (field.validation?.max !== undefined) {
        fieldSchema = fieldSchema.max(field.validation.max)
      }
    }

    schema[field.name] = fieldSchema
  })

  const validationSchema = Yup.object().shape(schema)

  const initialValues: Record<string, any> = {}
  form.fields.forEach((field) => {
    initialValues[field.name] = field.type === "checkbox" ? false : ""
  })

  const handleSubmit = async (values: Record<string, any>, { setSubmitting }: any) => {
    try {
      console.log(values);
      
      await formAPi.post(`/api/submissions`, {
        formId: form._id,
        data: values,
      })
      setSubmitted(true)
    } catch (error: any) {
      alert("Submission failed: " + (error.response?.data?.error || "Unknown error"))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className=" relative max-w-2xl mx-auto">
        <div className="absolute top-10 right-3">
          <button
            onClick={() => navigate("/admin")}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back to Admin
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{form.title}</h1>
          <p className="text-gray-600 mb-8">{form.description}</p>
             
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <FormikForm className="space-y-6">
                {form.fields.map((field) => (
                  <div key={field.name}>
                    <label htmlFor={field.name} className="block font-medium text-gray-700 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-600 ml-1">*</span>}
                    </label>

                    {field.type === "text" && (
                      <Field
                        as="input"
                        type="text"
                        name={field.name}
                        id={field.name}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    )}

                    {field.type === "textarea" && (
                      <Field
                        as="textarea"
                        name={field.name}
                        id={field.name}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    )}

                    {field.type === "number" && (
                      <Field
                        as="input"
                        type="number"
                        name={field.name}
                        id={field.name}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    )}

                    {field.type === "email" && (
                      <Field
                        as="input"
                        type="email"
                        name={field.name}
                        id={field.name}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    )}

                    {field.type === "date" && (
                      <Field
                        as="input"
                        type="date"
                        name={field.name}
                        id={field.name}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    )}

                    {field.type === "checkbox" && field.options && (
                      field.options.map((option) => {
                          console.log(option);
                          
                          return  <label key={option} className="flex items-center">
                            <Field
                              as="input"
                              type="radio"
                              name={field.name}
                              value={option}
                              className="w-4 h-4 text-indigo-600"
                            />
                            <span className="ml-2">{option}</span>
                          </label>
                        }
                         
                      )
                      // <Field
                      //   as="input"
                      //   type="checkbox"
                      //   name={field.name}
                      //   id={field.name}
                      //   className="w-4 h-4 text-indigo-600 rounded"
                      // />
                    )}

                    {field.type === "radio" && field.options && (
                      <div className="space-y-2">
                        {field.options.map((option) => {
                          console.log(option);
                          
                          return  <label key={option} className="flex items-center">
                            <Field
                              as="input"
                              type="radio"
                              name={field.name}
                              value={option}
                              className="w-4 h-4 text-indigo-600"
                            />
                            <span className="ml-2">{option}</span>
                          </label>
                        }
                         
                      )}
                      </div>
                    )}

                    {field.type === "select" && field.options && (
                      <Field
                        as="select"
                        name={field.name}
                        id={field.name}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select an option</option>
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Field>
                    )}

                    {field.type === "file" && (
                      <Field
                        as="input"
                        type="file"
                        name={field.name}
                        id={field.name}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    )}

                    <ErrorMessage name={field.name}>
                      {(msg) => <p className="text-red-600 text-sm mt-1">{msg}</p>}
                    </ErrorMessage>
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </FormikForm>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}
