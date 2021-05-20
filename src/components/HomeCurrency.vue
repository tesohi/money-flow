<template>
  <div class="col s12 m6 l8">
    <div class="card green bill-card">
      <div class="card-content white-text">
        <div class="card-header">
          <span class="card-title">Курс валют</span>
        </div>
        <table>
          <thead>
          <tr>
            <th>Валюта</th>
            <th>Курс</th>
            <th>Дата</th>
          </tr>
          </thead>

          <tbody>
            <tr v-for="cur in currencies" :key="cur">
              <td>{{ cur }}</td>
              <td>{{ rates[cur] }}</td>
              <td>{{ date | date('date') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['valute', 'date'],
  Data: () => ({
    rates: {},
    currencies: ['USD', 'EUR']
  }),
  created() {
    this.rates = {
      RUB: 1,
      USD: this.valute['USD'].Value,
      EUR: this.valute['EUR'].Value
    }
    this.currencies = ['USD', 'EUR']
  },
  methods: {
    getCurrency(currency) {
      return this.rates[currency]
    }
  }
}
</script>