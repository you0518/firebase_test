import firebase from 'firebase/app'
import { MutationTree, ActionTree, GetterTree } from 'vuex'
import { cloneDeep, uniqueId } from 'lodash'
import contentBase, { Content } from '~/entity/Content'
export interface State {
  records: Content[]
}

export const state = (): State => ({
  records: []
})

export const mutations: MutationTree<State> = {
  set(state, payload: Content[]) {
    const newValue = cloneDeep(payload)
    state.records = newValue
  },
  add(state, payload: Content) {
    const newValue = cloneDeep(payload)
    state.records.push(newValue)
  }
}

export const actions: ActionTree<State, any> = {
  async getList({ commit }) {
    const result = await firebase
      .firestore()
      .collection('contents')
      .get()
    if (result.empty) {
      return Promise.reject(new Error('empty'))
    }
    const records = await Promise.all(
      result.docs.map(async (record) => {
        const content = contentBase.fromObject(record.data())
        content.downloadUrl = await firebase
          .storage()
          .ref(content.name)
          .getDownloadURL()
        return content
      })
    )
    commit('set', records)
  },

  async get({ commit }, payload: { uid: string; name: string }) {
    const content = contentBase.makeEntity({ ...payload })
    content.downloadUrl = await firebase
      .storage()
      .ref(content.name)
      .getDownloadURL()

    commit('add', content)
  },

  async create(_, payload: { uid: string; file: File }) {
    const storage = firebase.storage()
    const result = await storage
      .ref('contents')
      .child(payload.uid)
      .child(uniqueId())
      .put(payload.file)

    return result
  }
}

export const getters: GetterTree<State, any> = {
  records: (state) => cloneDeep(state.records),
  filter: (state) => (uid: string) =>
    cloneDeep(state.records.filter((record) => record.uid === uid))
}
