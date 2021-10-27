<template>
  <div class="pl-3 pr-3">
    <v-tabs
      v-model="delivery.currentOption"
      class="delivery-tabs pl-4 pr-4"
      color="red"
    >
      <v-tab
        v-for="option in delivery.options"
        :key="option.value"
        :href="`#${option.value}`"
        class="delivery-tabs-item text-capitalize"
      >
        {{ option.label }}
      </v-tab>
      <v-tab-item value="entrega">
        <v-row
          class="address-checkout__wrapper-btn pt-3 pb-5"
          no-gutters
          @click="openSelectMapsAddress"
        >
          <v-col
            cols="2"
          >
            <v-img
              :src="require('@/static/location-4.png')"
              height="48"
              width="48"
            />
          </v-col>
          <v-col
            cols="8"
            class="pl-4 pr-2 align-self-center"
          >
            <div
              class="address-checkout__wrapper-content"
              v-if="!isEmpty(currentUser.address)"
            >
              <v-row class="address-checkout__wrapper-content-addr">
                {{ currentUser.address.street }}, {{ currentUser.address.number }}
              </v-row>
              <v-row class="address-checkout__wrapper-content-others">
                {{ currentUser.address.others }}
              </v-row>
            </div>
            <v-row
              class="address-checkout__wrapper-content-no-addr"
              v-else
            >
              <p class="ma-0">Clique aqui para definir o endereço de entrega.</p>
            </v-row>
          </v-col>
          <v-col
            cols="2"
            class="col-2 end pl-5 pr-0 align-self-center"
          >
            <v-btn
              icon
              color="red"
            >
              <v-icon
                x-large
                dense
              >
                mdi-chevron-right
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item value="retirada">
        <v-row
          class="address-checkout__wrapper-btn pt-3"
          no-gutters
          @click="selectTakeAwayAddress(takeAwayAddress)"
          v-for="takeAwayAddress in takeAwayAddresses"
          :key="takeAwayAddress.street"
        >
          <v-col
            cols="2"
          >
            <v-img
              :src="require(`@/static/${takeAwayAddress.icon}`)"
              height="48"
              width="48"
            />
          </v-col>
          <v-col
            cols="8"
            class="pl-3 pr-2 align-self-center"
          >
            <div>
              <v-row class="address-checkout__wrapper-content-addr">
                {{ takeAwayAddress.street }}, {{ takeAwayAddress.number }}
              </v-row>
              <v-row class="address-checkout__wrapper-content-others">
                {{ takeAwayAddress.others }}
              </v-row>
            </div>
          </v-col>
          <v-radio-group
            v-model="selectedTakeAwayAddress"
            class="col-2 end pl-5 pr-0 align-self-center"
          >
            <v-radio
              :value="takeAwayAddress"
              color="red"
            ></v-radio>
          </v-radio-group>
        </v-row>
      </v-tab-item>
    </v-tabs>
    <SelectMapsAddress
      :is-select-maps-address-visible="isSelectMapsAddressVisible"
      @closeSelectMapsAddress="closeSelectMapsAddress"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { isEmpty } from 'lodash';
import SelectMapsAddress from '@/components/shared/SelectMapsAddress.vue';

export default {
  name: 'Delivery',
  components: { SelectMapsAddress },
  data() {
    return {
      isSelectMapsAddressVisible: false,
      delivery: {
        currentOption: 'Entrega',
        options: [
          {
            label: 'Entrega',
            value: 'entrega',
          },
          {
            label: 'Retirada',
            value: 'retirada',
          },
        ],
      },
      selectedTakeAwayAddress: {},
    };
  },
  computed: {
    ...mapState('user', ['currentUser']),
    ...mapState('cart', ['takeAwayAddresses']),
  },
  watch: {
    delivery: {
      handler() {
        this.dispatchSelectDeliveryType(this.delivery.currentOption);
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions('cart', [
      'dispatchSelectDeliveryType',
      'dispatchSelectTakeAwayAddress',
    ]),
    isEmpty,
    closeSelectMapsAddress() {
      this.isSelectMapsAddressVisible = false;
    },
    openSelectMapsAddress() {
      this.isSelectMapsAddressVisible = true;
    },
    selectTakeAwayAddress(takeAwayAddress) {
      this.selectedTakeAwayAddress = takeAwayAddress;
      this.dispatchSelectTakeAwayAddress(takeAwayAddress);
    },
  },
  created() {
    this.selectTakeAwayAddress(this.takeAwayAddresses[0]);
    this.dispatchSelectDeliveryType(this.delivery.currentOption);
  },
};
</script>

<style lang="scss">
  .delivery-tabs {
    &-item {
    }
  }
  .address {
    &-checkout {
      &__wrapper {
        &-btn {
          cursor: pointer;
        }
        &-content {
          &-addr {
            font-size: inherit;
            line-height: 22px;
            color: black;
          }
          &-no-addr {
            display: flex;
            align-items: flex-end;
            font-weight: 500;
            font-size: inherit;
            line-height: 22px;
            color: red;
            height: 59px !important;
          }
          &-others {
            font-weight: 400;
            font-size: 0.75rem;
            line-height: 16px;
            color: #717171;
          }
        }
        &-selected {
          border: 1px solid red;
          border-radius: 5px;
          transition: all 200ms ease-in-out;
          &::before {
            transform: scale(1);
            border-radius: 4px;
            transition: transform 1000ms ease, border-radius 100ms ease 900ms;
          }
        }
      }
    }
  }
</style>
