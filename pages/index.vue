<template>
  <div class="lunchboxes-menu fill-height">
    <div class="lunchboxes-menu-banner">
      <div
        class="lunchboxes-menu-banner__wrapper"
        style="background-image: url(https://cdn.vuetifyjs.com/images/parallax/material2.jpg);"
      />
    </div>
    <div class="pa-3 pa-sm-3 pa-md-8 pa-lg-8">
      <div
        v-for="category in categories"
        :key="category.id"
        class="mb-5"
      >
        <div class="lunchboxes-menu-item__title mb-2 pt-5">
          {{ category.label.pt_BR }}
        </div>
        <v-row dense class="lunchboxes-menu-item__row">
          <v-col
            v-for="meal in filteredMeals(category.id)"
            :key="meal.id"
            order
            sm="12"
            md="6"
            lg="6"
            class="pl-lg-2 pr-lg-2 pb-lg-0 pb-0"
          >
            <v-hover
              v-slot="{ hover }"
            >
              <v-card
                v-if="meal.category === category.id"
                :elevation="hover ? 2 : 0"
                class="meal-item__button mb-lg-2 transition-swing"
                outlined
                @click="openMeal(meal)"
              >
                <v-list-item three-line>
                  <v-list-item-content>
                    <v-list-item-title class="meal-item__title mb-1 text-wrap">
                      {{ meal.label }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="">
                      {{ meal.description }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="meal-item__serves">
                      Serve 1 pessoa
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-avatar
                    tile
                    size="80"
                    color="grey"
                  />
                </v-list-item>
                <v-card-actions class="pa-0">
                  <span class="meal-item__price">
                    <span class="meal-item__price--discount">
                      R${{ parseFloat(meal.price).toFixed(2) }}
                    </span>
                  </span>
                </v-card-actions>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </div>
    </div>
    <v-dialog
      v-model="isOpenMeal"
      :fullscreen="$vuetify.breakpoint.mobile && !$vuetify.breakpoint.sm"
      scrollable
      :transition="$vuetify.breakpoint.mobile && !$vuetify.breakpoint.sm ? 'dialog-bottom-transition' : 'scale-transition'"
      max-width="1024px"
    >
      <v-card>
        <v-card-title flat class="pl-4 pr-4 pb-1">
          <v-btn
            icon
            color="red"
            class="col-1"
            @click="closeMeal"
          >
            <v-icon
              x-large
              dense
            >
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <div class="meal-item-nav-header__title text-wrap text-break col-11">
            {{ currentOpenMeal.label }}
          </div>
        </v-card-title>
        <v-img
          class="white--text align-end"
          height="200px"
          src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
        />
        <v-card-text class="pa-0">
          <v-card-title
            class="meal-item__title mb-3 text-break"
          >
            {{ currentOpenMeal.label }}
          </v-card-title>
          <v-card-subtitle
            class="text-break pb-0"
          >
            {{ currentOpenMeal.description }}
          </v-card-subtitle>
          <v-card-subtitle class="pb-2">
            <span class="meal-item__price pa-0">
              <span class="meal-item__price--discount">
                R${{ parseFloat(currentOpenMeal.price).toFixed(2) }}
              </span>
            </span>
          </v-card-subtitle>
          <div class="pl-4 pr-4 pt-4">
            <div class="meal-item__textarea__header">
              <label
                :for="currentOpenMeal.id"
                class="meal-item__textarea__label"
              >
                Algum comentário?
              </label>
              <span>{{ currentOpenMealComment }} / 140</span>
            </div>
            <v-textarea
              :id="currentOpenMeal.id"
              v-model="form.comment"
              class="meal-item__textarea"
              auto-grow
              outlined
              placeholder="Ex: tirar a cebola, maionese à parte etc."
              rows="3"
              maxlength="140"
            />
          </div>
        </v-card-text>
        <v-card-actions class="meal-item-actions__container pa-4">
          <div class="meal-item-counter justify-start align-center">
            <v-btn
              icon
              color="red"
              class="meal-item-counter__btn"
              :disabled="form.mealAddToCartCounter === 1"
              @click="form.mealAddToCartCounter--"
            >
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            <div class="meal-item-counter__value">
              {{ form.mealAddToCartCounter }}
            </div>
            <v-btn
              icon
              color="red"
              class="meal-item-counter__btn"
              @click="form.mealAddToCartCounter++"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </div>
          <div class="meal-item-add">
            <v-btn
              large
              color="red"
              dark
              min-width="100%"
              class="meal-item-add__btn text-capitalize"
              :loading="form.loading"
              @click="addToCart"
            >
              <span>Adicionar</span>
              <span>R${{ currentOpenMealPrice }}</span>
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Home',
  data () {
    return {
      isOpenMeal: false,
      currentOpenMeal: {},
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
      ],
      meals: [
        {
          id: '1',
          label: 'Panqueca  de Carne ou Frango ao Molho Sugo',
          description: 'Description auhsdiashui dauhshd huaisuih dasuhi duhiasiuhd uhiasiuha sdiuhuihads hiuaiuhsd uhiasuih ',
          category: '1',
          price: 15.99
        },
        {
          id: '2',
          label: 'Frango com Páprica, Arroz Integral e Mix de Legumes',
          description: 'Description',
          category: '1',
          price: 16.00
        },
        {
          id: '3',
          label: 'Carne de Panela, Purê de Abóbora e Couve',
          description: 'Description',
          category: '1',
          price: 16.00
        },
        {
          id: '4',
          label: 'Strogonoff de Frango, Arroz Integral e Legumes',
          description: 'Description',
          category: '1',
          price: 16.00
        },
        {
          id: '5',
          label: 'Macarrão Integral á Bolonhesa',
          description: 'Description',
          category: '1',
          price: 16.00
        },
        {
          id: '6',
          label: 'Frango em Cubos com Creme de Milho, Batata Doce Assada e Mix de Legumes',
          description: 'Description',
          category: '1',
          price: 16.00
        },
        {
          id: '7',
          label: 'Caldo de Batata Baroa e Carne',
          description: 'Description',
          category: '2',
          price: 13.00
        },
        {
          id: '8',
          label: 'Caldo Verde com Frango',
          description: 'Description',
          category: '2',
          price: 13.00
        },
        {
          id: '9',
          label: 'Caldo de Abóbora e Frango',
          description: 'Description',
          category: '2',
          price: 13.00
        },
        {
          id: '10',
          label: 'Empadão de Frango',
          description: 'Description',
          category: '3',
          price: 14.00
        },
        {
          id: '11',
          label: 'Empadão de Frango com Catupiry',
          description: 'Description',
          category: '3',
          price: 16.00
        },
        {
          id: '12',
          label: 'Empadão de Frango com Palmito',
          description: 'Description',
          category: '3',
          price: 17.00
        }
      ],
      form: {
        comment: '',
        mealAddToCartCounter: 1,
        loading: false
      }
    }
  },
  computed: {
    currentOpenMealComment () {
      return this.currentOpenMeal.comment ? this.currentOpenMeal.comment.length : 0
    },
    currentOpenMealPrice () {
      return parseFloat(this.currentOpenMeal.price * this.form.mealAddToCartCounter).toFixed(2)
    },
    ...mapGetters('cart', ['quantity'])
  },
  methods: {
    ...mapActions('cart', ['dispatchAddToCart']),
    filteredMeals (categoryId) {
      return this.meals.filter(meal => meal.category === categoryId)
    },
    openMeal (meal) {
      this.form.loading = true
      this.currentOpenMeal = meal
      this.isOpenMeal = true
      this.form.loading = false
    },
    closeMeal () {
      this.form.loading = true
      this.isOpenMeal = false
      this.clearMealForm()
    },
    clearMealForm () {
      this.currentOpenMeal = {}
      this.form.comment = ''
      this.form.mealAddToCartCounter = 1
    },
    addToCart () {
      const item = {
        meal: this.currentOpenMeal,
        comment: this.form.comment,
        quantity: this.form.mealAddToCartCounter,
        priceTotal: this.currentOpenMealPrice
      }
      this.dispatchAddToCart(item)
      this.closeMeal()
    }
  }
}
</script>
<style lang="scss">
.lunchboxes-menu {
  max-width: 1366px !important;
  position: relative;
  margin: auto;
  &-item {
    &__row {
    }
    &__title {
      font-size: 1.5rem;
      font-weight: 500;
      letter-spacing: -1px;
      color: #3f3e3e;
    }
  }
  &-banner {
    position: relative;
    margin: auto;
    @media only screen and (min-width: 960px) {
      padding: 25px 30px 0;
    }
    @media only screen and (min-width: 1248px) {
      padding: 35px 30px 0;
      max-width: 1366px;
    }
    &__wrapper {
      display: flex;
      //position: fixed;
      flex-direction: row;
      align-items: center;
      width: 100%;
      color: #f7f7f7;
      height: 118px;
      top: 0;
      left: 0;
      background-size: cover;
      background-position: center center;
      justify-content: center;
      @media only screen and (min-width: 768px) {
        height: 200px;
      }
      @media only screen and (min-width: 960px) {
        border-radius: 4px;
        height: 250px;
        position: relative;
        justify-content: unset;
      }
      @media only screen and (min-width: 1248px) {
        padding-left: 30px;
      }
      &--has-status {
        background-color: rgba(0, 0, 0, 0.7);
        background-blend-mode: overlay;
      }
      &:not(&__wrapper--has-status) {
        background-color: rgba(0, 0, 0, 0.2);
        background-blend-mode: overlay;
      }
    }

    &__status-icon {
      height: 42px;
      width: 42px;
      border-radius: 100%;
      margin: 20px;
      display: none;
      border: 1px solid #f7f7f7;
      svg {
        color: #f7f7f7;
        fill: #f7f7f7;
      }
      @media only screen and (min-width: 960px) {
        height: 70px;
        width: 70px;
        margin: 30px;
        display: unset;
      }
    }

    &__status-title {
      color: #f7f7f7;
      font-size: 16px;
      font-weight: 400;
      line-height: 20px;
      text-align: center;
      margin: 0;
      margin-bottom: 4px;
      @media only screen and (min-width: 768px) {
        font-size: 25px;
        margin-bottom: 16px;
      }
      @media only screen and (min-width: 960px) {
        text-align: left;
      }
    }

    &__status-message {
      color: #f7f7f7;
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      text-align: center;
      margin: 0;
      @media only screen and (min-width: 768px) {
        font-size: 20px;
      }
      @media only screen and (min-width: 960px) {
        text-align: left;
      }
      &--has-action {
        cursor: pointer;
        background-color: unset;
        border: unset;
      }
    }
  }
}

.meal {
  &-item {
    &-nav {
      &-header {
        &__title {
          font-size: 0.75rem;
          font-weight: 500;
          left: 0;
          margin: 0;
          padding: 2px 20% 0 15%;
          text-align: center;
          text-transform: uppercase;
          width: 100%;
          z-index: 0;
          color: #3e3e3e;
          line-height: 1rem;
          @media only screen and (min-width: 768px) {
            font-size: 1rem;
            line-height: 1.5rem;
          }
        }
      }
    }
    &__button:hover {
      cursor: pointer;
    }
    &__title {
      font-family: "SulSans", Helvetica, sans-serif;
      color: #000000 !important;
      font-weight: 400;
      letter-spacing: 0;
      line-height: 1.2rem !important;
      @media only screen and (min-width: 768px) {
        font-size: 1.125rem;
        line-height: 1.5rem;
      }
    }
    &__serves {
      font-size: 0.875rem;
      line-height: 1rem;
      color: #000000 !important;
      font-weight: 500;
    }
    &__price {
      font-size: 1rem;
      line-height: 1.25rem;
      font-weight: 400;
      color: #3e3e3e;
      padding: 0 0 16px 16px;
      &--discount {
        color: #50a773;
      }
    }
    &__textarea {
      line-height: 1 !important;
      font-size: 1rem;
      &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        > span {
          color: #a6a6a6;
          font-weight: 400;
          font-size: 0.775rem;
        }
      }
      &__label {
        font-size: 0.9rem;
        font-weight: 500;
        color: #717171;
      }
    }
    &-actions {
      &__container {
        border-top: 2px solid #f5f0eb;
        padding: 20px 20px;
      }
    }
    &-counter {
      display: inline-flex;
      border: 1px solid #dcdcdc;
      border-radius: 4px;
      margin-right: 10px;
      height: 46px;
      &__btn {
        height: 30px;
        width: 30px;
      }
      &__value {
        min-width: 35px;
        text-align: center;
        font-size: 1.125rem;
        font-weight: 500;
        margin: 3px 0;
      }
    }
    &-add {
      width: 100%;
      &__btn {
        align-items: center;
        display: flex;
        justify-content: space-between;
        width: 100%;
        font-weight: 500;
        letter-spacing: 0;
      }
    }
  }
}

.v-application--is-ltr {
  .v-textarea.v-text-field--enclosed {
    .v-text-field__slot {
      > textarea {
        line-height: 1.2rem !important;
        color: #717171 !important;
      }
    }
  }
}

.disable-events {
  pointer-events: none;
  opacity: 0.4;
}
</style>
