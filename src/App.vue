<template>
  <div class="b-container h-100">
    <router-view />
  </div>
</template>

<script>
  export default {
    created: function () {
      this.$http.interceptors.response.use(undefined, function (err) {
        return new Promise(function () {
          if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
            this.$store.dispatch('logout');
          }
          throw err;
        });
      });
    }
  };
</script>