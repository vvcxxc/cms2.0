import { defineComponent, onMounted, ref, Ref } from 'vue'
import sdk from 'sdk'
const { request } = sdk.utils
import { _t, Language } from '@/libs/Language/Language'
export default defineComponent({
  name: 'Language',
  props: {
    language: String,
  },
  setup(props) {
    const options: Ref<any[]> = ref([])
    const langValue = ref()
    const getOptions = async () => {
      const resp = await request.get(`/api/v1/multiplelanguage/languagelist`)
      const defaultOptions = [
        {
          id: 0,
          languageType: 'auto',
          enable: true,
          createDateTime: new Date().toDateString(),
          name: '跟随系统',
        },
      ]

      defaultOptions.unshift({
        id: 0,
        languageType: 'original',
        enable: true,
        createDateTime: new Date().toDateString(),
        name: '原始文本',
      })

      options.value.push(...defaultOptions, ...resp)
      langValue.value = options.value?.[0]?.languageType
    }

    onMounted(getOptions)
    const change = (val: any) => {
      window.app.current.project.current.language = new Language({
        lang: langValue.value,
        running: true,
      })
    }
    return () => (
      <select v-model={langValue.value} style="width: 150px;" onChange={change}>
        {options.value.map((item) => {
          return (
            <option
              key={item.id}
              label={_t(item.name)}
              value={item.languageType}
            ></option>
          )
        })}
      </select>
    )
  },
})
