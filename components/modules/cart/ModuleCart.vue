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
          <div
            v-for="category in categories"
            :key="category.id"
          >
            <div v-if="checkCartCategory(category.id)">
              <div class="cart-category-item__title pb-4 pt-4">
                {{ category.label.pt_BR }}
              </div>
              <div
                v-for="(item, i) in filteredMeals(category.id)"
                :key="item.id"
              >
                <div class="row pl-4 pr-4 pt-0 pb-0 pr-0 ma-0">
                  <p class="cart-meal-item__detail col-2 pb-0 pr-0 mb-2 align-self-center">
                    {{ item.quantity }}x
                  </p>
                  <p class="cart-meal-item__detail col-7 pb-0 pl-0 pr-0 mb-2 align-self-center">
                    {{ item.meal.label }}
                  </p>
                  <div class="cart-meal-item__detail__price col-3 pb-0 pr-2 mb-2 align-self-center">
                    R$ {{ formatPrice(calcItemPrice(item.quantity, item.meal.price)) }}
                  <!--                    <v-btn-->
                  <!--                      v-if="$vuetify.breakpoint.mobile"-->
                  <!--                      class="cart-meal-item__detail__btn pa-0 ml-2"-->
                  <!--                      text-->
                  <!--                      icon-->
                  <!--                      color="red"-->
                  <!--                      @click="sheet = true"-->
                  <!--                    >-->
                  <!--                      <v-icon>mdi-dots-vertical</v-icon>-->
                  <!--                    </v-btn>-->
                  </div>
                </div>
                <div v-if="item.comment" class="row pl-4 pr-4 pt-0 pb-0 pr-0 ma-0">
                  <p class="cart-meal-item__detail__comment col-12 pt-0 pb-0 pr-2 mb-1">
                    Obs.: {{ item.comment }}
                  </p>
                </div>
                <div
                  class="cart-meal-item__actions row pl-4 pr-4 pt-0 pb-0 ma-0"
                >
                  <v-btn
                    small
                    color="red"
                    outlined
                    class="cart-meal-item__actions__btn"
                    @click="openEditItem(item)"
                  >
                    Editar
                  </v-btn>
                  <v-btn
                    small
                    color="red"
                    outlined
                    class="cart-meal-item__actions__btn ma-0"
                    @click="dispatchRemoveCartItem(item)"
                  >
                    Remover
                  </v-btn>
                </div>
                <v-divider v-if="i !== (filteredMeals(category.id).length - 1)" />
              </div>
            </div>
          </div>
          <v-divider />
          <div class="cart-summary pl-4 pr-4 pt-3 pb-5">
            <div class="cart-summary__total_amount pl-3 pr-2">
              <span>Subtotal</span>
              <span>R$ {{ formatPrice(cartTotalPrice) }}</span>
            </div>
            <div class="cart-summary__total_delivery pl-3 pr-2">
              <span>Taxa de entrega</span>
              <span>Grátis</span>
            </div>
            <div class="cart-summary__total_cost pl-3 pr-2">
              <span>Total</span>
              <span>R$ {{ formatPrice(cartTotalPrice) }}</span>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="cart-actions__container pa-4">
          <div class="cart-add">
            <v-btn
              large
              color="red"
              dark
              min-width="100%"
              class="cart-add__btn text-capitalize"
              @click="sendMessage"
            >
              FINALIZAR PEDIDO
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <ItemDialog
      :is-open-item="isOpenItem"
      :is-editing="true"
      :item="currentOpenItem"
      @closeItem="closeEditItem"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import ItemDialog from '@/components/modules/items/ItemDialog.vue'

export default {
  name: 'ModuleCart',
  components: {
    ItemDialog
  },
  props: {
    isCartVisible: Boolean
  },
  data () {
    return {
      isOpenItem: false,
      currentOpenItem: {},
      sheet: false
    }
  },
  computed: {
    ...mapState('cart', ['items', 'cartTotalPrice']),
    // ...mapGetters('cart', ['cartTotalPrice']),
    ...mapGetters('meal', ['categories'])
  },
  methods: {
    ...mapActions('cart', ['dispatchRemoveCartItem']),
    lookItems () {
      console.log('cart items', this.items, this.cartTotalPrice)
    },
    filteredMeals (categoryId) {
      return this.items.filter(item => item.meal.category === categoryId)
    },
    closeCart () {
      this.$emit('closeCart')
    },
    checkCartCategory (categoryId) {
      return this.items.some(item => categoryId === item.meal.category)
    },
    formatPrice (price) {
      return parseFloat(price).toFixed(2)
    },
    openEditItem (item) {
      this.isOpenItem = true
      this.currentOpenItem = item
    },
    closeEditItem () {
      this.isOpenItem = false
      this.currentOpenItem = {}
    },
    calcItemPrice (quantity, price) {
      return quantity * price
    },
    sendMessage () {
      let message = 'Olá, segue o meu pedido: \n' +
        '-----------------------------'
      const phone = '5548'
      this.categories.forEach((category) => {
        message += '\n'
        message += `*${category.label.pt_BR}:*\n\n`
        this.filteredMeals(category.id).forEach((item) => {
          message += `*${item.quantity}x ${item.meal.label}* \n`
          if (item.comment) { message += `_Obs: ${item.comment.trim()}_ \n\n` }
          if (!item.comment) { message += '' }
        })
        message += '-----------------------------'
      })
      message += `\n\nSubtotal: R$${this.formatPrice(this.cartTotalPrice)}\n`
      message += 'Frete: Grátis\n'
      message += `Total: R$${this.formatPrice(this.cartTotalPrice)}\n`
      message = window.encodeURIComponent(message)
      return window.open('https://api.whatsapp.com/send?phone=' + phone + '&text=' + message, '_blank')
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
  &-meal {
    &-item {
      &__detail {
        color: #272727;
        font-size: 0.90rem;
        font-weight: normal;
        line-height: 1rem;
        &__comment {
          color: #a6a5a5;
          font-weight: 300;
          font-size: 0.9375rem;
        }
        &__price {
          display: flex;
          justify-content: end;
          color: #272727;
          font-weight: normal;
          line-height: 1rem;
        }
        &__btn {
          width: 0 !important;
          height: 0 !important;
          margin-top: 7px;
        }
      }
      &__actions {
        &__btn {
          border: 0;
          text-transform: capitalize;
        }
      }
    }
  }
  &-summary {
    &__total {
      &_amount {
        display: flex;
        justify-content: space-between;
        font-size: 0.9375rem;
        padding: 0.2rem;
      }
      &_delivery {
        display: flex;
        justify-content: space-between;
        font-size: 0.9375rem;
      }
      &_cost {
        display: flex;
        justify-content: space-between;
        font-size: 1.125rem;
        font-weight: bold;
        line-height: 22px;
        margin-top: 5px;
        color: black;
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
