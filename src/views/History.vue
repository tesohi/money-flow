<template>
  <div>
    <div class="page-title">
      <h3>История записей</h3>
    </div>

    <div class="center row">
      <div class="col s6">
        <pie-chart :data="chartDataIncome" class="center"></pie-chart>
      </div>
      <div class="col s6">
        <pie-chart :data="chartDataOutcome" class="center"></pie-chart>
      </div>
    </div>
    
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

export default {
  name: 'history',
  data: () => ({
    loading: true,
    records: [],
    chartDataIncome: [],
    chartDataOutcome: []
  }),
  async mounted() {
    const baseRecords = await this.$store.dispatch('fetchRecords')
    const categories = await this.$store.dispatch('fetchCategories')
    
    const categoriesIncome = categories.filter(c => c.type === 'income')
    const categoriesOutcome = categories.filter(c => c.type === 'outcome')

    this.chartDataIncome = categoriesIncome.map(c => {
      const spent = baseRecords
        .filter(r => r.categoryId === c.id)
        .reduce((total, record) => {
          return total += +record.amount
        }, 0)

      return [c.title, spent]
    })

    this.chartDataOutcome = categoriesOutcome.map(c => {
      const spent = baseRecords
        .filter(r => r.categoryId === c.id)
        .reduce((total, record) => {
          return total += +record.amount
        }, 0)

      return [c.title, spent]
    })

    this.records = baseRecords.map(record => {
      return {
        ...record,
        categoryName: categories.find(c => c.id === record.categoryId).title,
        typeClass: record.type === 'income' ? 'green' : 'red',
        typeText: record.type === 'income' ? 'Доход' : 'Расход',
      }
    })

    this.loading = false
  },
  components: {
    HistoryTable
  }
}
</script>