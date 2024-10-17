<template>
  <v-container>
    <v-card v-if="crawlerData">
      <v-card-title>{{ crawlerData.url }}</v-card-title>
      <v-card-subtitle>{{ formattedTimestamp }}</v-card-subtitle>
      <v-card-text>
        Title: {{ crawlerData.data }}<br />
        <v-badge color="primary" :content="crawlerData.status"></v-badge>
      </v-card-text>
    </v-card>
    <v-alert v-else type="info">Loading...</v-alert>
  </v-container>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { getData } from '@/services/crawlerService';
  import { useRoute } from 'vue-router';

  // Definir route para acessar parâmetros de rota
  const route = useRoute();

  // Definir a variável reativa para armazenar os dados do crawler
  const crawlerData = ref(null);

  // Computed para formatar o timestamp
  const formattedTimestamp = computed(() => 
    crawlerData.value ? new Date(crawlerData.value.createdAt).toLocaleString() : ''
  );

  // Fetch de dados na montagem do componente
  onMounted(async () => {
    try {
      crawlerData.value = await getData(route.params.id);
    } catch (error) {
      console.error('Error fetching crawler data:', error);
    }
  });
</script>
