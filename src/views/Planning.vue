<template>
  <div>
    <div class="page-title">
      <h3>Планирование</h3>
      <h4>{{info.bill | currency('RUB')}}</h4>
    </div>

    <Loader v-if="loading" />

    <p class="center" v-else-if="!categories.length">
      Категорий пока нет <br>
      <router-link to="/categories">Добавить категории</router-link>
    </p>

    <section v-else>
      <div v-for="cat in categories" :key="cat.id">
        <p v-tooltip="cat.tooltip">
          <strong>{{cat.title}}:</strong>
          {{cat.spent | currency}} из {{cat.limit | currency}}
        </p>
        <div class="progress">
          <div
              class="determinate"
              :class="cat.progressColor"
              :style="{width: cat.progressPercent + '%'}"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import currencyFilter from '@/filters/currency.filter'

export default {
  name: 'planning',
  data: () => ({
    loading: true,
    categories: []
  }),
  computed: {
    ...mapGetters(['info'])
  },
  async mounted() {
    const records = await this.$store.dispatch('fetchRecords')
    const allCategories = await this.$store.dispatch('fetchCategories')

    this.categories = allCategories.map(cat => {
      const spent = records
        .filter(r => r.categoryId === cat.id)
        .reduce((total, record) => {
          return total += +record.amount
        }, 0)
      
      const percent = 100 * spent / cat.limit
      const progressPercent = percent > 100 ? 100 : percent
      const progressColor = percent < 60
        ? 'green'
        : percent < 100
          ? 'yellow'
          : 'red'

      const tooltipValue = cat.limit - spent
      const tooltip = `${tooltipValue < 0 ? 'Превышение на' : 'Осталось'} ${currencyFilter(Math.abs(tooltipValue))}`

      return {
        ...cat,
        progressPercent,
        progressColor,
        spent,
        tooltip
      }
    })
    this.categories = this.categories.filter(c => c.type === 'outcome')

    this.loading = false
  }
}
</script>