export interface IField {
  _id?: string
  name: string
  label: string
  type: "text" | "textarea" | "number" | "email" | "date" | "checkbox" | "radio" | "select" | "file"
  required: boolean
  order: number
  options?: string[]
  validation?: {
    min?: number
    max?: number
    regex?: string
  }
  dependsOn?: string // field name it depends on
  dependsOnValue?: string // value that triggers this field
}

export interface IForm {
  _id?: string
  title: string
  description: string
  fields: IField[]
  createdAt?: Date
  updatedAt?: Date
}

export interface ISubmission {
  _id?: string
  formId: string
  data: Record<string, any>
  submittedAt?: Date
  ipAddress?: string
}

export interface JwtPayload {
  _id: string,
}
