import type Book from '../../model/Book'
import ApiService from '../ApiService'

type Entity = Book

export default class GenderService {
    private static instance: GenderService
    private api = ApiService.getInstance('/genders')

    private constructor() { }

    public static getInstance(): GenderService {
        if (!this.instance) {
            this.instance = new GenderService()
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
