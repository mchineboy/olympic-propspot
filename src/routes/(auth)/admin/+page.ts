import { requireAdmin } from '$lib/auth.service';
import { error } from '@sveltejs/kit';
import { type Load } from '@sveltejs/kit';

export const load: Load = () => {
    console.log('Admin page load function started');
    
    return new Promise<{ message: string }>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(error(504, 'Request timeout'));
        }, 10000); // 10 second timeout

        requireAdmin()
            .then(() => {
                clearTimeout(timeoutId);
                console.log('Admin access granted');
                resolve({ message: 'Admin page loaded successfully' });
            })
            .catch((e) => {
                clearTimeout(timeoutId);
                console.error('Admin access denied:', e);
                reject(error(403, 'Not authorized'));
            });
    });
};