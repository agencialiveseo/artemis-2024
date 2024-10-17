<template>
  <v-container class="d-flex justify-center">
    <v-card class="pa-4" max-width="500" min-width="400">
      <v-card-title>Login</v-card-title>
      <v-card-text>
        <v-form v-model="isValid" ref="form">
          <v-text-field
            v-model="email"
            label="Email"
            :rules="[rules.required, rules.email]"
            prepend-icon="mdi-email"
            type="email"
            required
          />
          <v-text-field
            v-model="password"
            label="Password"
            :rules="[rules.required, rules.password_size]"
            prepend-icon="mdi-lock"
            type="password"
            required
          />
          <v-alert v-if="loginError" type="error" dismissible>
            {{ loginError }}
          </v-alert>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="!isValid" color="primary" @click="login">Login</v-btn>
        <span
          >Don't have an account?
          <router-link to="/register">Register</router-link></span
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { loginUser } from "@/services/authService";
import { setSessionToken } from "@/services/sessionService";

const router = useRouter();

// Form fields
const email = ref("");
const password = ref("");

// Form validation
const isValid = ref(false);
const loginError = ref(null);

const rules = {
  required: (value) => !!value || "Campo obrigatório.",
  email: (value) => /.+@.+\..+/.test(value) || "E-mail inválido.",
  password_size: (value) =>
    value.length >= 6 || "Senha deve ter no mínimo 6 caracteres.",
};

// Function to handle login
const login = async () => {
  loginError.value = null;
  const credentials = { email: email.value, password: password.value };

  try {
    const { token } = await loginUser(credentials);
    // Set session token
    setSessionToken(token);
    // Redirect to home
    router.push({ name: "crawler-list" });
  } catch (error) {
    loginError.value = "Falha ao realizar login. Verifique suas credenciais.";
  }
};

const register = async () => {
  router.push({ name: "register" });
};
</script>

<style scoped>
.v-container {
  height: 100vh;
  align-items: center;
}
</style>
