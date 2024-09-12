import { computed, defineComponent } from 'vue'
export default defineComponent({
  name: '图标',
  props: {
    icon: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 12,
    },
    height: {
      type: Number,
      default: 12,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
    cursor: {
      type: String,
      default: '',
    },
  },
  emits: ['click'],
  setup(props, { attrs, slots, emit }) {
    const imgUrl = computed(() => {
      const imgName = props.icon
      return new URL(`../../assets/images/${imgName}.png`, import.meta.url).href
    })

    return () => {
      return (
        <img
          onClick={(evt: Event) => emit('click', evt)}
          width={props.width}
          height={props.height}
          src={imgUrl.value}
          style={{ cursor: props.cursor }}
          {...attrs}
        />
      )
    }
  },
})
