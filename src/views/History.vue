<template>
  <div>
    <div class="page-title">
      <h3>История записей</h3>
    </div>

    <!-- <div class="history-chart">
      <canvas ref="canvas"></canvas>
    </div> -->

    <Loader v-if="loading" />

    <p class="center" v-else-if="!records.length">
      Записей пока нет <br>
      <router-link to="/record">Добавить запись</router-link>
    </p>

    <section v-else>
      <HistoryTable :records="records" />
    </section>
  </div>
</template>

<script>
import HistoryTable from '@/components/HistoryTable'
import { Pie } from 'vue-chartjs'

export default {
  name: 'history',
  extends: Pie,
  data: () => ({
    loading: true,
    records: []
  }),
  async mounted() {
    const baseRecords = await this.$store.dispatch('fetchRecords')
    const categories = await this.$store.dispatch('fetchCategories')
    
    /* const categoriesOutcome = categories.filter(c => c.type === 'outcome')
    const categoriesIncome = categories.filter(c => c.type === 'income') */

    this.records = baseRecords.map(record => {
      return {
        ...record,
        categoryName: categories.find(c => c.id === record.categoryId).title,
        typeClass: record.type === 'income' ? 'green' : 'red',
        typeText: record.type === 'income' ? 'Доход' : 'Расход',
      }
    })

    /* if (categoriesOutcome.length > 1) {
      this.renderChart({
        labels: categoriesOutcome.map(c => c.title),
        datasets: [{
          label: 'Расходы',
          data: categoriesOutcome.map(c => {
            return this.records.reduce((total, r) => {
              if (r.categoryId === c.id) {
                total += +r.amount
              }
              return total
            })
          }),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      })
    }

    if (categoriesIncome.length > 1) {
      this.renderChart({
        labels: categoriesIncome.map(c => c.title),
        datasets: [{
          label: 'Доходы',
          data: categoriesIncome.map(c => {
            return this.records.reduce((total, r) => {
              if (r.categoryId === c.id) {
                total += +r.amount
              }
              return total
            })
          }),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      })
    }

    debugger */

    this.loading = false
  },
  components: {
    HistoryTable
  }
}
</script>