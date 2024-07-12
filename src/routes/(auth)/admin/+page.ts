import { requireAdmin } from '$lib/auth.service';
import { error } from '@sveltejs/kit';

export async function load() {
    console.log('Admin page load function started');
    try {
        console.log('Calling requireAdmin()');
        await requireAdmin();
        console.log('Admin access granted');
        return {};
    } catch (e) {
        console.error('Admin access denied:', e);
        throw error(403, 'Not authorized');
    }
}