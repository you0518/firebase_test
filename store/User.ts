import firebase from 'firebase/app'
import { MutationTree, ActionTree, GetterTree } from 'vuex'
import { cloneDeep } from 'lodash'

export interface State {
  user: firebase.User | null
}

export const state = (): State => ({
  user: null
})

export const mutations: MutationTree<State> = {
  setUser(state, record: firebase.User) {
    state.user = cloneDeep(record)
  }
}

export const actions: ActionTree<State, any> = {
  async setUser({ commit }, record: firebase.User | null) {
    if (record) {
      const token = await firebase.messaging().getToken()
      firebase
        .firestore()
        .collection('users')
        .doc(record.uid)
        .set({
          token,
          createAt: new Date()
        })
    }
    commit('setUser', record)
  }
}

export const getters: GetterTree<State, any> = {
  user: (state) => state.user
}
