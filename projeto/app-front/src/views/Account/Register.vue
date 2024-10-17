<template>
  <v-container class="d-flex justify-center">
    <v-card class="pa-4" max-width="500" min-width="400">
      <v-card-title>Create Account</v-card-title>
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
          <v-text-field
            v-model="password_check"
            label="Repeat Password"
            :rules="[rules.required, rules.password_check]"
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
        <v-btn :disabled="!isValid" color="primary" @click="register">Register</v-btn>
        <span>Already have an account? <router-link to="/login">Login</router-link></span>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
  
<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { registerUser } from '@/services/authService'
  import { setSessionToken } from '@/services/sessionService'
  
  const router = useRouter()
  
  // Form fields
  const email = ref('')
  const password = ref('')
  const password_check = ref('')
  
  // Form validation
  const isValid = ref(false)
  const loginError = ref(null)
  
  const rules = {
    required: (value) => !!value || 'Campo obrigatório.',
    email: (value) => /.+@.+\..+/.test(value) || 'E-mail inválido.',
    password_check: (value) => value === password.value || 'Senhas não conferem.',
    password_size: (value) => value.length >= 6 || 'Senha deve ter no mínimo 6 caracteres.'
  }
  
  // Function to handle register
  const register = async () => {
    loginError.value = null
    const credentials = { email: email.value, password: password.value }
  
    try {
      const { token } = await registerUser(credentials)
      // Set session token
      setSessionToken(token)
      // Redirect to home
      router.push({ name: 'home' })
    } catch (error) {
      loginError.value = 'Falha ao realizar cadastro. Tente novamente mais tarde.'
    }
  }

</script>
  
<style scoped>
  .v-container {
    height: 100vh;
    align-items: center;
  }
</style>