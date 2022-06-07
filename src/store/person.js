// 定义 Store
import { defineStore } from 'pinia'
import {getPersonReq} from "@/api/person"

export const usePersonStore = defineStore('person', {
  // 这里存数据，类似data
  state: () => {
    return {
      personId: '',
      personName: '',
      personStatus: ''
    }
  },
// 这里存方法
  actions: {
    M_personId(personId) {
      this.$patch((state) => {
        state.personId = personId
      })
    },
    M_personName(personName) {
      this.$patch((state) => {
        state.personName = personName
      })
    },
    M_personStatus(personStatus) {
      this.$patch((state) => {
        state.personStatus = personStatus
      })
    },
    // 获取员工
    getPerson(data) {
      return new Promise((resolve, reject) => {
        getPersonReq(data)
          .then((response) => {
            const { data } = response
            if (!data) {
              return reject('未能获取到员工信息')
            }
            const { personId, personName, personStatus } = data
            this.M_personId(personId)
            this.M_personName(personName)
            this.M_personStatus(personStatus)
            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  }
})
