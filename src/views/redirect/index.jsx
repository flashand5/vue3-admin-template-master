export default defineComponent({
  // setup函数是处于 生命周期函数 beforeCreate 和 Created 两个钩子函数之间的函数
  setup() {
    const route = useRoute()
    const router = useRouter()
    onBeforeMount(() => {
      const { params, query } = route
      const { path } = params
      router.replace({ path: '/' + path, query })
    })
    return () => <div> </div>
  }
})
