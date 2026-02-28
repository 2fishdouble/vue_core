import {defineStore} from "pinia";
import {ref} from "vue";
// storeToRefs is used to convert the store to refs
export const usePermission =
    defineStore('permission', () => {
        const permissions = ref<string[]>([])

        function setPermissions(newPermissions: string[]) {
            permissions.value = newPermissions
        }

        function hasPermission(permission: string) {
            return permissions.value.includes(permission)
        }

        function hasAnyPermission(permissions: string[]) {
            return permissions.some(permission => hasPermission(permission))
        }

        function hasAllPermissions(permissions: string[]) {
            return permissions.every(permission => hasPermission(permission))
        }

        return {
            permissions,
            setPermissions,
            hasPermission,
            hasAnyPermission,
            hasAllPermissions
        }
    })
