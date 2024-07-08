<script lang="ts">
    import { goto } from '$app/navigation';
    import Nav from '../components/Nav.svelte';
    import '../app.css';

    let loading: boolean = false;
    let loggedIn: boolean = false;
    let user: any = null;
    let logout = () => {};
</script>
<Nav {loading} {loggedIn} {user} {logout} />

	<div
		class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800"
	>
		<div class="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md text-center">
			<div class="mb-8">
				<div
					class="w-32 h-32 p-2 mx-auto bg-purple-200 rounded-full flex items-center justify-center text-purple-600"
				>
                <img class="w-auto h-fit" src="/images/olympic-propspot-high-resolution-logo-white-transparent.svg" alt="Logo">
				</div>
			</div>

			<h1 class="text-4xl font-bold text-purple-800 mb-4">Olympic PropSpot</h1>
			<p class="text-xl text-purple-600 mb-8">Theatri Thesauros Tenemus</p>

			<div class="space-y-4">
				<button
					class="w-full bg-yellow-500 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-yellow-600 transition-colors duration-300 shadow-md"
					on:click={() => goto('/login')}
				>
					Log In
				</button>
			</div>

			<p class="mt-8 text-sm text-purple-500">Discover the magic behind the scenes</p>
		</div>
	</div>
