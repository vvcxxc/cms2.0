<template>
    <div class="tipsPop">
        <div class="myDialog" id="myDialog">
            <div class="popHeader">
                <span>{{ _t('提示') }}</span>
            </div>
            <div class="popContent">
                {{ tipText }}
            </div>
            <div v-if="noCancel" class="popBtn">
                <div class="myBtn1" @click="handleClick('no')">{{ _t('确定') }}</div>
            </div>
            <div class="popBtn" v-else>
                <div class="myBtn1 myBtn2" @click="handleClick('no')">
                    {{ _t('取消') }}
                </div>
                <div class="myBtn1" @click="handleClick('yes')">{{ _t('确定') }}</div>
            </div>
        </div>
    </div>
</template>

<script   lang="ts">
import { defineComponent } from 'vue'
import sdk from 'sdk'
const { models } = sdk;
const { Language } = models
const { _t } = Language
export default defineComponent({
    name: 'TipPop',
    props: {
        tipText: {
            type: String,
            required: true,
        },
        noCancel: {
            type: Boolean,
            default: '',
        },
    },
    setup() {
        const emit = defineEmits(['tipCallBack'])
        const handleClick = (str: string) => {
            emit('tipCallBack', str)
        }
        return { _t, handleClick }
    }
})
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
        width: 381px;
        height: fit-content;
        min-height: 200px;
        top: 40%;
        transform: translateY(-50%);
        margin: auto;
        background: #FBFBFB;
        box-shadow: 0px 0px 21px rgba(45, 46, 46, 0.43);

        .popHeader {
            padding-left: 7px;
            box-sizing: border-box;
            width: 381px;
            height: 40px;
            background: #EDEFF0;
            color: #35363B;
            line-height: 40px;
        }

        .popContent {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: fit-content;
            min-height: 110px;
            padding: 30px;
            word-break: break-word;
            color: #666666;
            text-align: center;
            box-sizing: border-box;
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

            .myBtn1 {
                width: 98px;
                height: 26px;
                line-height: 26px;
                text-align: center;
                background: #5A84FF;
                color: #fff;
                border-radius: 3px;
                cursor: pointer;
            }

            .myBtn2 {
                background: #e0e0e0;
                color: #666666;
                margin-right: 10px;
            }
        }
    }
}
</style>