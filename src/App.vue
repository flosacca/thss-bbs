<template>
  <div id="app">
    <a-layout>
      <a-layout-header class="header">
        <div class="logo">bbs</div>
        <a-button class="login">log in</a-button>
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
