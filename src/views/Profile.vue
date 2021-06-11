<template>
  <div>
    <div class="page-title">
      <h3>Профиль</h3>
    </div>

    <form class="form" @submit.prevent="submitHandler">

      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model.trim="name"
          :class="{invalid: $v.name.$dirty && !$v.name.required}"
        >
        <label for="description">Имя</label>
        <span 
          class="helper-text invalid"
          v-if="$v.name.$dirty && !$v.name.required"
        >Поле не должно быть пустым</span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        Обновить
        <i class="material-icons right">send</i>
      </button>

    </form>
  </div>
</template>

<script>
import {required} from 'vuelidate/lib/validators'

export default {
  data: () => ({
    name: ''
  }),
  validations: {
    name: {required}
  },
  mounted() {
    M.updateTextFields()
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      try {
        await this.$store.dispatch('updateInfo', {name: this.name})
      } catch (e) {}

      this.name = ''
      this.$v.name.$reset()
      

      this.$message('Выполнено')
    }
  }
}
</script>