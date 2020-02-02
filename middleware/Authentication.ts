import { Middleware } from '@nuxt/types'
import firebase from 'firebase/app'

const middleWare: Middleware = ({ store, route, redirect }) => {
  const user: firebase.User = store.getters['User/user']
  console.log('user', user)

  if (!user) {
    if (route.name !== 'login') {
      redirect('/login')
    }
  } else if (route.name === 'login') {
    console.log('user')
    redirect('/')
  }
}

export default middleWare
