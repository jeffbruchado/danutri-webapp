export const actions = {
  dispatchAddToCart({ commit }, item) {
    commit('addToCart', item);
    commit('updateCartSubTotalPrice');
  },
  dispatchEditCartItem({ commit }, item) {
    commit('editCartItem', item);
    commit('updateCartSubTotalPrice');
  },
  dispatchRemoveCartItem({ commit }, item) {
    commit('removeCartItem', item);
    commit('updateCartSubTotalPrice');
  },
  dispatchSelectDeliveryType({ commit }, payload) {
    commit('updateSelectedDeliveryType', payload);
  },
  dispatchSelectTakeAwayAddress({ commit }, payload) {
    commit('updateSelectedTakeAwayAddress', payload);
  },
  dispatchUpdateCartDeliveryPrice({ commit }, deliveryPrice) {
    commit('updateCartDeliveryPrice', deliveryPrice);
  },
};

export const mutations = {
  addToCart(state, payload) {
    state.items.push(payload);
  },
  editCartItem(state, payload) {
    state.items.forEach((item, i) => {
      if (item.id === payload.id) {
        // eslint-disable-next-line no-param-reassign
        state.items[i] = payload;
      }
    });
  },
  removeCartItem(state, payload) {
    state.items.forEach((item, i) => {
      if (item.id === payload.id) {
        state.items.splice(i, 1);
      }
    });
  },
  updateCartSubTotalPrice(state) {
    let cartSubTotalPrice = 0;
    state.items.forEach((item) => { cartSubTotalPrice = Number(cartSubTotalPrice) + Number(item.priceTotal); });
    state.cartSubTotalPrice = cartSubTotalPrice;
  },
  updateCartDeliveryPrice(state, deliveryPrice) {
    state.cartDeliveryTotalPrice = deliveryPrice;
  },
  updateSelectedDeliveryType(state, payload) {
    state.selectedDeliveryType = payload;
  },
  updateSelectedTakeAwayAddress(state, payload) {
    state.selectedTakeAwayAddress = payload;
  },
};

export const getters = {
  items: (state) => state.items,
  quantity: (state) => {
    let count = 0;
    if (!state.items) { return count; }
    state.items.forEach((item) => {
      count += item.quantity;
    });
    return count;
  },
  cartTotalPrice: (state) => {
    if (state.selectedDeliveryType === 'entrega') return state.cartSubTotalPrice + state.cartDeliveryTotalPrice;
    return state.cartSubTotalPrice;
  },
};

export const state = () => ({
  items: [],
  quantity: 0,
  cartSubTotalPrice: 0.0,
  selectedDeliveryType: '',
  selectedTakeAwayAddress: {},
  cartDeliveryTotalPrice: 0.0,
  takeAwayAddresses: [
    {
      id: '3794351c-2b74-11ec-8d3d-0242ac130003',
      street: 'Rua Najla Carone Goedert',
      placeId: 'ChIJpR5jgKY1J5URjqge0O_Y_jU',
      others: 'Passa Vinte, Palhoça - SC, Brasil',
      number: '415',
      complement: 'Predio',
      reference: 'Digitar no interfone',
      icon: 'building.png',
    },
    {
      id: '3ed367d0-2b74-11ec-8d3d-0242ac130003',
      street: 'Rua Maria Amélia Espíndola',
      placeId: 'ChIJE5U70owzJ5URMXNQGhZyVFU',
      others: 'Aririu da Formiga, Palhoça - SC, Brasil',
      number: '119',
      complement: 'Casa',
      reference: 'Última casa da Rua',
      icon: 'house.png',
    },
  ],
});
