<script lang="ts">
  export let message = '';
  export let type: 'error' | 'warning' | 'info' = 'info'; 

  const typeClasses = {
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700'
  };
</script>

<div class={`border-l-4 p-4 mb-4 ${typeClasses[type]}`} role="alert">
  <p>{message}</p>
</div>