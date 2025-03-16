import { Permissions, PermissionsType, RoleType } from "../enums/role.enum";

export const RolePermission: Record<RoleType, Array<PermissionsType>> = {
    OWNER:[
        Permissions.CREATE_WORKSPACE,
        Permissions.EDIT_WORKSPACE,
        Permissions.DELETE_WORKSPACE,
        Permissions.MANAGE_WORKSPACE_SETTING,

        Permissions.ADD_MEMBER,
        Permissions.CHANGE_MEMBER_ROLE,
        Permissions.REMOVE_MEMBER,

        Permissions.CREATE_PROJECT,
        Permissions.EDIT_PROJECT,
        Permissions.DELETE_PROJECT,

        Permissions.CREATE_TASK,
        Permissions.EDIT_TASK,
        Permissions.DELETE_TASK,

        Permissions.VIEW_ONLY,
    ],
    ADMIN:[
        Permissions.ADD_MEMBER,
        Permissions.CREATE_PROJECT,
        Permissions.EDIT_PROJECT,
        Permissions.DELETE_PROJECT,
        Permissions.EDIT_TASK,
        Permissions.CREATE_TASK,
        Permissions.DELETE_TASK,
        Permissions.MANAGE_WORKSPACE_SETTING,
        Permissions.VIEW_ONLY,
    ],
    MEMBER:[
        Permissions.VIEW_ONLY,
        Permissions.CREATE_TASK,
        Permissions.EDIT_TASK,
    ],
}