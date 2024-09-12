<template>
  <div class="tipsPop">
    <div class="myDialog" id="myDialog">
      <div class="popHeader">
        <span class="iconfont icon-tishi2"></span>
        <span>{{ _t('提示') }}</span>
      </div>
      <div class="popContent">
        <div v-if="tipTextIcon" :class="`iconfont icon-${tipTextIcon}`"></div>
        <div v-html="tipText"></div>
      </div>
      <div v-if="props.noCancel" class="popBtn">
        <div class="myBtn myBtn2" @click="handleClick('cancel')">{{ _t('确定') }}</div>
      </div>
      <div class="popBtn" v-else>
        <div class="myBtn myBtn1" @click="handleClick('cancel')">
          {{ _t('取消') }}
        </div>
        <div class="myBtn myBtn2" @click="handleClick('confirm')">{{ _t('确定') }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import sdk from 'sdk'
const { models } = sdk
const { Language } = models
const { _t } = Language
const props = defineProps({
  tipText: {
    type: String,
    required: true,
  },
  tipTextIcon: {
    type: String,
    default: '',
  },
  noCancel: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['tipCallBack'])

const handleClick = (str: string) => {
  emit('tipCallBack', str)
}
</script>

<style lang="scss" scoped>
.tipsPop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 101;

  .myDialog {
    position: relative;
    width: 440px;
    height: fit-content;
    min-height: 200px;
    top: 40%;
    transform: translateY(-50%);
    margin: auto;
    background: #fbfbfb;
    box-shadow: 0px 0px 21px rgba(45, 46, 46, 0.43);
    border-radius: 6px;

    .popHeader {
      display: flex;
      justify-items: flex-start;
      padding-left: 15px;
      box-sizing: border-box;
      color: #35363b;
      line-height: 42px;
      width: 100%;
      height: 42px;
      background: #edeff0;
      border-radius: 6px 6px 0px 0px;
      opacity: 1;
      font-size: 15px;
      font-family: PingFang SC-Bold, PingFang SC;
      font-weight: bold;

      .iconfont {
        margin-right: 10px;
        font-size: 20px;
        color: #bebebe;
      }
    }

    .popContent {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 78%;
      margin: auto;
      height: fit-content;
      min-height: 110px;
      padding: 30px;
      word-break: break-word;
      text-align: left;
      box-sizing: border-box;
      font-size: 16px;
      font-family: PingFang SC-Regular, PingFang SC;
      color: #333333;

      .iconfont {
        margin-right: 10px;
        font-size: 45px;
        color: #ff5a5a;
      }
    }

    .popBtn {
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      padding-right: 16px;
      padding-bottom: 16px;
      box-sizing: border-box;
      height: 50px;
      font-size: 16px;
      .myBtn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 98px;
        height: 26px;
        border-radius: 3px 3px 3px 3px;
        font-size: 14px;
        font-family: PingFang SC-Regular, PingFang SC;
        color: #666666;
        cursor: pointer;

        &:hover {
          opacity: 0.8;
        }
      }
      .myBtn1 {
        margin-right: 10px;
        color: #666666;
        background: #efeded;
        border: 1px solid #cccccd;
      }

      .myBtn2 {
        color: #ffffff;
        background: #5a84ff;
      }
    }
  }
}
</style>
