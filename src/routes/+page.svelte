<script lang="ts">
    import { goto } from '$app/navigation';
    import '../app.css';
</script>
	<div
		class="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-purple-800"
	>
		<div class="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-2xl">
			<div class="mb-8">
				<div
					class="flex items-center justify-center w-32 h-32 p-2 mx-auto text-purple-600 bg-purple-800 rounded-full"
				>
                <img class="w-auto h-fit" src="/images/olympic-propspot-high-resolution-logo-white-transparent.svg" alt="Logo">
				</div>
			</div>

			<h1 class="mb-4 text-4xl font-bold text-purple-800">Olympic PropSpot</h1>
			<p class="mb-8 text-xl text-purple-600">Theatri Thesauros Tenemus</p>

			<div class="space-y-4">
				<button
					class="w-full px-6 py-3 text-lg font-semibold text-white transition-colors duration-300 bg-yellow-500 rounded-lg shadow-md hover:bg-yellow-600"
					on:click={() => goto('/login')}
				>
					Log In
				</button>
			</div>

			<p class="mt-8 text-sm text-purple-500">Discover the magic behind the scenes</p>
		</div>
	</div>
