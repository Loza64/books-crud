import type Gender from "./Gender"

export default interface Book {
    id?: number
    name: string
    author: string
    gender?: Gender | number | null
}