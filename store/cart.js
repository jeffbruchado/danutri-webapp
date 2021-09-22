export const actions = {
  dispatchAddToCart ({ commit }, item) {
    commit('addToCart', item)
  }
}

export const mutations = {
  addToCart (state, payload) {
    state.items.push(payload)
  }
}

export const state = () => ({
  items: [],
  quantity: 0
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
  }
}
