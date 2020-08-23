<template>
  <div id="app">
    <a-layout>
      <a-layout-header class="header">
        <router-link to="/">
          <div class="logo">bbs</div>
        </router-link>
        <a-button v-if="loggedIn" @click="logout">log out</a-button>
      </a-layout-header>
      <a-layout-content class="content">
        <div class="center">
          <router-view/>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<style lang="scss" src="./App.vue.scss"/>
