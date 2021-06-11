<template>
  <div>
    <div class="page-title">
      <h3>Новая запись</h3>
    </div>

    <Loader v-if="loading" />

    <p class="center" v-else-if="!categories.length">
      Пока нет категорий для новых записей <br>
      <router-link to="/categories">Добавить категории</router-link>
    </p>

    <form class="form" v-else @submit.prevent="submitHandler">
      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="outcome"
            v-model="type"
          />
          <span>Расход</span>
        </label>
      </p>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="income"
            v-model="type"
          />
          <span>Доход</span>
        </label>
      </p>

      <div class="input-field select-field" v-show="this.type === 'outcome'">
        <select ref="selectOutcome" v-model="selectedCategoryOutcome">
          <option
            v-for="c in categoriesOutcome"
            :key="c.id"
            :value="c.id"
          >{{c.title}}</option>
        </select>
        <label>Выберите категорию</label>
      </div>

      <div class="input-field select-field" v-show="this.type === 'income'">
        <select ref="selectIncome" v-model="selectedCategoryIncome">
          <option
            v-for="c in categoriesIncome"
            :key="c.id"
            :value="c.id"
          >{{c.title}}</option>
        </select>
        <label>Выберите категорию</label>
      </div>

      <div class="input-field">
        <input
          id="amount"
          type="number"
          v-model.number="amount"
          :class="{invalid: $v.amount.$dirty && !$v.amount.required || $v.amount.$dirty && !$v.amount.minValue}"
        >
        <label for="amount">Сумма</label>
        <span
          class="helper-text invalid"
          v-if="$v.amount.$dirty && !$v.amount.required"
        >Укажите сумму</span>
        <span
          class="helper-text invalid"
          v-else-if="$v.amount.$dirty && !$v.amount.minValue"
        >Значение должно быть больше 0</span>
      </div>

      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="description"
          :class="{invalid: $v.description.$dirty && !$v.description.required}"
        >
        <label for="description">Описание</label>
        <span
          class="helper-text invalid"
          v-if="$v.description.$dirty && !$v.description.required"
        >Введите описание</span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        Создать
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import Loader from '../components/app/Loader.vue'
import {required, minValue} from 'vuelidate/lib/validators'
import {mapGetters} from 'vuex'

export default {
  components: { Loader },
  name: 'record',
  data: () => ({
    loading: true,
    categories: [],
    categoriesOutcome: [],
    categoriesIncome: [],
    selectOutcome: null,
    selectIncome: null,
    selectedCategoryOutcome: null,
    selectedCategoryIncome: null,
    type: 'outcome',
    amount: null,
    description: ''
  }),
  validations: {
    amount: {required, minValue: minValue(1)},
    description: {required}
  },
  computed: {
    ...mapGetters(['info']),
    canCreateRecord() {
      if (this.type === 'income') {
        return true
      }

      return this.info.bill >= this.amount
    }
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      if (this.type === 'income') {
        if (this.selectedCategoryIncome === null) {
          this.$message('Выберите категорию (если категорий нет в списке, то создайте их)')
          return
        }
      }

      if (this.type === 'outcome') {
        if (this.selectedCategoryOutcome === null) {
          this.$message('Выберите категорию (если категорий нет в списке, то создайте их)')
          return
        }
      }

      if (this.canCreateRecord) {
        try {
          await this.$store.dispatch('createRecord', {
            categoryId: this.type === 'outcome' ? this.selectedCategoryOutcome : this.selectedCategoryIncome,
            amount: this.amount,
            description: this.description,
            type: this.type,
            date: new Date().toJSON()
          })
          const bill = this.type === 'income'
            ? this.info.bill + this.amount
            : this.info.bill - this.amount

          await this.$store.dispatch('updateInfo', {bill})
          this.$message('Запись создана, состояние счета обновлено')

          this.$v.$reset()
          this.amount = null,
          this.description = ''
        } catch (e) {}

      } else {
        this.$message(`Недостаточно средств (сейчас на счете: ${this.info.bill} рублей)`)
      }
    }
  },
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories')
    this.loading = false

    this.categoriesOutcome = this.categories.filter(c => c.type === 'outcome')
    this.categoriesIncome = this.categories.filter(c => c.type === 'income')

    if (this.categoriesOutcome.length) {
      this.selectedCategoryOutcome = this.categoriesOutcome[0].id
    }
    if (this.categoriesIncome.length) {
      this.selectedCategoryIncome = this.categoriesIncome[0].id
    }

    setTimeout(() => {
      this.selectOutcome = M.FormSelect.init(this.$refs.selectOutcome)
    }, 0)
    setTimeout(() => {
      this.selectIncome = M.FormSelect.init(this.$refs.selectIncome)
    }, 0)
  },
  destroyed() {
    if (this.selectOutcome && this.selectOutcome.destroy) {
      this.selectOutcome.destroy()
    }
    if (this.selectIncome && this.selectIncome.destroy) {
      this.selectIncome.destroy()
    }
  }
}
</script>

<style lang="scss" scoped>
.select-field {
  margin-top: 2.3rem;
}
</style>