<template>
  <v-dialog
    :fullscreen="$vuetify.breakpoint.mobile && !$vuetify.breakpoint.sm"
    scrollable
    :transition="$vuetify.breakpoint.mobile && !$vuetify.breakpoint.sm ? 'dialog-bottom-transition' : 'scale-transition'"
    max-width="1024px"
    :value="isAddressFormVisible"
    persistent
  >
    <v-card>
      <v-card-title flat class="pl-4 pr-4 pb-2 cart-nav-header">
        <v-btn
          icon
          color="red"
          class="col-1"
          @click="closeAddressForm"
        >
          <v-icon
            x-large
            dense
          >
            {{ $vuetify.breakpoint.mobile && !$vuetify.breakpoint.sm ? 'mdi-chevron-down' : 'mdi-close' }}
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div class="d-flex justify-center pt-8">
          <v-img
            :src="require('@/static/location-8.png')"
            max-height="150"
            max-width="150"
          />
        </div>
        <div class="complete-address__address-info justify-center pt-8">
          <p class="complete-address__street-label">{{ getMainText() }}</p>
          <p class="complete-address__state-label">{{ getSecondaryText() }}</p>
        </div>
        <div class="d-flex justify-center pt-1">
          <v-text-field
            v-model="address.number"
            label="Número"
            style="width: 30%"
            :rules="address.numberRules"
            class="mr-4"
          />
          <v-text-field
            v-model="address.complement"
            label="Complemento"
            placeholder="Apartamento/Bloco/Casa"
          />
        </div>
        <div class="d-flex justify-center pt-0">
          <v-text-field
            v-model="address.reference"
            label="Ponto de referência"
            style="width: 30%"
          />
        </div>

      </v-card-text>
      <v-card-actions class="cart-actions__container pa-4">
        <div class="cart-add">
          <v-btn
            large
            color="red"
            min-width="100%"
            class="text-capitalize"
            :dark="address.number.length > 0"
            :disabled="!address.number.length"
            @click="confirmAddress"
          >
            CONFIRMAR ENDEREÇO
          </v-btn>
        </div>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'AddressForm',
  props: {
    isAddressFormVisible: Boolean,
    selectedAddress: Object,
  },
  data() {
    return {
      address: {
        number: '',
        numberRules: [
          (v) => !!v || 'Informe o número',
        ],
        complement: '',
        reference: '',
      },
    };
  },
  watch: {
    selectedAddress() {
      this.address.number = '';
      if (this.selectedAddress?.structured_formatting?.number) this.address.number = this.selectedAddress?.structured_formatting?.number;
    },
  },
  methods: {
    ...mapActions('user', ['dispatchAddAddress']),
    closeAddressForm() {
      this.$emit('closeAddressForm');
    },
    confirmAddress() {
      const payload = {
        place_id: this.selectedAddress.place_id,
        street: this.getMainTextWithoutNumberIfExist(),
        others: this.getSecondaryText(),
        number: this.address.number,
        complement: this.address.complement,
        reference: this.address.reference,
      };
      this.$emit('confirmAddress', payload);
    },
    getMainText() {
      return this.selectedAddress.structured_formatting?.main_text;
    },
    getMainTextWithoutNumberIfExist() {
      return this.selectedAddress.structured_formatting?.main_text.replace(/\s+\d+/, '').replace(',', '');
    },
    getSecondaryText() {
      return this.selectedAddress.structured_formatting?.secondary_text;
    },
  },
};
</script>

<style lang="scss">
  .complete-address {
    &__street-label {
      padding-bottom: 0;
      margin: 0 0 0 0 !important;
      color: #3f3e3e;
      font-size: 0.83562rem;
    }
    &__state-label {
      margin: 0 0 0 0 !important;
      font-size: 0.83562rem;
      color: #a6a5a5;
    }
  }
</style>
