<template>
  <div id="app">
    <a-layout class="layout">
      <a-layout-header class="header">
        <router-link to="/">
          <div class="logo">bbs</div>
        </router-link>
        <a-button v-if="loggedIn" @click="logout">log out</a-button>
      </a-layout-header>

      <a-layout-content class="content">
        <div class="center">
          <keep-alive>
            <router-view v-if="$route.name === 'index'"/>
          </keep-alive>
          <router-view v-if="$route.name !== 'index'"/>
          <!-- <router-view/> -->
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<style lang="scss">
#app .layout {
  min-height: 100vh;

  .header {
    position: fixed;
    z-index: 100;
    display: flex;
    height: 54px;
    width: 100%;
    padding: 0 24px;
    line-height: 1;
    align-items: center;
    justify-content: space-between;
    & * {
      font-weight: bold;
      text-transform: uppercase;
    }
    .logo {
      color: #fff;
      font-size: 28px;
      &:hover {
        color: #eee;
      }
    }
  }

  .content {
    display: flex;
    margin-top: 54px;
    flex: none;
    justify-content: center;
    .center {
      max-width: 800px;
      flex: 0 1 800px;
      margin: 24px;
      padding: 24px;
      background: #fff;
    }
  }
}
</style>
