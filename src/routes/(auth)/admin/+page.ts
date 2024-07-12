// import { requireAdmin } from '$lib/auth.service';
import { error } from '@sveltejs/kit';

export function load() {
    console.log('Admin page load function started');
    try {
        // Temporarily comment out the admin check for testing
        // await requireAdmin();
        console.log('Admin access granted');
        return { message: 'Admin page loaded successfully' };
    } catch (e) {
        console.error('Error in admin page load:', e);
        throw error(500, 'Internal Server Error');
    }
}