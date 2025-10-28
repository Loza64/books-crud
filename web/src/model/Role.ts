import type Permissions from "./Permissions"

export default interface Role {
    id?: number
    name: string
    permissions?: Permissions[] | number[]
}