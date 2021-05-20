import firebase from 'firebase/app'

export default {
  actions: {
    async fetchCategories({commit, dispatch}) {
      try {
        const uid = await dispatch('getUid')
        const categoriesObj = (await firebase.database().ref(`/users/${uid}/categories`).once('value')).val() || {}
        const categoriesArr = []

        for (let key in categoriesObj) {
          categoriesArr.unshift({...categoriesObj[key], id: key})
        }
        
        return categoriesArr
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async createCategory({commit, dispatch}, {title, limit, type}) {
      try {
        const uid = await dispatch('getUid')
        const category = await firebase.database().ref(`/users/${uid}/categories`).push({title, limit, type})
        return {title, limit, type, id: category.key}
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async updateCategory({commit, dispatch}, {id, title, limit}) {
      try {
        const uid = await dispatch('getUid')
        await firebase.database().ref(`/users/${uid}/categories`).child(id).update({title, limit})
      } catch (e) {
        commit('setError', e)
        throw e
      }
    }
  }
}