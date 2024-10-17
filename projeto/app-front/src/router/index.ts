import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/Home.vue";
import LoginView from "../views/Account/Login.vue";
import CrawlerList from "../views/Crawler/List.vue";
import CrawlerDetail from "../views/Crawler/Details.vue";
import RegisterView from "../views/Account/Register.vue";
import { isAuthenticated } from "@/services/sessionService";

const router = createRouter({
  history: createWebHistory(), //import.meta.env.BASE_URL
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "home",
          name: "crawler-list",
          component: CrawlerList,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: ":id",
          name: "crawler-detail",
          component: CrawlerDetail,
          meta: {
            requiresAuth: true,
          },
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    // {
    //   path: '/:pathMatch(.*)*', // Fallback para rotas inválidas
    //   redirect: { name: 'home' },
    // },
  ],
});

// Proteção de rota
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
