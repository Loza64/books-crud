import type { AxiosRequestConfig } from 'axios'
import type PaginationResponse from '../../model/PaginationResponse'
import ApiService from '../ApiService'
import type Gender from '../../model/Gender'

type Entity = Gender

class GenderService {
    private static instance: GenderService
    private api = ApiService.getInstance('/genders')

    private constructor() { }

    public static getInstance(): GenderService {
        if (!this.instance) {
            this.instance = new GenderService()
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



const genderService = GenderService.getInstance()
export default genderService;