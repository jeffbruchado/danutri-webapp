export const actions = {
  dispatchAddToCart ({ commit }, item) {
    commit('addToCart', item)
    commit('updateCartTotalPrice')
  },
  dispatchEditCartItem ({ commit }, item) {
    commit('editCartItem', item)
    commit('updateCartTotalPrice')
  },
  dispatchRemoveCartItem ({ commit }, item) {
    commit('removeCartItem', item)
    commit('updateCartTotalPrice')
  },
  dispatchUpdateCartTotalPrice ({ commit }) {
    commit('updateCartTotalPrice')
  }
}

export const mutations = {
  addToCart (state, payload) {
    state.items.push(payload)
  },
  editCartItem (state, payload) {
    state.items.forEach((item, i) => {
      if (item.id === payload.id) {
        state.items[i] = payload
      }
    })
  },
  removeCartItem (state, payload) {
    state.items.forEach((item, i) => {
      if (item.id === payload.id) {
        state.items.splice(i, 1)
      }
    })
  },
  updateCartTotalPrice (state) {
    let cartTotalPrice = 0
    state.items.forEach((item) => { cartTotalPrice = Number(cartTotalPrice) + Number(item.priceTotal) })
    state.cartTotalPrice = cartTotalPrice
  }
}

export const state = () => ({
  items: [],
  quantity: 0,
  cartTotalPrice: 0.0
})

export const getters = {
  items: state => state.items,
  quantity: (state) => {
    let count = 0
    if (!state.items) { return count }
    state.items.forEach((item) => {
      count = count + item.quantity
    })
    return count
  },
  cartTotalPrice: state => state.cartTotalPrice
}
