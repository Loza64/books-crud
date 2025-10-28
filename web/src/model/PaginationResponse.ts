export default interface PaginationResponse<T> {
    content: T[]
    pageNumber: number
    pageSize: number
    totalPages: number
}