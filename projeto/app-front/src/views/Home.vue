<template>
  <v-app>
    <v-app-bar app dark>
      <v-toolbar-title>Crawler APP</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="logout" text>Logout</v-btn>
    </v-app-bar>

    <v-main class="pt-16">
      <router-view></router-view>

      <v-snackbar v-model="snackbar" :timeout="6000" location="bottom" variant="outlined">
        Seu rastreio terminou
        <template v-slot:action>
          <v-btn color="primary" text @click="goToCrawler">Ver detalhes</v-btn>
        </template>
      </v-snackbar>

    </v-main>

    <v-footer app dark>
      <span>&copy; {{ new Date().getFullYear() }} Crawler APP</span>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, onBeforeMount, onMounted } from "vue";
import { useRouter } from "vue-router";
import { isAuthenticated, removeSessionToken } from "@/services/sessionService";
import socketService from '@/services/socketService';

const { connect, onCrawlerUpdate } = socketService();
const snackbar = ref(false);
const currentCrawlerId = ref(null);
const goToCrawler = () => {
  router.push(`/crawler/${currentCrawlerId.value}`);
};

const router = useRouter();

// Reactive state for checking authentication status
const isUserAuthenticated = ref(false);

onBeforeMount(() => {
  isUserAuthenticated.value = isAuthenticated();
  if (!isUserAuthenticated.value) {
    navigateToLogin();
  }

 

});

onMounted(() => {
   // Conectar ao socket ao montar o componente
   connect(); 

  // Register to socket updates
  onCrawlerUpdate(({ id }) => {
    currentCrawlerId.value = id;
    snackbar.value = true;
  });
});
// Navigate to login page
const navigateToLogin = () => {
  router.push({ name: "login" });
};

// Logout function
const logout = () => {
  removeSessionToken();
  isUserAuthenticated.value = false;
  router.push({ name: "login" });
};
</script>

<style scoped>
.v-main {
  padding: 20px;
}
</style>
