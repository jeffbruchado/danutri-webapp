export const state = () => ({
  categories: [
    {
      id: '1',
      type: 'lunchboxes',
      label: {
        pt_BR: 'Marmitas',
        en_US: 'Lunch Boxes'
      }
    },
    {
      id: '2',
      type: 'broths',
      label: {
        pt_BR: 'Caldos',
        en_US: 'Broths'
      }
    },
    {
      id: '3',
      type: 'pies',
      label: {
        pt_BR: 'Empadões',
        en_US: 'Broths'
      }
    }
  ]
})

export const getters = {
  categories: state => state.categories
}
