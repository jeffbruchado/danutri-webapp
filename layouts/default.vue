<template>
  <v-app>
    <v-app-bar
      v-if="!$vuetify.breakpoint.mobile"
      :clipped-left="clipped"
      app
      class="responsive-header"
      flat
    >
      <div class="responsive-header__container">
        <div class="responsive-header__logo">
          <a class="btn-icon">
            <canvas height="0" width="0" style="border-radius: inherit;height: 100%;left: 0;position: absolute;top: 0px;width: 100%;" />
            <span class="icon-marmita icon-marmita--logo-ifood-plain">
              <img
                src="@/static/logo.svg"
                alt="Da Nutri Logo"
              >
            </span>
          </a>
        </div>
        <v-spacer />
        <v-btn
          depressed
          @click="isCartVisible = !isCartVisible"
        >
          <v-badge
            :content="quantity"
            :value="quantity"
            color="red"
          >
            <v-icon
              v-if="$route.path === '/cart'"
              color="black"
            >
              mdi-cart
            </v-icon>
            <v-icon
              v-else
              color="black"
            >
              mdi-cart-outline
            </v-icon>
          </v-badge>
        </v-btn>
      </div>
    </v-app-bar>
    <v-main>
      <Nuxt />
    </v-main>
    <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    />
    <v-footer
      :absolute="!fixed"
      app
    >
      <v-bottom-navigation
        v-if="$vuetify.breakpoint.mobile"
        grow
        fixed
        class="bottom-navigation--height"
      >
        <v-btn to="/" nuxt>
          <span class="tab-bar-item__title">Cardápio</span>
          <v-icon
            v-if="$route.path === '/'"
            color="black"
          >
            mdi-calendar-text
          </v-icon>
          <v-icon
            v-else
            color="black"
          >
            mdi-calendar-text-outline
          </v-icon>
        </v-btn>
        <v-btn @click="isCartVisible = true">
          <span class="tab-bar-item__title">Sacola</span>
          <v-badge
            :content="quantity"
            :value="quantity"
            overlap
            bordered
            color="red"
          >
            <v-icon
              v-if="$route.path === '/cart'"
              color="black"
            >
              mdi-cart
            </v-icon>
            <v-icon
              v-else
              color="black"
            >
              mdi-cart-outline
            </v-icon>
          </v-badge>
        </v-btn>
      </v-bottom-navigation>
      <span>&copy; {{ new Date().getFullYear() }} Jeff Bruchado</span>
    </v-footer>
    <ModuleCart
      :is-cart-visible="isCartVisible"
      @closeCart="closeCart"
    />
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import ModuleCart from '@/components/modules/cart/ModuleCart.vue';

export default {
  components: {
    ModuleCart,
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Da Nutri Sabores',
      isCartVisible: false,
    };
  },
  computed: {
    ...mapGetters('cart', ['quantity']),
  },
  methods: {
    closeCart() {
      this.isCartVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
  .responsive-header {
    background-color: #f7f7f7;
    box-shadow: inset 0 -1px 0 #dcdcdc !important;

    &__logo {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .btn-icon {
      display: flex;
      width: 68px;
      height: 68px;
      img {
        justify-content: center;
        border-radius: 0;
        width: 70px;
        height: 70px;
      }
      .icon-marmita {
        display: inline-block;
        position: relative;
        width: 100%;
        height: 100%;
      }
    }

    &__container {
      display: flex;
      flex-grow: 1;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 1366px !important;
      margin: auto;
      padding: 0 30px;
    }
  }
  .tab {
    &-bar {
      &-item {
        &__title {
          color: #3e3e3e;
          font-weight: 300;
          font-size: 0.75rem;
          line-height: 0.875rem;
          margin-top: 3px;
          font-family: "SulSans", Helvetica, sans-serif;
          letter-spacing: 0;
        }
        &-cart {
          &__badge {
            height: 17px;
            font-size: 9px;
            min-width: 17px;
          }
        }
      }
    }
  }
  .bottom-navigation--height {
    height: 63px !important;
  }
</style>
