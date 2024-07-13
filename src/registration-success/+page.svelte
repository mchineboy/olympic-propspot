<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
  
    let countdown = 5;
  
    onMount(() => {
      const timer = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
          clearInterval(timer);
          goto('/dashboard');
        }
      }, 1000);
  
      return () => clearInterval(timer);
    });
  </script>
  
  <div class="flex items-center justify-center min-h-screen px-4 bg-gradient-to-b from-purple-900 to-black">
    <div class="w-full max-w-md space-y-8 text-center">
      <div class="animate-fadeIn">
        <h1 class="mb-2 text-5xl font-extrabold text-yellow-400">Bravo!</h1>
        <p class="mb-8 text-2xl text-yellow-200">Your account is ready for the spotlight!</p>
        
        <div class="p-8 bg-black bg-opacity-50 border-2 border-yellow-500 rounded-lg shadow-2xl">
          <svg class="w-24 h-24 mx-auto mb-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          
          <p class="mb-6 text-xl text-yellow-200">Get ready to manage your theatrical assets like never before!</p>
          
          <p class="text-lg text-yellow-300">Redirecting to your dashboard in {countdown} seconds...</p>
        </div>
        
        <div class="mt-8">
          <a href="/dashboard" class="text-yellow-400 underline hover:text-yellow-300">
            Take me to the dashboard now
          </a>
        </div>
      </div>
    </div>
  </div>
  
  <style>
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fadeIn {
      animation: fadeIn 0.5s ease-out;
    }
  </style>