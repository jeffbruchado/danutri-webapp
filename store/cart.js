export const actions = {
  dispatchAddToCart({ commit }, item) {
    commit('addToCart', item);
    commit('updateCartTotalPrice');
  },
  dispatchEditCartItem({ commit }, item) {
    commit('editCartItem', item);
    commit('updateCartTotalPrice');
  },
  dispatchRemoveCartItem({ commit }, item) {
    commit('removeCartItem', item);
    commit('updateCartTotalPrice');
  },
  dispatchUpdateCartTotalPrice({ commit }) {
    commit('updateCartTotalPrice');
  },
  dispatchSelectDeliveryType({ commit }, payload) {
    commit('updateSelectedDeliveryType', payload);
  },
  dispatchSelectTakeAwayAddress({ commit }, payload) {
    commit('updateSelectedTakeAwayAddress', payload);
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
  updateCartTotalPrice(state) {
    let cartTotalPrice = 0;
    state.items.forEach((item) => { cartTotalPrice = Number(cartTotalPrice) + Number(item.priceTotal); });
    // eslint-disable-next-line no-param-reassign
    state.cartTotalPrice = cartTotalPrice;
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
  cartTotalPrice: (state) => state.cartTotalPrice,
};

export const state = () => ({
  items: [],
  quantity: 0,
  cartTotalPrice: 0.0,
  selectedDeliveryType: '',
  selectedTakeAwayAddress: {},
  takeAwayAddresses: [
    {
      id: '3794351c-2b74-11ec-8d3d-0242ac130003',
      street: 'Avenida Atilio Pagani',
      others: 'Aririu da Formiga, Palhoça - SC, Brasil',
      number: '119',
      complement: 'Casa',
      reference: 'Última casa da Rua',
      icon: 'building.png',
    },
    {
      id: '3ed367d0-2b74-11ec-8d3d-0242ac130003',
      street: 'Rua Maria Amélia Espíndola',
      others: 'Aririu da Formiga, Palhoça - SC, Brasil',
      number: '119',
      complement: 'Casa',
      reference: 'Última casa da Rua',
      icon: 'house.png',
    },
  ],
});
