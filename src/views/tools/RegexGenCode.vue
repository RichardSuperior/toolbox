<template>
  <ToolLayout title="正则生成代码">
    <div class="regex-gen">
      <div class="tool-bar">
        <select v-model="lang" class="sel">
          <option value="js">JavaScript</option>
          <option value="py">Python</option>
          <option value="java">Java</option>
          <option value="cs">C#</option>
          <option value="go">Go</option>
          <option value="php">PHP</option>
        </select>
        <button class="btn" @click="generate">生成代码</button>
        <button class="btn btn-outline" @click="copyCode">复制</button>
      </div>
      <div class="editor-wrap">
        <div class="input-wrap">
          <div class="label">正则表达式</div>
          <input v-model="pattern" class="text-input" placeholder="输入正则表达式，如：[0-9]+" />
          <div class="label mt8">替换模板（可选）</div>
          <input v-model="replacement" class="text-input" placeholder="替换模板，如：$1" />
          <div class="tip">留空则生成匹配代码，填写则生成替换代码</div>
        </div>
        <div class="output-wrap">
          <div class="label">{{ langName }} 代码</div>
          <textarea v-model="code" class="code-area" readonly></textarea>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'

const pattern = ref('')
const replacement = ref('')
const lang = ref('js')
const code = ref('')

const langName = computed(() => {
  const names = { js: 'JavaScript', py: 'Python', java: 'Java', cs: 'C#', go: 'Go', php: 'PHP' }
  return names[lang.value] || lang.value
})

function buildJs(p, r) {
  const nl = '\n'
  if (r) {
    return '// JavaScript' + nl + 'const result = str.replace(/' + p + '/g, "' + r + '");'
  }
  return '// JavaScript' + nl + 'const match = str.match(/' + p + '/g);' + nl + 'console.log(match);'
}

function buildPy(p, r) {
  const nl = '\n'
  let out = 'import re' + nl + nl + '# Python' + nl
  out += 'text = "sample text"' + nl
  out += 'pattern = re.compile(r"' + p + '")' + nl
  if (r) {
    out += 'result = pattern.sub(r"' + r + '", text)'
  } else {
    out += 'matches = pattern.findall(text)' + nl + 'print(matches)'
  }
  return out
}

function buildJava(p, r) {
  const nl = '\n'
  let out = 'import java.util.regex.*;' + nl + nl + '// Java' + nl
  out += 'Pattern pat = Pattern.compile("' + p + '");' + nl
  if (r) {
    out += 'String result = pat.matcher(str).replaceAll("' + r + '");'
  } else {
    out += 'Matcher m = pat.matcher(str);' + nl
    out += 'while (m.find()) {' + nl + '  System.out.println(m.group());' + nl + '}'
  }
  return out
}

function buildCs(p, r) {
  const nl = '\n'
  let out = 'using System.Text.RegularExpressions;' + nl + nl + '// C#' + nl
  out += 'var pattern = @"' + p + '";' + nl
  if (r) {
    out += 'var result = Regex.Replace(str, pattern, "' + r + '");'
  } else {
    out += 'var matches = Regex.Matches(str, pattern);' + nl
    out += 'foreach (Match m in matches) Console.WriteLine(m.Value);'
  }
  return out
}

function buildGo(p, r) {
  const nl = '\n'
  const tab = '\t'
  let out = 'package main' + nl + nl
  out += 'import (' + nl + tab + '"fmt"' + nl + tab + '"regexp"' + nl + ')' + nl + nl
  out += '// Go' + nl
  out += 're := regexp.MustCompile(`' + p + '`)' + nl
  if (r) {
    out += 'result := re.ReplaceAllString(str, "' + r + '")' + nl + 'fmt.Println(result)'
  } else {
    out += 'matches := re.FindAllString(str, -1)' + nl + 'fmt.Println(matches)'
  }
  return out
}

function buildPhp(p, r) {
  const nl = '\n'
  let out = '<?php' + nl + '// PHP' + nl
  out += '$pattern = "/' + p + '/";' + nl
  if (r) {
    out += '$result = preg_replace($pattern, "' + r + '", $str);'
  } else {
    out += 'preg_match_all($pattern, $str, $matches);' + nl + 'print_r($matches);'
  }
  return out
}

function generate() {
  const p = pattern.value.trim()
  const r = replacement.value.trim()
  if (!p) { alert('请输入正则表达式'); return }
  const builders = { js: buildJs, py: buildPy, java: buildJava, cs: buildCs, go: buildGo, php: buildPhp }
  code.value = builders[lang.value](p, r)
}

function copyCode() {
  if (!code.value) return
  navigator.clipboard.writeText(code.value).then(() => alert('已复制'))
}
</script>

<style scoped>
.regex-gen { display: flex; flex-direction: column; gap: 12px; }
.tool-bar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.btn { padding: 6px 14px; background: #0969da; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-outline { background: white; color: #333; border: 1px solid #d0d7de; }
.sel { padding: 6px 8px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 13px; background: white; }
.editor-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.input-wrap { display: flex; flex-direction: column; gap: 0; }
.output-wrap { display: flex; flex-direction: column; gap: 8px; }
.label { font-weight: 600; font-size: 14px; color: #24292f; margin-bottom: 6px; }
.mt8 { margin-top: 8px; }
.tip { font-size: 12px; color: #6e7781; margin-top: 4px; }
.text-input { width: 100%; padding: 8px 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 13px; box-sizing: border-box; font-family: 'Fira Code', monospace; }
.code-area { width: 100%; min-height: 280px; padding: 12px; border: 1px solid #d0d7de; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 13px; resize: vertical; background: #f6f8fa; box-sizing: border-box; flex: 1; }
@media (max-width: 768px) { .editor-wrap { grid-template-columns: 1fr; } }
</style>
