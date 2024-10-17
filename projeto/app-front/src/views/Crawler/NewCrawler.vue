<template>
  <v-dialog max-width="480" @after-leave="clearValues">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn class="pr-4" color="primary" v-bind="activatorProps">
        New crawl
      </v-btn>
    </template>
    <template v-slot:default="{}">
      <v-card prepend-icon="mdi-spider" title="New Crawler">
        <v-card-text>
          <v-form v-model="isValid">
            <v-row dense>
              <v-col sm="12">
                <v-text-field
                  v-model="url"
                  label="URL"
                  :rules="[rules.required, rules.url]"
                  prepend-icon="mdi-link"
                  required
                ></v-text-field>
              </v-col>
              <v-col sm="12">
                <v-alert v-if="startError" type="error" dismissible>
                  {{ startError }}
                </v-alert>

                <v-alert v-if="startSuccess" type="success" dismissible>
                  Crawl started for {{ url }}
                </v-alert>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="ml-auto"
            text="Start crawl"
            :loading="isLoading"
            @click="requestCrawl"
            :disabled="!isValid || startSuccess"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
import { request } from "@/services/crawlerService";
import { useRouter } from "vue-router";

// Router instance
const router = useRouter();

const url = ref("");

const testUrl = (url) => {
  try {
    return (
      url.startsWith("http") && url.includes("://") && Boolean(new URL(url))
    );
  } catch (error) {
    return false;
  }
};

const rules = {
  required: (value) => !!value || "Campo obrigatório.",
  url: (value) =>
    testUrl(value) ||
    "URL inválido. Utilizar protocolo http ou https://exemplo.com",
};

const startError = ref(null);
const startSuccess = ref(false);
const isValid = ref(false);
const isLoading = ref(false);

// Request a new crawl (dummy request as example)
const requestCrawl = async () => {
  console.error(1);
  startError.value = null;
  if (url.value) {
    try {
      isLoading.value = true;
      // Example request (replace with actual service call)
      const response = await request(url.value);
      console.log("Crawl started for", url.value);
      startSuccess.value = true;
      goToDetails(response);
    } catch (error) {
      startError.value = "Error fetching data";
      console.error("Error starting crawl:", error);
    } finally {
      isLoading.value = false;
    }
  }
};

// Navigate to details
const goToDetails = (event) => {
  router.push(`/${event.id}`);
};

const clearValues = () => {
  url.value = "";
  startError.value = null;
  startSuccess.value = false;
  isValid.value = false;
};
</script>
