<template>
  <v-dialog
    :fullscreen="$vuetify.breakpoint.mobile && !$vuetify.breakpoint.sm"
    scrollable
    :transition="$vuetify.breakpoint.mobile && !$vuetify.breakpoint.sm ? 'dialog-bottom-transition' : 'scale-transition'"
    max-width="1024px"
    :value="isCartVisible"
  >
    <ModuleCart
      :is-cart-visible="isCartVisible"
      @closeCart="closeCart"
    />
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import ModuleCart from '@/components/modules/cart/ModuleCart.vue';

export default {
  components: {
    ModuleCart,
  },
  props: {
    isCartVisible: Boolean,
  },
  computed: {
    ...mapGetters('cart', ['quantity']),
  },
  methods: {
    closeCart() {
      this.$emit('closeCart');
    },
  },
};
</script>
