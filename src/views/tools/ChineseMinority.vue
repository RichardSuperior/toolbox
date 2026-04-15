<template>
  <ToolLayout title="中国少数民族">
    <div class="tool-wrap">
      <div class="search-bar">
        <input v-model="keyword" class="search-input" placeholder="搜索民族名称或分布地区..." />
        <span class="count">共 {{ filtered.length }} 个民族</span>
      </div>
      <div class="grid">
        <div v-for="item in filtered" :key="item.name" class="ethnic-card">
          <div class="ethnic-name">{{ item.name }}</div>
          <div class="ethnic-pop">人口约 {{ item.pop }}</div>
          <div class="ethnic-area">📍 {{ item.area }}</div>
          <div class="ethnic-lang">语言：{{ item.lang }}</div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../../components/ToolLayout.vue'
const keyword = ref('')
const ethnics = [
  { name: '壮族', pop: '1800万', area: '广西、云南、广东', lang: '壮语（壮侗语系）' },
  { name: '回族', pop: '1100万', area: '宁夏、甘肃、河南等', lang: '汉语（保留阿拉伯词汇）' },
  { name: '满族', pop: '1100万', area: '辽宁、吉林、黑龙江', lang: '满语（已濒危），通用汉语' },
  { name: '维吾尔族', pop: '1200万', area: '新疆', lang: '维吾尔语（突厥语系）' },
  { name: '苗族', pop: '940万', area: '贵州、湖南、云南', lang: '苗语（苗瑶语系）' },
  { name: '彝族', pop: '870万', area: '四川、云南、贵州', lang: '彝语（藏缅语族）' },
  { name: '土家族', pop: '800万', area: '湖南、湖北、重庆', lang: '土家语（藏缅语族）' },
  { name: '藏族', pop: '700万', area: '西藏、青海、四川', lang: '藏语（藏缅语族）' },
  { name: '蒙古族', pop: '650万', area: '内蒙古、辽宁、新疆', lang: '蒙古语（阿尔泰语系）' },
  { name: '侗族', pop: '290万', area: '贵州、湖南、广西', lang: '侗语（壮侗语系）' },
  { name: '布依族', pop: '290万', area: '贵州', lang: '布依语（壮侗语系）' },
  { name: '瑶族', pop: '280万', area: '广西、湖南、广东', lang: '勉语（苗瑶语系）' },
  { name: '白族', pop: '190万', area: '云南大理', lang: '白语（藏缅语族）' },
  { name: '哈尼族', pop: '160万', area: '云南', lang: '哈尼语（藏缅语族）' },
  { name: '哈萨克族', pop: '150万', area: '新疆、甘肃', lang: '哈萨克语（突厥语系）' },
  { name: '朝鲜族', pop: '180万', area: '吉林、黑龙江、辽宁', lang: '朝鲜语' },
  { name: '傣族', pop: '120万', area: '云南西双版纳', lang: '傣语（壮侗语系）' },
  { name: '黎族', pop: '150万', area: '海南', lang: '黎语（壮侗语系）' },
  { name: '傈僳族', pop: '70万', area: '云南、四川', lang: '傈僳语（藏缅语族）' },
  { name: '佤族', pop: '43万', area: '云南', lang: '佤语（南亚语系）' },
  { name: '畲族', pop: '70万', area: '福建、浙江、江西', lang: '畲语（苗瑶语系）' },
  { name: '高山族', pop: '约50万', area: '台湾', lang: '南岛语系各方言' },
  { name: '拉祜族', pop: '48万', area: '云南', lang: '拉祜语（藏缅语族）' },
  { name: '水族', pop: '41万', area: '贵州', lang: '水语（壮侗语系）' },
  { name: '东乡族', pop: '62万', area: '甘肃', lang: '东乡语（阿尔泰语系）' },
  { name: '纳西族', pop: '32万', area: '云南丽江', lang: '纳西语（藏缅语族）' },
  { name: '土族', pop: '29万', area: '青海', lang: '土语（阿尔泰语系）' },
  { name: '仫佬族', pop: '21万', area: '广西', lang: '仫佬语（壮侗语系）' },
  { name: '锡伯族', pop: '19万', area: '新疆、辽宁', lang: '锡伯语（满-通古斯语族）' },
  { name: '柯尔克孜族', pop: '19万', area: '新疆', lang: '柯尔克孜语（突厥语系）' },
  { name: '达斡尔族', pop: '13万', area: '内蒙古、黑龙江', lang: '达斡尔语（阿尔泰语系）' },
  { name: '景颇族', pop: '15万', area: '云南', lang: '景颇语（藏缅语族）' },
  { name: '毛南族', pop: '10万', area: '广西', lang: '毛南语（壮侗语系）' },
  { name: '撒拉族', pop: '13万', area: '青海', lang: '撒拉语（突厥语系）' },
  { name: '布朗族', pop: '12万', area: '云南', lang: '布朗语（南亚语系）' },
  { name: '塔吉克族', pop: '5万', area: '新疆', lang: '塔吉克语（印欧语系）' },
  { name: '阿昌族', pop: '4万', area: '云南', lang: '阿昌语（藏缅语族）' },
  { name: '普米族', pop: '4万', area: '云南', lang: '普米语（藏缅语族）' },
  { name: '鄂温克族', pop: '3万', area: '内蒙古、黑龙江', lang: '鄂温克语（满-通古斯语族）' },
  { name: '怒族', pop: '3万', area: '云南', lang: '怒语（藏缅语族）' },
  { name: '京族', pop: '2.8万', area: '广西', lang: '京语（南亚语系）' },
  { name: '基诺族', pop: '2.3万', area: '云南', lang: '基诺语（藏缅语族）' },
  { name: '德昂族', pop: '2万', area: '云南', lang: '德昂语（南亚语系）' },
  { name: '保安族', pop: '2万', area: '甘肃', lang: '保安语（阿尔泰语系）' },
  { name: '俄罗斯族', pop: '1.5万', area: '新疆、内蒙古', lang: '俄语' },
  { name: '裕固族', pop: '1.4万', area: '甘肃', lang: '裕固语（阿尔泰语系）' },
  { name: '乌孜别克族', pop: '1万', area: '新疆', lang: '乌孜别克语（突厥语系）' },
  { name: '门巴族', pop: '1万', area: '西藏', lang: '门巴语（藏缅语族）' },
  { name: '鄂伦春族', pop: '0.8万', area: '内蒙古、黑龙江', lang: '鄂伦春语（满-通古斯语族）' },
  { name: '独龙族', pop: '0.7万', area: '云南', lang: '独龙语（藏缅语族）' },
  { name: '塔塔尔族', pop: '0.3万', area: '新疆', lang: '塔塔尔语（突厥语系）' },
  { name: '赫哲族', pop: '0.5万', area: '黑龙江', lang: '赫哲语（满-通古斯语族）' },
  { name: '珞巴族', pop: '0.3万', area: '西藏', lang: '珞巴语（藏缅语族）' },
]
const filtered = computed(() => {
  const k = keyword.value.toLowerCase()
  return k ? ethnics.filter(e => e.name.includes(k) || e.area.includes(k) || e.lang.includes(k)) : ethnics
})
</script>

<style scoped>
.tool-wrap { display: flex; flex-direction: column; gap: 12px; }
.search-bar { display: flex; align-items: center; gap: 12px; }
.search-input { flex: 1; padding: 8px 12px; border: 1px solid #d0d7de; border-radius: 6px; font-size: 14px; }
.count { font-size: 13px; color: #666; white-space: nowrap; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 10px; }
.ethnic-card { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 12px; border-top: 3px solid #0969da; }
.ethnic-name { font-weight: 700; font-size: 16px; color: #0969da; margin-bottom: 6px; }
.ethnic-pop { font-size: 13px; color: #666; margin-bottom: 4px; }
.ethnic-area, .ethnic-lang { font-size: 12px; color: #555; margin-top: 2px; }
</style>
