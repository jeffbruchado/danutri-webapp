<template>
  <div>
    <v-dialog
      :fullscreen="$vuetify.breakpoint.mobile && !$vuetify.breakpoint.sm"
      scrollable
      :transition="$vuetify.breakpoint.mobile && !$vuetify.breakpoint.sm ? 'dialog-bottom-transition' : 'scale-transition'"
      max-width="1024px"
      :value="isSelectMapsAddressVisible"
      persistent
    >
      <v-card>
        <v-card-title flat class="pl-4 pr-4 pb-2 cart-nav-header">
          <v-btn
            icon
            color="red"
            class="col-1"
            @click="closeSelectMapsAddress"
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
              :src="require('@/static/location-3.png')"
              max-height="150"
              max-width="150"
            />
          </div>
          <div class="d-flex justify-center pt-8">
            <v-text-field
              v-model="addressQuery"
              filled
              solo
              placeholder="Buscar endereço e número"
              prepend-inner-icon="mdi-magnify"
              color="red"
            />
          </div>
          <v-row
            class="address-checkout__wrapper-btn pt-3 pb-3"
            :class="{ 'address-checkout__wrapper-selected': selectedAddress.place_id === result.place_id }"
            v-for="result in addressResults"
            :key="result.place_id"
            @click="selectAddress(result)"
            no-gutters
          >
            <v-col
              cols="2"
              class="pl-3"
            >
              <v-icon
                large
                dense
              >
                mdi-map-marker-radius-outline
              </v-icon>
            </v-col>
            <v-col
              cols="10"
              class="pl-3 pr-2 align-self-center"
            >
              <v-row class="address-checkout__wrapper-content-addr">
                {{ result.structured_formatting.main_text }}
              </v-row>
              <v-row class="address-checkout__wrapper-content-others">
                {{ result.structured_formatting.secondary_text }}
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="cart-actions__container pa-4">
          <div class="cart-add" v-if="!selectedAddress.place_id">
            <v-btn
              large
              color="green"
              min-width="100%"
              class="text-capitalize"
              :dark="addressQuery.length > 0"
              :disabled="!addressQuery.length"
              @click="getAddressBySearchQuery"
            >
              BUSCAR ENDEREÇO
            </v-btn>
          </div>
          <div class="cart-add" v-else>
            <v-btn
              large
              color="red"
              min-width="100%"
              class="text-capitalize"
              :dark="addressQuery.length > 0"
              :disabled="!addressQuery.length"
              @click="confirmAddress"
            >
              COMPLETAR ENDEREÇO
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <AddressForm
      :is-address-form-visible="isAddressFormVisible"
      :selectedAddress="selectedAddress"
      @closeAddressForm="closeAddressForm"
      @confirmAddress="confirmedAddress"
    ></AddressForm>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import AddressForm from '@/components/shared/AddressForm.vue';

export default {
  name: 'SelectMapsAddress',
  components: { AddressForm },
  props: {
    isSelectMapsAddressVisible: Boolean,
  },
  data() {
    return {
      addressQuery: '',
      addressResults: [],
      selectedAddress: {},
      services: {
        placesApi: null,
        directionsApi: null,
      },
      value: null,
      isAddressFormVisible: false,
    };
  },
  head() {
    return {
      script: [
        {
          src: `https://maps.googleapis.com/maps/api/js?key=${process.env.MAPS_PLACES_API_KEY}&libraries=places&language=pt_BR`,
          async: true,
          defer: true,
          callback: () => this.mapsInit(),
        },
      ],
    };
  },
  // watch: {
  //   addressQuery(newValue) {
  //     console.log('addressQuery', newValue);
  //     if (newValue) {
  //       this.service.getPlacePredictions({
  //         input: this.addressQuery,
  //         types: ['(cities)'],
  //       }, this.displaySuggestions);
  //     }
  //   },
  // },
  computed: {
    ...mapState('cart', [
      'takeAwayAddresses',
    ]),
  },
  watch: {
    addressQuery(newValue) {
      if (newValue) {
        this.selectedAddress = {};
      }
    },
    selectedAddress() {
      if (/\s+\d+/.test(this.selectedAddress?.structured_formatting?.main_text)) {
        this.$set(this.selectedAddress.structured_formatting, 'number', this.getAddressNumberByMainText(this.selectedAddress?.structured_formatting?.main_text));
      }
    },
  },
  methods: {
    ...mapActions('user', ['dispatchAddAddress']),
    closeSelectMapsAddress() {
      this.$emit('closeSelectMapsAddress');
    },
    mapsInit() {
      this.services.placesApi = new window.google.maps.places.AutocompleteService();
      this.services.directionsApi = new window.google.maps.DirectionsService();
    },
    displaySuggestions(predictions, status) {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
        this.addressResults = [];
        return;
      }
      this.addressResults = predictions.map((prediction) => prediction);
    },
    getAddressBySearchQuery() {
      this.services.placesApi.getPlacePredictions({
        input: this.addressQuery,
      }, this.displaySuggestions);
    },
    selectAddress(address) {
      // eslint-disable-next-line no-return-assign
      if (this.selectedAddress?.place_id === address?.place_id) return this.selectedAddress = {};
      // eslint-disable-next-line no-return-assign
      return this.selectedAddress = address;
    },
    getAddressNumberByMainText(mainText) {
      const addressNumber = mainText.match(/\s+\d+/);
      return addressNumber[0]?.trim();
    },
    confirmAddress() {
      this.isAddressFormVisible = true;
    },
    async getDeliveryDistance() {
      if (!this.selectedAddress?.place_id) return;
      const payload = {
        destination: {
          placeId: this.selectedAddress?.place_id,
        },
        origin: {
          placeId: this.takeAwayAddresses[0].placeId,
        },
        travelMode: 'DRIVING',
      };
      // eslint-disable-next-line consistent-return
      return this.services.directionsApi.route(payload);
    },
    async addAddress(address) {
      const deliveryDistance = await this.getDeliveryDistance();
      const payload = {
        ...address,
      };
      if (deliveryDistance) {
        payload.routes = deliveryDistance?.routes[0]?.legs[0];
      }
      this.dispatchAddAddress(payload);
    },
    closeAddressForm() {
      this.isAddressFormVisible = false;
    },
    confirmedAddress(address) {
      this.addAddress(address);
      this.closeAddressForm();
      this.closeSelectMapsAddress();
    },
  },
};
</script>

<style lang="scss">

</style>
