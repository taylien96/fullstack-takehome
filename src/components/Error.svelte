<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    export let showError: boolean = false;
    export let errorMessage: string = 'default';
    const dispatch = createEventDispatcher();
  
 

    const acknowledge = () => {
      showError = false;
      dispatch('acknowledge');
    }
  </script>
  

  
  {#if showError}
    <div class="popup-container" on:click={acknowledge} on:keydown={acknowledge} >
      <div class="popup-box" on:click={event => event.stopPropagation()} on:keydown={event => event.stopPropagation()}>
        <h3>Error</h3>
        <p>{errorMessage}</p>
        <button on:click={acknowledge} on:keydown={acknowledge}>Acknowledge</button>
      </div>
    </div>
  {/if}

  <style>
    .popup-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9;
      background-color: rgba(0, 0, 0, 0.5);
    }
  
    .popup-box {
      background-color: white;
      padding: 1rem;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      z-index: 10;
    }
  </style>