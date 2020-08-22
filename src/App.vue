<template>
  <div id="app">
    <a-layout>
      <a-layout-header class="header">
        <div class="logo">
          <router-link to="/">bbs</router-link>
        </div>
      </a-layout-header>
      <a-layout-content class="content">
        <div class="center">
          <router-view/>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" src="./App.vue.scss"/>
