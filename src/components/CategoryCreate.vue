<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>Создать</h4>
      </div>

      <form @submit.prevent="submitHandler">
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

        <div class="input-field">
          <input
              id="name"
              type="text"
              v-model="title"
              :class="{invalid: $v.title.$dirty && !$v.title.required}"
          >
          <label for="name">Название</label>
          <span 
            class="helper-text invalid"
            v-if="$v.title.$dirty && !$v.title.required"
          >
            Введите название категории
          </span>
        </div>

        <div class="input-field" v-if="type === 'outcome'">
          <input
            id="limit"
            type="number"
            v-model.number="limit"
            :class="{invalid: $v.limit.$dirty && !$v.limit.required || $v.limit.$dirty && !$v.limit.minValue}"
          >
          <label for="limit">Лимит</label>
          <span 
            class="helper-text invalid"
            v-if="$v.limit.$dirty && !$v.limit.required"
          >
            Укажите лимит для категории
          </span>
          <span 
            class="helper-text invalid"
            v-else-if="$v.limit.$dirty && !$v.limit.minValue"
          >
            Лимит не должен быть меньше {{ $v.limit.$params.minValue.min }}
          </span>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          Создать
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import {required, minValue} from 'vuelidate/lib/validators'

export default {
  name: 'CategoryCreate',
  data: () => ({
    title: '',
    limit: null,
    type: 'outcome'
  }),
  validations: {
    title: {required},
    limit: {required, minValue: minValue(1)}
  },
  mounted() {
    M.updateTextFields()
  },
  methods: {
    async submitHandler() {
      if (this.type === 'income') {
        if (this.$v.title.$invalid) {
          this.$v.$touch()
          return
        }
      } else {
        if (this.$v.$invalid) {
          this.$v.$touch()
          return
        }
      }

      try {
        const category = await this.$store.dispatch('createCategory', {
          title: this.title,
          limit: this.limit,
          type: this.type
        })
        this.title = ''
        this.limit = null
        this.$v.$reset()
        this.$message('Категория успешно создана')
        this.$emit('created', category)
      } catch (e) {}
    }
  }
}
</script>