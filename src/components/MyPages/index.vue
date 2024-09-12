<template>
  <div class="page-container">
    <div class="left">
      {{
        `${_t('共')}${$props.total}${_t('条记录')} ${_t('当前第')}${
          $props.curPage
        }${_t('页')} ${_t('共')}${totalPage}${_t('页')} ${_t(
          '每页'
        )}${pageSize}${_t('条记录')}`
      }}
    </div>
    <div class="right">
      <div class="information-pagination">
        <el-pagination
          layout="prev, pager, next"
          :total="Number($props.total)"
          v-model:current-page="$props.curPage"
          size="small"
          :page-size="pageSize"
          @current-change="onCurrentChange"
        />
      </div>
      <div class="numb">
        {{ _t('第') }}
        <el-input-number
          @change="jump('jump')"
          :min="1"
          :controls="false"
          v-model="tempCurPage"
          controls-position="right"
          style="width: 58px; height: 30px"
        />
        {{ _t('页') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from 'vue'
import { _t } from '@/libs/Language/Language'

export default defineComponent({
  name: 'MyPages',
  props: {
    total: {
      type: Number,
      required: true,
    },
    curPage: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const tempCurPage = ref<number>(1)
    const pageSize = ref<number>(50)
    const totalPage = computed(() => {
      return parseInt(
        String((props.total + pageSize.value - 1) / pageSize.value)
      )
    })
    watch(
      () => props.curPage,
      (val: number) => {
        console.log('val545545', val)
        tempCurPage.value = val
      }
    )

    const onCurrentChange = (current: number) => {
      tempCurPage.value = current
      emit('req', current)
    }

    const jump = (flag: string) => {
      if (flag === 'first') {
        if (props.curPage == 1) {
          tempCurPage.value = props.curPage
          return
        }
        emit('req', 1)
        return
      }
      if (flag === 'last') {
        if (props.curPage == totalPage.value) {
          tempCurPage.value = props.curPage
          return
        }
        emit('req', totalPage.value)
        return
      }
      if (flag === 'prev') {
        if (props.curPage <= 1) {
          tempCurPage.value = props.curPage
          return
        }
        emit('req', props.curPage - 1)
        return
      }
      if (flag === 'next') {
        if (props.curPage >= totalPage.value) {
          tempCurPage.value = props.curPage
          return
        }
        emit('req', Number(props.curPage) + 1)
        return
      }
      emit('req', tempCurPage.value)
    }

    return {
      tempCurPage,
      pageSize,
      totalPage,
      _t,
      onCurrentChange,
      jump,
    }
  },
})
</script>

<style lang="scss" scoped>
.page-container {
  height: 100%;
  width: 100%;
  position: relative;
  color: #333333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 0 16px;
  box-sizing: border-box;

  .right {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .input {
      margin: 0 10px;
      display: inline-block;
      margin-right: 5px;
    }

    .btn {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ecf0f9;
      border-radius: 4px;
      margin-left: 10px;
      cursor: pointer;

      img {
        width: 6px;
        height: 12px;
      }
    }
  }
}

.nopage {
  cursor: not-allowed;
}
</style>
