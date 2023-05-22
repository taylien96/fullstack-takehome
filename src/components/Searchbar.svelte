<script lang="ts">
    import { createEventDispatcher } from "svelte";
    let timer: NodeJS.Timeout;
    export let placeholder: string = 'Search...';
    export let value: string = '';
    const dispatch = createEventDispatcher<{search:{searchQuery:string}}>();

    function dispatchSearch(inputValue: string) {
      dispatch('search', {
        searchQuery : value
      })
      console.log('Search submitted:', inputValue);
    }
  
    function handleInput(event: InputEvent) {
      
      const inputValue = (event.target as HTMLInputElement).value;
      value = inputValue;
      if(value !== ''){
      clearTimeout(timer);
      timer = setTimeout(() => {
        dispatchSearch(inputValue);
      }, 200); }
    }
  </script>
  
  <style>

    .search-bar {
      display: flex;
      justify-content: center;
    }
  </style>
  
  <div class="search-bar">
    <input
      type="text"
      class="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder={placeholder}
      bind:value
      on:input={handleInput}
    />
  </div>
  