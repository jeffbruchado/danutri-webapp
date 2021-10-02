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
          @click="isSelectMapsAddressVisible = true"
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
            class="pl-3 pr-2 align-self-center"
          >
            <v-row class="address-checkout__wrapper-content-addr">
              {{ address.street }}
            </v-row>
            <v-row class="address-checkout__wrapper-content-others">
              {{ address.others }}
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
        <span>Retirada</span>
      </v-tab-item>
    </v-tabs>
    <SelectMapsAddress
      :is-select-maps-address-visible="isSelectMapsAddressVisible"
      @closeSelectMapsAddress="closeSelectMapsAddress"
    />
  </div>
</template>

<script>
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
      address: {
        street: 'Av. Atilio Pedro Pagani, 115',
        others: 'Palhoça/SC',
      },
    };
  },
  methods: {
    closeSelectMapsAddress() {
      this.isSelectMapsAddressVisible = false;
    },
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
            font-size: 1rem;
            line-height: 22px;
            color: black;
          }
          &-others {
            font-weight: 400;
            font-size: 0.75rem;
            line-height: 16px;
            color: #717171;
          }
        }
      }
    }
  }
</style>
