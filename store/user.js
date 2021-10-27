export const actions = {
  dispatchAddAddress({ commit }, payload) {
    commit('addAddress', payload);
  },
};

export const mutations = {
  addAddress(state, payload) {
    state.currentUser.address = { ...payload };
  },
};

export const getters = {
  currentUser: (state) => state.currentUser,
  address: (state) => state.address,
};

export const state = () => ({
  currentUser: {
    address: {},
  },
});
