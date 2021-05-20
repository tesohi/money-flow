<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>Редактировать</h4>
      </div>

      <form @submit.prevent="submitHandler">
       <div class="input-field" >
          <select v-model="current" ref="select">
            <option
              v-for="c in categories"
              :key="c.id"
              :value="c.id"
            >{{c.title}}</option>
          </select>
          <label>Выберите категорию</label>
        </div>

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
          Обновить
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import {required, minValue} from 'vuelidate/lib/validators'

export default {
  name: 'CategoryEdit',
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    select: null,
    current: null,
    title: '',
    limit: null,
    type: 'outcome'
  }),
  validations: {
    title: {required},
    limit: {required, minValue: minValue(1)} 
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
        const categoryData = {
          id: this.current,
          title: this.title,
          limit: this.limit,
          type: this.type,
        }
        await this.$store.dispatch('updateCategory', categoryData)
        this.$message('Категория обновлена')
        this.$emit('updated', categoryData)
      } catch (e) {}
    }
  },
  watch: {
    current(categoryId) {
      const {id, title, limit, type} = this.categories.find(c => c.id === categoryId)
      this.title = title
      this.limit = limit
      this.type = type
      setTimeout(() => {
        M.updateTextFields()
      }, 0)
    }
  },
  created() {
    const {id, title, limit, type} = this.categories[0]
    this.current = id,
    this.title = title,
    this.limit = limit,
    this.type = type
  },
  mounted() {
    this.select = M.FormSelect.init(this.$refs.select)
    M.updateTextFields()
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
  }
}
</script>