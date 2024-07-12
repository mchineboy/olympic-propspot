<script lang="ts">
	import { loginWithEmailAndPassword, loginWithGoogle } from '$lib/auth.service';
	import { goto } from '$app/navigation';

	let email: string = '';
	let password: string = '';
	let loading: boolean = false;
	let error: string = '';
	let rememberMe: boolean = false;

	function validateEmail(email: string): boolean {
		const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return re.test(email);
	}

	async function handleEmailLogin(): Promise<void> {
		if (!validateEmail(email)) {
			error = 'Please enter a valid email address';
			return;
		}
		loading = true;
		error = '';
		try {
			await loginWithEmailAndPassword(email, password);
			if (rememberMe) {
				// Implement remember me functionality
			}
			goto('/dashboard');
		} catch (e: unknown) {
			if (e instanceof Error) {
				error = e.message;
			} else {
				error = 'An unknown error occurred';
			}
		} finally {
			loading = false;
		}
	}

	async function handleGoogleLogin(): Promise<void> {
		loading = true;
		error = '';
		try {
			await loginWithGoogle();
			goto('/dashboard');
		} catch (e: unknown) {
			console.trace(e);
			if (e instanceof Error) {
				error = e.message;
			} else {
				error = 'An unknown error occurred';
			}
		} finally {
			loading = false;
		}
	}
</script>

<div
	class="flex items-center justify-center min-h-screen px-4 bg-gradient-to-b from-purple-900 to-black"
>
	<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			<h1 class="text-5xl font-extrabold text-yellow-400 drop-shadow-lg">Welcome to the Show</h1>
			<p class="mt-2 text-xl text-yellow-200">Please take your seat</p>
		</div>
		<div class="p-8 bg-black bg-opacity-50 border-2 border-yellow-500 rounded-lg shadow-2xl">
			{#if error}
				<div class="p-2 mb-4 text-center text-white bg-red-800 rounded">
					{error}
				</div>
			{/if}
			<form on:submit|preventDefault={handleEmailLogin} class="space-y-6">
				<div>
					<label for="email" class="sr-only">Email</label>
					<input
						id="email"
						bind:value={email}
						type="email"
						required
						aria-label="Email address"
						class="w-full px-3 py-2 text-yellow-200 placeholder-yellow-600 bg-black bg-opacity-50 border border-yellow-500 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
						placeholder="Email"
					/>
				</div>
				<div>
					<label for="password" class="sr-only">Password</label>
					<input
						id="password"
						bind:value={password}
						type="password"
						required
						aria-label="Password"
						class="w-full px-3 py-2 text-yellow-200 placeholder-yellow-600 bg-black bg-opacity-50 border border-yellow-500 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
						placeholder="Password"
					/>
				</div>
				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<input
							id="remember-me"
							name="remember-me"
							type="checkbox"
							bind:checked={rememberMe}
							class="w-4 h-4 text-yellow-400 border-yellow-500 rounded focus:ring-yellow-500"
						/>
						<label for="remember-me" class="block ml-2 text-sm text-yellow-400">
							Remember me
						</label>
					</div>
					<div class="text-sm">
						<a href="/forgot-password" class="font-medium text-yellow-400 hover:text-yellow-300">
							Forgot your password?
						</a>
					</div>
				</div>
				<button
					type="submit"
					class="w-full px-4 py-2 text-sm font-medium text-black transition duration-150 ease-in-out bg-yellow-400 border border-transparent rounded-md shadow-sm hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
					disabled={loading}
				>
					{#if loading}
						<span class="inline-block mr-2 animate-spin">🎭</span>
						Loading...
					{:else}
						Take the Stage
					{/if}
				</button>
			</form>
			<div class="mt-6">
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<div class="w-full border-t border-yellow-600"></div>
					</div>
					<div class="relative flex justify-center text-sm">
						<span class="px-2 text-yellow-400 bg-black">Or continue with</span>
					</div>
				</div>
				<div class="mt-6">
					<button
						on:click={handleGoogleLogin}
						class="w-full px-4 py-2 text-sm font-medium text-yellow-400 transition duration-150 ease-in-out bg-transparent border border-yellow-500 rounded-md shadow-sm hover:bg-yellow-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
						disabled={loading}
					>
						<span class="flex items-center justify-center">
							<svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
								<path
									fill="#FCD34D"
									d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
								/>
							</svg>
							Sign in with Google
						</span>
					</button>
				</div>
			</div>
			<div class="mt-4 text-center">
				<p class="text-yellow-400">
					Don't have an account?
					<a href="/registration" class="font-medium text-yellow-300 underline hover:text-yellow-200">
						Register here
					</a>
				</p>
			</div>
		</div>
	</div>
</div>