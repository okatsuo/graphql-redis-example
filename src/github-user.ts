import axios from 'axios'
import { cache } from './redis'

class GithubUser {
  async getByUsername(username: string) {
    const user = await cache.getOrSetCache({
      key: `user:${username}`,
      callback: async () => await (await axios.get(`https://api.github.com/users/${username}`)).data
    })
    return user
  }
}

export const githubUser = new GithubUser()