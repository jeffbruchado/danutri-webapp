<template>
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
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'SelectMapsAddress',
  props: {
    isSelectMapsAddressVisible: Boolean,
  },
  data() {
    return {
    };
  },
  methods: {
    closeSelectMapsAddress() {
      this.$emit('closeSelectMapsAddress');
    },
  },
};
</script>

<style lang="scss">

</style>
