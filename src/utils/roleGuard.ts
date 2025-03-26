import { PermissionsType } from "../enums/role.enum";
import { UnauthorizedException } from "./appError";
import { RolePermission } from "./role-permission";

export const roleGuard = (
    role: keyof typeof RolePermission,
    requiredPermissions: PermissionsType[]
) => {
    const permissions = RolePermission[role];
    // if the role doenst exist or not reqiured permission throw an error

    const hasPermission = requiredPermissions.every((permission) => permissions.includes(permission));

    if (!hasPermission) {
        throw new UnauthorizedException("You do not have the permissions to perform this action");
    }
};