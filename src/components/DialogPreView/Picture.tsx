import {
  PropType,
  SetupContext,
  computed,
  defineComponent,
  nextTick,
  onMounted,
  ref,
} from 'vue'
export default defineComponent({
  name: '图片',
  props: {
    picList: {
      type: Object as PropType<string[]>,
      default: () => [],
    },
    height: {
      type: String,
      default: '578px',
    },
  },
  setup(props, { attrs }: SetupContext) {
    onMounted(async () => {})
    const arrow = computed(() => {
      return props.picList.length > 2 ? 'always' : 'never'
    })
    return () => (
      <el-carousel height={props.height} arrow={arrow.value}>
        {props.picList.map((item) => {
          return (
            <el-carousel-item>
              <el-image
                style="width: 100%; height: 100%"
                src={item}
                fit="contain"
              />
            </el-carousel-item>
          )
        })}
      </el-carousel>
    )
  },
})
