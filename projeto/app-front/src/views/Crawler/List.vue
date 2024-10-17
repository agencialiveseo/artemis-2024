<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      item-value="id"
      @click:row="goToDetails"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Crawler List</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <new-crawler></new-crawler>
        </v-toolbar>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { list } from "@/services/crawlerService";

import NewCrawler from "@/views/Crawler/NewCrawler.vue";

// Router instance
const router = useRouter();

// Reactive variables
const headers = ref([
  { text: "URL", value: "url" },
  { text: "Status", value: "status" },
  { text: "Date", value: "date" },
]);

const items = ref([]);

// Fetch data on mount
const fetchData = async () => {
  try {
    const result = await list();
    // Verifica se o resultado é um array, se não, define como um array vazio
    items.value = Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching data:", error);
    items.value = []; // Garante que items seja sempre um array mesmo em caso de erro
  }
};

// Navigate to details
const goToDetails = (event, item) => {
  router.push(`/${item.item.id}`);
};

// Fetch data when component is mounted
onMounted(() => {
  console.log("Fetching data...");
  fetchData();
});
</script>

<style scoped>
.v-data-table {
  cursor: pointer;
}
</style>
