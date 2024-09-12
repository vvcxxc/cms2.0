<template>
    <div class="d_Button" @click="handleclick">
        <div :class="{
            'd_btn': true,
            'sumbitButton': type == 'sumbit',
            'delButton': type == 'del',
        }" v-if="type && (type == 'sumbit' || type == 'del')">
            {{ text }}
        </div>
        <div class="d_btn editButton" v-else :style="{
            'color': type == 'fill' ? '#fff' : color,
            'backgroundColor': type != 'fill' ? '#fff' : color,
            'borderColor': color
        }">
            {{ text }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, ref, reactive } from 'vue'

const emit = defineEmits(['callback'])
const $props = defineProps<{
    text: string,
    type?: string,
    color?: string,//(type == 'sumbit' || type == 'del')时可不传
}>()

const handleclick = () => {
    emit('callback')
}
</script>

<style lang="scss" scoped>
.d_Button {
    width: fit-content;
    height: auto;
    display: inline-block;

    .d_btn {
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        min-width: 110px;
        width: fit-content;
        padding: 8px 16px;
        box-sizing: border-box;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 10px;
        word-break: keep-all;
    }

    .delButton {
        background-color: #aaaaaa;
        color: #fff;
    }

    .sumbitButton {
        background-color: #4270e4;
        color: #fff;
    }

    .editButton {
        border-width: 2px;
        border-style: solid;
    }

    .editButton:active {
        background-color: #ededed;
    }
}

.d_Button:last-child {
    .d_btn {
        margin-right: 0;
    }
}
</style>