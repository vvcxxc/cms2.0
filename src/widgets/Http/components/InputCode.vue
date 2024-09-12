<!-- 

v-model="双向绑定"

:modelValue="表达式"
@update:modelValue="(修改后的表达式)=>{}"

inputCodeRef.insertCode('在焦点处插入代码')

@update:focusWord="(光标处的单词)=>{}"

 -->
<template>
  <div class="inputCode">
    <div
      ref="inputEl"
      class="input"
      :contenteditable="(contentEditable as any)"
      spellcheck="false"
      @input="input"
      @click="click"
      .onblur="saveRange"
    ></div>
    <div class="highlight" v-html="codeHighlighted"></div>
  </div>
</template>
<script setup lang="ts">
import { defineEmits, watch } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'update:focusWord'])

// code ----------------------------------------

let code = $ref('')
watch(
  () => props.modelValue,
  () => {
    code = props.modelValue || ''
  },
  { immediate: true }
)

// inputEl ----------------------------------------

let inputEl: HTMLElement | undefined = $ref()
const contentEditable = 'plaintext-only'

function updateInputInnerText() {
  if (!inputEl) {
    return
  }

  // 避免影响光标
  if (getInnerText() === code) return

  inputEl.innerText = code
}

function getInnerText() {
  const innerText = inputEl?.innerText || ''
  return fixInnerTextLn(innerText)
}

// 非 'plaintext-only' innerText \n 会比页面上的多
// 1 1
// 2 3
// 3 5
function fixInnerTextLn(innerText: string) {
  if (inputEl?.contentEditable === contentEditable) {
    return innerText
  }

  return innerText.replace(/\n+/g, function ($and) {
    const length = $and.split('').length
    const lengthFixed = Math.floor((length + 1) / 2)

    return Array(lengthFixed).fill('\n').join('')
  })
}

// highlight ----------------------------------------

let codeHighlighted = $computed(() => {
  updateInputInnerText()
  return highlight(code)
})

function highlight(value: string) {
  let html = value

  html = html
    .replace(/\b(true|false)\b/g, '👾b $& b👾')
    .replace(/\b[\d.]+/gi, '👾n $& n👾') // number
    .replace(/"(\\.|.)*?"/gi, '👾s $& s👾') // string
    .replace(/[!%^&*\-+=|<>/]+/gi, '👾p $& p👾') // +
    .replace(/\b(\w+)\s*(?=\()/gi, '👾f $& f👾') // function()
    .replace(/\[.*?\]/gi, '👾k $& k👾') // [field]

  html = html.replace(/</g, '&lt;').replace(/>/g, '&gt;')

  html = html
    .replace(/👾b (.*?) b👾/g, '<span style="color:#fe72f3">$1</span>')
    .replace(/👾n (.*?) n👾/g, '<span style="color:#57b6ff">$1</span>')
    .replace(/👾s (.*?) s👾/g, '<span style="color:#ffff66">$1</span>')
    .replace(/👾p (.*?) p👾/g, '<span style="color:#9B9B9B">$1</span>')
    .replace(/👾f (.*?) f👾/g, '<span style="color:#23DBBB">$1</span>')
    .replace(/👾k (.*?) k👾/g, '<span style="color:#febf72">$1</span>')

  html = html.replace(/\n/g, '<br />')

  return html
}

// emit ----------------------------------------

function input() {
  code = getInnerText()
  emit('update:modelValue', code)
  emit('update:focusWord', getFocusWord())
}

function click() {
  emit('update:focusWord', getFocusWord())
}

// insertCode ----------------------------------------

let range: Range | undefined
function saveRange() {
  const selection = document.getSelection()
  range = selection?.getRangeAt(0)
}

function insertCode(text: string) {
  if (!inputEl) {
    console.warn('!inputEl')
    return
  }

  const selection = document.getSelection()
  if (!selection) return

  if (!range) {
    range = new Range()
    range.selectNodeContents(inputEl)
    range.collapse()
  }

  selection.removeAllRanges()
  selection.addRange(range)

  // range.deleteContents()
  // range.insertNode(document.createTextNode(text))
  // range.collapse()

  document.execCommand('insertText', false, text)

  // fun( | )
  if (/\)$/.test(text)) {
    const rangeCurrent = selection.getRangeAt(0)
    rangeCurrent.setEnd(rangeCurrent.endContainer, rangeCurrent.endOffset - 2)

    selection.removeAllRanges()
    selection.addRange(rangeCurrent)
  }

  input()
}

// focusWord ----------------------------------------

function getFocusWord() {
  const range = document.getSelection()?.getRangeAt(0)
  if (!range) return

  const node = range.endContainer
  const text = node.nodeValue || ''
  const left = text.slice(0, range.endOffset)
  const right = text.slice(range.endOffset)
  const l = left.match(/\w+$/)?.[0] || ''
  const r = right.match(/^\w+/)?.[0] || ''

  return l + r
}

defineExpose({
  insertCode,
  getFocusWord,
})
</script>

<style lang="scss" scoped>
.inputCode {
  position: relative;
  width: 100%;
  height: 220px;
  min-height: 42px;
  background: #262c33;
  border-radius: 6px 6px 6px 6px;
  color: #f00;
  color: transparent;
  resize: none;
  white-space: pre;
  caret-color: #fff;
  overflow: auto;
  &:hover,
  &:active {
    resize: vertical;
  }

  outline: solid 1px transparent;
  outline-offset: -1px;
  transition: 0.5s outline;
  &:focus-within {
    outline-color: #707070;
  }

  .input {
    outline: none;
    min-height: 100%;
    padding: 10px;
    &[contenteditable='plaintext-only'] {
      -webkit-user-modify: read-write-plaintext-only;
    }
    &::selection {
      background-color: rgba(255, 255, 255, 0.25);
    }
  }
  .highlight {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 10px;
    pointer-events: none;
    color: #febf72;
    color: #fff;
    // margin-top: 50px;
  }
}
</style>
