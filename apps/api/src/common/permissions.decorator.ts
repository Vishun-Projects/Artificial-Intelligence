import { SetMetadata } from '@nestjs/common'

export type RequiredPermission = { resource: string; action: string }
export const PERMISSIONS_KEY = 'required_permissions'
export const Permissions = (...perms: RequiredPermission[]) => SetMetadata(PERMISSIONS_KEY, perms)