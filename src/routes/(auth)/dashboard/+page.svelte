<script lang="ts">
    import { props } from '$lib/propsStore';
    import type { Prop } from '$lib/propsStore';
    import PropList from './PropList.svelte';
    import PropForm from './PropForm.svelte';
    import { onMount } from 'svelte';
    import { session } from '$lib/session';
    import { prefs } from '$lib/prefsStore';
    import { get } from 'svelte/store';

    let selectedType = 'All';
    let unsubscribe: (() => void) | undefined;

    onMount(() => {
        const initPrefs = async () => {
            const sessionData = get(session);
            if (sessionData.loggedIn && sessionData.user) {
                const userPrefs = await prefs.getUserPrefs(sessionData.user.uid);
                if (userPrefs) {
                    selectedType = userPrefs.defaultPropType || 'All';
                }

                // Initialize the store
                unsubscribe = prefs.init(sessionData.user.uid);
            }
        };

        initPrefs();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    });

    // You can also subscribe to the store for real-time updates
    $: if ($prefs) {
        selectedType = $prefs.defaultPropType || 'All';
    }

    let allProps: Prop[] = [];
    let sortOption = 'lastUsed-desc';
    let isAddDialogOpen = false;
    let editingProp: Prop | null = null;

    let freeformFilter = '';

    const availableTypes = [
        'All',
        'Clothing',
        'Furniture',
        'Accessories',
        'Electronics',
        'Wigs',
        'Other'
    ];

    $: {
        allProps = $props;
        console.log('Updated allProps:', allProps);
    }

    $: sortedProps = sortProps(allProps, sortOption);

    $: filteredProps = sortedProps.filter((prop) => {
        const typeMatch = selectedType === 'All' || prop.category === selectedType;
        const freeformMatch =
            freeformFilter === '' ||
            Object.entries(prop).some(([key, value]) => {
                if (key === 'tags' && Array.isArray(value)) {
                    return value.some((tag) => tag.toLowerCase().includes(freeformFilter.toLowerCase()));
                }
                return (
                    typeof value === 'string' && value.toLowerCase().includes(freeformFilter.toLowerCase())
                );
            });
        return typeMatch && freeformMatch;
    });

    onMount(() => {
        console.log('Component mounted');
    });

    function sortProps(props: Prop[], option: string): Prop[] {
        return [...props].sort((a, b) => {
            switch (option) {
                case 'lastUsed-desc':
                    return (b.lastUsed?.toMillis() ?? 0) - (a.lastUsed?.toMillis() ?? 0);
                case 'lastUsed-asc':
                    return (a.lastUsed?.toMillis() ?? 0) - (b.lastUsed?.toMillis() ?? 0);
                case 'name-asc':
                    return (a.name ?? '').localeCompare(b.name ?? '');
                case 'name-desc':
                    return (b.name ?? '').localeCompare(a.name ?? '');
                default:
                    return 0;
            }
        });
    }

    function openAddDialog() {
        editingProp = null;
        isAddDialogOpen = true;
    }

    function openEditDialog(event: CustomEvent<Prop>) {
        editingProp = event.detail;
        isAddDialogOpen = true;
    }

    function closeDialog() {
        isAddDialogOpen = false;
        editingProp = null;
    }

    $: userPermissions = $session.user;
</script>

<main class="container px-4 py-8 mx-auto">
    <h1 class="mb-8 text-4xl font-bold text-purple-800">Props Dashboard</h1>

    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
        <select
            bind:value={sortOption}
            class="bg-purple-100 border border-purple-300 text-purple-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 p-2.5"
        >
            <option value="lastUsed-desc">Date Entered (Newest First)</option>
            <option value="lastUsed-asc">Date Entered (Oldest First)</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
        </select>

        <select
            bind:value={selectedType}
            class="bg-purple-100 border border-purple-300 text-purple-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 p-2.5"
        >
            {#each availableTypes as type}
                <option value={type}>{type}</option>
            {/each}
        </select>

        <input
            type="text"
            bind:value={freeformFilter}
            placeholder="Search props (name, type, tags, etc.)..."
            class="bg-purple-100 border border-purple-300 text-purple-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 p-2.5"
        />

        {#if userPermissions?.canCreate}
            <button
                on:click={openAddDialog}
                class="px-4 py-2 font-bold text-white bg-purple-600 rounded hover:bg-purple-700"
            >
                Add New Prop
            </button>
        {/if}
    </div>

    <PropList
        props={filteredProps}
        on:edit={openEditDialog}
        canUpdate={userPermissions?.canUpdate}
        canDelete={userPermissions?.canDelete}
    />

    {#if isAddDialogOpen && (userPermissions?.canCreate || (editingProp && userPermissions?.canUpdate))}
        <div
            class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-600 bg-opacity-50"
        >
            <div
                class="relative w-full max-w-2xl p-4 mx-4 my-8 bg-white rounded-lg shadow-xl sm:p-6 md:p-8"
            >
                <button
                    on:click={closeDialog}
                    class="absolute text-gray-500 top-2 right-2 hover:text-gray-700"
                    aria-label="Close dialog"
                >
                    <svg
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        ></path>
                    </svg>
                </button>
                <div class="max-h-[80vh] overflow-y-auto pb-4">
                    <PropForm
                        prop={editingProp}
                        on:save={closeDialog}
                        on:cancel={closeDialog}
                        canCreate={userPermissions?.canCreate}
                        canUpdate={userPermissions?.canUpdate}
                    />
                </div>
            </div>
        </div>
    {/if}
</main>