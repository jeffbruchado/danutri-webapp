<template>
  <div>
    <v-dialog
      :fullscreen="$vuetify.breakpoint.mobile && !$vuetify.breakpoint.sm"
      scrollable
      :transition="$vuetify.breakpoint.mobile && !$vuetify.breakpoint.sm ? 'dialog-bottom-transition' : 'scale-transition'"
      max-width="1024px"
      :value="isCartVisible"
      persistent
    >
      <v-card>
        <v-card-title flat class="pl-4 pr-4 pb-2 cart-nav-header">
          <div
            class="cart-nav-header__title text-wrap text-break d-flex justify-center"
          >
            SUA SACOLA
          </div>
          <v-btn
            icon
            color="red"
            class="cart-nav-header--icon"
            @click="closeCart"
          >
            <v-icon
              x-large
              dense
            >
              {{ $vuetify.breakpoint.mobile && !$vuetify.breakpoint.sm ? 'mdi-chevron-down' : 'mdi-close' }}
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text v-if="items.length" class="pa-0">
          <Delivery ref="deliveryRef"/>
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
        <v-card-text v-else class="flex">
          <v-container fill-height>
            <v-row align="center" justify="center">
              <!--              <v-img-->
              <!--                :src="require('@/static/sad.png')"-->
              <!--                max-height="150"-->
              <!--                max-width="150"-->
              <!--              />-->
              <p class="text-center pt-5">
                Sua sacola está vazia
              </p>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="cart-actions__container pa-4">
          <div v-if="items.length" class="cart-add">
            <v-tooltip
              top
              :disabled="!checkIfDeliveryOrTakeAwayAddressIsEmpty"
              nudge-top="10"
              max-width="250"
              content-class="text-center"
            >
              <template v-slot:activator="{ on, attrs }">
                <div v-on="on">
                  <v-btn
                    large
                    color="red"
                    :dark="!checkIfDeliveryOrTakeAwayAddressIsEmpty"
                    v-bind="attrs"
                    v-on="on"
                    min-width="100%"
                    class="cart-add__btn text-capitalize"
                    :disabled="checkIfDeliveryOrTakeAwayAddressIsEmpty"
                    @click="sendMessage"
                  >
                    FINALIZAR PEDIDO
                  </v-btn>
                </div>
              </template>
              <span>É necessário definir o Endereço de Entrega para Finalizar o Pedido</span>
            </v-tooltip>
          </div>
          <div v-else class="cart-add">
            <v-btn
              large
              color="green"
              dark
              min-width="100%"
              class="cart-add__btn text-capitalize"
              @click="closeCart"
            >
              ADICIONAR PRODUTOS
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
import { mapActions, mapGetters, mapState } from 'vuex';
import { isEmpty } from 'lodash';
import ItemDialog from '@/components/modules/items/ItemDialog.vue';
import Delivery from '@/components/shared/Delivery.vue';

export default {
  name: 'ModuleCart',
  components: {
    Delivery,
    ItemDialog,
  },
  props: {
    isCartVisible: Boolean,
  },
  data() {
    return {
      isOpenItem: false,
      currentOpenItem: {},
      sheet: false,
    };
  },
  computed: {
    ...mapState('cart', [
      'items',
      'cartTotalPrice',
      'selectedDeliveryType',
      'selectedTakeAwayAddress',
    ]),
    ...mapState('user', ['currentUser']),
    // ...mapGetters('cart', ['cartTotalPrice']),
    ...mapGetters('meal', ['categories']),
    checkIfDeliveryOrTakeAwayAddressIsEmpty() {
      if (this.selectedDeliveryType === 'entrega') return isEmpty(this.currentUser.address);
      return isEmpty(this.selectedTakeAwayAddress);
    },
  },
  methods: {
    isEmpty,
    ...mapActions('cart', ['dispatchRemoveCartItem']),
    filteredMeals(categoryId) {
      return this.items.filter((item) => item.meal.category === categoryId);
    },
    closeCart() {
      this.$emit('closeCart');
    },
    checkCartCategory(categoryId) {
      return this.items.some((item) => categoryId === item.meal.category);
    },
    formatPrice(price) {
      return parseFloat(price).toFixed(2);
    },
    openEditItem(item) {
      this.isOpenItem = true;
      this.currentOpenItem = item;
    },
    closeEditItem() {
      this.isOpenItem = false;
      this.currentOpenItem = {};
    },
    calcItemPrice(quantity, price) {
      return quantity * price;
    },
    sendMessage() {
      let message = 'Olá, segue o meu pedido: \n'
        + '-----------------------------';
      const phone = '5548996461911';
      message += this.mountCartItemsString();
      message += this.checkDeliveryOrTakeAwayString();
      message += this.mountCartPriceDetailsString();
      message = window.encodeURIComponent(message);
      return window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${message}`, '_blank');
    },
    mountCartItemsString() {
      let message = '';
      this.categories.forEach((category) => {
        if (!this.checkCartCategory(category.id)) return;
        message += '\n';
        message += `*${category.label.pt_BR}:*\n\n`;
        this.filteredMeals(category.id).forEach((item) => {
          message += `*${item.quantity}x ${item.meal.label}* \n`;
          if (item.comment) { message += `_Obs: ${item.comment.trim()}_ \n\n`; }
          if (!item.comment) { message += ''; }
        });
        message += '-----------------------------';
      });
      return message;
    },
    checkDeliveryOrTakeAwayString() {
      if (this.$refs.deliveryRef.delivery.currentOption === 'entrega') return this.mountDeliveryString(this.currentUser?.address);
      return this.mountDeliveryString(this.$refs.deliveryRef.selectedTakeAwayAddress);
    },
    mountDeliveryString(adressObj) {
      let message = '';
      message += `\nMétodo de Recebimento: *${this.$refs.deliveryRef.delivery.currentOption.toUpperCase()}*`;
      message += `\n\n${adressObj?.street}, ${adressObj?.number}`;
      message += `\n${adressObj?.others}\n\n`;
      message += '-----------------------------';
      return message;
    },
    mountCartPriceDetailsString() {
      let message = '';
      message += `\n\nSubtotal: R$${this.formatPrice(this.cartTotalPrice)}\n`;
      message += 'Frete: Grátis\n';
      message += `Total: R$${this.formatPrice(this.cartTotalPrice)}\n`;
      return message;
    },
  },
};
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
        padding: 10px;
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
      &--icon {
        position: absolute;
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
        padding: 2px 0 0 0;
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
          justify-content: flex-end;
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
