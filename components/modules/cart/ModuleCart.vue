<template>
  <div>
    <v-dialog
      :fullscreen="$vuetify.breakpoint.mobile && !$vuetify.breakpoint.sm"
      scrollable
      :transition="$vuetify.breakpoint.mobile && !$vuetify.breakpoint.sm ? 'dialog-bottom-transition' : 'scale-transition'"
      max-width="1024px"
      :value="isCartVisible"
    >
      <v-card>
        <v-card-title flat class="pl-4 pr-4 pb-2 cart-nav-header">
          <v-btn
            icon
            color="red"
            class="col-1"
            @click="closeCart"
          >
            <v-icon
              x-large
              dense
            >
              mdi-chevron-down
            </v-icon>
          </v-btn>
          <div
            class="cart-nav-header__title text-wrap text-break col-10"
            @click="lookItems"
          >
            SUA SACOLA
          </div>
        </v-card-title>
        <v-card-text class="pa-0">
          <div class="cart-category-item__title pb-4 pt-4">
            Combos
          </div>
          <p>R$ {{ totalPrice }}</p>
          <div class="cart-category-item__title pb-4 pt-4">
            Marmitas
          </div>
          <p>R$ {{ totalPrice }}</p>
          <div class="cart-category-item__title pb-4 pt-4">
            Caldos
          </div>
          <p>R$ {{ totalPrice }}</p>
          <div class="cart-category-item__title pb-4 pt-4">
            Empadões
          </div>
          <p>R$ {{ totalPrice }}</p>
        </v-card-text>
        <v-card-actions class="cart-actions__container pa-4">
          <div class="cart-add">
            <v-btn
              large
              color="red"
              dark
              min-width="100%"
              class="cart-add__btn text-capitalize"
            >
              FINALIZAR PEDIDO
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ModuleCart',
  props: {
    isCartVisible: Boolean
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState('cart', ['items']),
    totalPrice () {
      let totalPrice = 0
      this.items.forEach((item) => { totalPrice = Number(totalPrice) + Number(item.priceTotal) })
      return totalPrice
    }
  },
  methods: {
    lookItems () {
      console.log('cart items', this.items, this.totalPrice)
    },
    closeCart () {
      this.$emit('closeCart')
    }
  }
}
</script>
<style lang="scss">
.cart {
  &-nav {
    &-header {
      border-bottom: 2px solid #fcf8f8;
      &__title {
        font-size: 0.75rem;
        font-weight: 500;
        left: 0;
        margin: 0;
        padding: 2px 20% 0 15%;
        text-align: center;
        text-transform: uppercase;
        width: 100%;
        z-index: 0;
        color: #3e3e3e;
        line-height: 1rem;
        @media only screen and (min-width: 768px) {
          font-size: 1rem;
          line-height: 1.5rem;
        }
      }
    }
  }
  &-category {
    &-item {
      &__title {
        font-size: 0.90rem;
        font-weight: 500;
        left: 0;
        margin: 0;
        padding: 2px 20% 0 15%;
        text-align: center;
        text-transform: uppercase;
        width: 100%;
        z-index: 0;
        color: black;
        line-height: 1rem;
        background-color: #f2f2f2;
        @media only screen and (min-width: 768px) {
          font-size: 1rem;
          line-height: 1.5rem;
        }
      }
    }
  }
  &-actions {
    &__container {
      border-top: 2px solid #f5f0eb;
      padding: 20px 20px;
    }
  }
  &-add {
    width: 100%;
    &__btn {
      align-items: center;
      display: flex;
      width: 100%;
      font-weight: 500;
      letter-spacing: 0;
    }
  }

}
</style>
