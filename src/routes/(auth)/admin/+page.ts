import { requireAdmin } from '$lib/auth.service';
import { error } from '@sveltejs/kit';
import type { Load } from '@sveltejs/kit';

export const load: Load = async () => {
    try {
        await requireAdmin();
        // No additional data is loaded, we're just checking for admin access
        return {};
    } catch (e) {
        throw error(403, `Not authorized: ` + (e as Error).message);
    }
};