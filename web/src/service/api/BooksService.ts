import type Book from '../../model/Book'
import ApiService from '../ApiService'

type Entity = Book

export default class BooksService {
    private static instance: BooksService
    private api = ApiService.getInstance('/books')

    private constructor() { }

    public static getInstance(): BooksService {
        if (!this.instance) {
            this.instance = new BooksService()
        }
        return this.instance
    }

    public async findAll(): Promise<Entity[]> {
        return this.api.findAll<Entity>()
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
