import type { AxiosRequestConfig } from 'axios'
import type Book from '../../model/Book'
import type PaginationResponse from '../../model/PaginationResponse'
import ApiService from '../ApiService'

type Entity = Book

class BooksService {
    private static instance: BooksService
    private api = ApiService.getInstance('/books')

    private constructor() { }

    public static getInstance(): BooksService {
        if (!this.instance) {
            this.instance = new BooksService()
        }
        return this.instance
    }

    public async findAll(config?: AxiosRequestConfig): Promise<PaginationResponse<Entity>> {
        return this.api.findAll<Entity>({ config })
    }

    public async findById(id: number): Promise<Entity> {
        return this.api.findById<Entity>({ id })
    }

    public async create(payload: Entity): Promise<Entity> {
        return this.api.create<Entity>({ payload })
    }

    public async update(id: number, payload: Partial<Entity>): Promise<Entity> {
        return this.api.update<Entity>({ id, payload })
    }

    public async delete(id: number): Promise<void> {
        return this.api.delete({ id })
    }
}

const booksService = BooksService.getInstance()
export default booksService;