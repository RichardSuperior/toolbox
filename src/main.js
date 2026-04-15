import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'

// 路由配置
const routes = [
  { path: '/', component: () => import('./views/Home.vue'), meta: { title: '首页' } },
  { path: '/about', component: () => import('./views/About.vue'), meta: { title: '关于' } },

  // ===== JSON 相关 =====
  { path: '/jsonFormat', component: () => import('./views/tools/JsonFormat.vue'), meta: { title: 'JSON格式化' } },
  { path: '/jsonFormatTB', component: () => import('./views/tools/JsonFormatTB.vue'), meta: { title: 'JSON格式化(上下)' } },
  { path: '/jsonFormatLR', component: () => import('./views/tools/JsonFormatLR.vue'), meta: { title: 'JSON格式化(左右)' } },
  { path: '/jsonCompress', component: () => import('./views/tools/JsonCompress.vue'), meta: { title: 'JSON压缩转义' } },
  { path: '/jsonToCSharp', component: () => import('./views/tools/JsonToCSharp.vue'), meta: { title: 'JSON生成C#实体类' } },
  { path: '/jsonToJava', component: () => import('./views/tools/JsonToJava.vue'), meta: { title: 'JSON生成Java实体类' } },
  { path: '/jsonToGo', component: () => import('./views/tools/JsonToGo.vue'), meta: { title: 'JSON生成Go结构体' } },
  { path: '/sqlToJava', component: () => import('./views/tools/SqlToJava.vue'), meta: { title: 'SQL转Java实体类' } },
  { path: '/xmlJsonConvert', component: () => import('./views/tools/XmlJsonConvert.vue'), meta: { title: 'XML和JSON互转' } },
  { path: '/excelCsvToJson', component: () => import('./views/tools/ExcelCsvToJson.vue'), meta: { title: 'Excel/CSV转JSON' } },
  { path: '/jsonToExcelCsv', component: () => import('./views/tools/JsonToExcelCsv.vue'), meta: { title: 'JSON转Excel/CSV' } },
  { path: '/jsonGetConvert', component: () => import('./views/tools/JsonGetConvert.vue'), meta: { title: 'JSON和GET参数互转' } },
  { path: '/jsonToYaml', component: () => import('./views/tools/JsonToYaml.vue'), meta: { title: 'JSON转YAML' } },

  // ===== 格式化转换 =====
  { path: '/htmlFormat', component: () => import('./views/tools/HtmlFormat.vue'), meta: { title: 'HTML格式化' } },
  { path: '/cssFormat', component: () => import('./views/tools/CssFormat.vue'), meta: { title: 'CSS格式化' } },
  { path: '/jsFormat', component: () => import('./views/tools/JsFormat.vue'), meta: { title: 'JS格式化' } },
  { path: '/jsEncrypt', component: () => import('./views/tools/JsEncrypt.vue'), meta: { title: 'JS加密解密' } },
  { path: '/jsMixEncrypt', component: () => import('./views/tools/JsMixEncrypt.vue'), meta: { title: 'JS混合加密' } },
  { path: '/sqlFormat', component: () => import('./views/tools/SqlFormat.vue'), meta: { title: 'SQL格式化' } },
  { path: '/phpFormat', component: () => import('./views/tools/PhpFormat.vue'), meta: { title: 'PHP代码格式化' } },
  { path: '/xmlFormat', component: () => import('./views/tools/XmlFormat.vue'), meta: { title: 'XML格式化' } },
  { path: '/csharpFormat', component: () => import('./views/tools/CsharpFormat.vue'), meta: { title: 'C#代码格式化' } },
  { path: '/javaCodeFormat', component: () => import('./views/tools/JavaCodeFormat.vue'), meta: { title: 'Java代码格式化' } },
  { path: '/pythonFormat', component: () => import('./views/tools/PythonFormat.vue'), meta: { title: 'Python代码格式化' } },
  { path: '/cFormat', component: () => import('./views/tools/CFormat.vue'), meta: { title: 'C语言代码格式化' } },
  { path: '/htmlEscape', component: () => import('./views/tools/HtmlEscape.vue'), meta: { title: 'HTML转义工具' } },
  { path: '/htmlToJs', component: () => import('./views/tools/HtmlToJs.vue'), meta: { title: 'HTML转JS' } },
  { path: '/htmlJsConvert', component: () => import('./views/tools/HtmlJsConvert.vue'), meta: { title: 'HTML/JS互转' } },
  { path: '/htmlMarkdown', component: () => import('./views/tools/HtmlMarkdown.vue'), meta: { title: 'HTML/MarkDown互转' } },
  { path: '/htmlFilter', component: () => import('./views/tools/HtmlFilter.vue'), meta: { title: 'HTML过滤工具' } },
  { path: '/regexTest', component: () => import('./views/tools/RegexTest.vue'), meta: { title: '正则表达式测试' } },
  { path: '/regexGenCode', component: () => import('./views/tools/RegexGenCode.vue'), meta: { title: '正则生成代码' } },
  { path: '/regexCommon', component: () => import('./views/tools/RegexCommon.vue'), meta: { title: '常用正则表达式' } },
  { path: '/regexSyntax', component: () => import('./views/tools/RegexSyntax.vue'), meta: { title: '正则语法速查' } },
  { path: '/runJsHtmlCss', component: () => import('./views/tools/RunJsHtmlCss.vue'), meta: { title: '运行JS/HTML/CSS' } },

  // ===== 加解密编码 =====
  { path: '/md5Encrypt', component: () => import('./views/tools/Md5Encrypt.vue'), meta: { title: 'MD5加密' } },
  { path: '/urlHex', component: () => import('./views/tools/UrlHex.vue'), meta: { title: 'URL十六进制加密' } },
  { path: '/textBase64', component: () => import('./views/tools/TextBase64.vue'), meta: { title: 'Base64加密' } },
  { path: '/escapeEncrypt', component: () => import('./views/tools/EscapeEncrypt.vue'), meta: { title: 'Escape加密解密' } },
  { path: '/aesEncrypt', component: () => import('./views/tools/AesEncrypt.vue'), meta: { title: 'AES加密解密' } },
  { path: '/desEncrypt', component: () => import('./views/tools/DesEncrypt.vue'), meta: { title: 'DES加密解密' } },
  { path: '/rc4Encrypt', component: () => import('./views/tools/Rc4Encrypt.vue'), meta: { title: 'RC4加密解密' } },
  { path: '/rabbitEncrypt', component: () => import('./views/tools/RabbitEncrypt.vue'), meta: { title: 'Rabbit加密解密' } },
  { path: '/tripleDes', component: () => import('./views/tools/TripleDes.vue'), meta: { title: 'TripleDES加密解密' } },
  { path: '/hashEncrypt', component: () => import('./views/tools/HashEncrypt.vue'), meta: { title: 'SHA加密' } },
  { path: '/morseCode', component: () => import('./views/tools/MorseCode.vue'), meta: { title: '摩尔斯电码' } },
  { path: '/generatePWD', component: () => import('./views/tools/GeneratePWD.vue'), meta: { title: '密码生成器' } },
  { path: '/uuidGen', component: () => import('./views/tools/UuidGen.vue'), meta: { title: 'UUID生成' } },
  { path: '/guidGen', component: () => import('./views/tools/GuidGen.vue'), meta: { title: 'GUID生成' } },
  { path: '/ipNumConvert', component: () => import('./views/tools/IpNumConvert.vue'), meta: { title: 'IP数字地址转换' } },
  { path: '/imgBase64', component: () => import('./views/tools/ImgBase64.vue'), meta: { title: '图片转Base64' } },
  { path: '/urlEncode', component: () => import('./views/tools/UrlEncode.vue'), meta: { title: 'URL编码解码' } },
  { path: '/unicodeConvert', component: () => import('./views/tools/UnicodeConvert.vue'), meta: { title: 'Unicode转换' } },

  // ===== 文本数字 =====
  { path: '/textEditor', component: () => import('./views/tools/TextEditor.vue'), meta: { title: 'HTML在线编辑器' } },
  { path: '/chinesePinyin', component: () => import('./views/tools/ChinesePinyin.vue'), meta: { title: '汉字转拼音' } },
  { path: '/huaxiwen', component: () => import('./views/tools/Huaxiwen.vue'), meta: { title: '火星文转换器' } },
  { path: '/zhConvert', component: () => import('./views/tools/ZhConvert.vue'), meta: { title: '简繁体转换' } },
  { path: '/statisticsChars', component: () => import('./views/tools/StatisticsChars.vue'), meta: { title: '字符统计' } },
  { path: '/textDedup', component: () => import('./views/tools/TextDedup.vue'), meta: { title: '文本去重' } },
  { path: '/caseConvert', component: () => import('./views/tools/CaseConvert.vue'), meta: { title: '大小写转换' } },
  { path: '/randomNumber', component: () => import('./views/tools/RandomNumber.vue'), meta: { title: '随机数生成' } },
  { path: '/timestamp', component: () => import('./views/tools/Timestamp.vue'), meta: { title: '时间戳转换' } },
  { path: '/baseConvert', component: () => import('./views/tools/BaseConvert.vue'), meta: { title: '进制转换' } },
  { path: '/rgbColor', component: () => import('./views/tools/RgbColor.vue'), meta: { title: 'RGB颜色转换' } },

  // ===== 网络工具 =====
  { path: '/ipQuery', component: () => import('./views/tools/IpQuery.vue'), meta: { title: 'IP归属地查询' } },
  { path: '/websocketTest', component: () => import('./views/tools/WebsocketTest.vue'), meta: { title: 'WebSocket测试' } },
  { path: '/browserInfo', component: () => import('./views/tools/BrowserInfo.vue'), meta: { title: '获取浏览器信息' } },
  { path: '/dnsList', component: () => import('./views/tools/DnsList.vue'), meta: { title: '公共DNS列表' } },
  { path: '/getIP', component: () => import('./views/tools/GetIP.vue'), meta: { title: 'IP查询' } },
  { path: '/mcstatus', component: () => import('./views/tools/McStatus.vue'), meta: { title: 'MC服务器检测' } },
  { path: '/gh', component: () => import('./views/tools/GhProxy.vue'), meta: { title: 'GitHub加速' } },

  // ===== 站长工具 =====
  { path: '/remPx', component: () => import('./views/tools/RemPx.vue'), meta: { title: 'rem与px转换' } },
  { path: '/colorPalette', component: () => import('./views/tools/ColorPalette.vue'), meta: { title: '在线调色板' } },
  { path: '/metaTag', component: () => import('./views/tools/MetaTag.vue'), meta: { title: '生成Meta标签' } },
  { path: '/httpStatus', component: () => import('./views/tools/HttpStatusCodes.vue'), meta: { title: 'HTTP状态码' } },

  // ===== 计算工具 =====
  { path: '/unitConvert', component: () => import('./views/tools/UnitConvert.vue'), meta: { title: '单位换算' } },
  { path: '/rateCalc', component: () => import('./views/tools/RateCalc.vue'), meta: { title: '利率计算器' } },
  { path: '/subnetCalc', component: () => import('./views/tools/SubnetCalc.vue'), meta: { title: '子网掩码计算器' } },
  { path: '/scientificCalc', component: () => import('./views/tools/ScientificCalc.vue'), meta: { title: '科学计算器' } },
  { path: '/calculateDate', component: () => import('./views/tools/CalculateDate.vue'), meta: { title: '日期计算器' } },
  { path: '/chineseCalendar', component: () => import('./views/tools/ChineseCalendar.vue'), meta: { title: '农历查询' } },

  // ===== 其他工具 =====
  { path: '/worldClock', component: () => import('./views/tools/WorldClock.vue'), meta: { title: '世界各地时间' } },
  { path: '/specialSymbols', component: () => import('./views/tools/SpecialSymbols.vue'), meta: { title: '特殊符号大全' } },
  { path: '/historyToday', component: () => import('./views/tools/HistoryToday.vue'), meta: { title: '历史上的今天' } },
  { path: '/emojiMix', component: () => import('./views/tools/EmojiMix.vue'), meta: { title: 'Emoji混合' } },
  { path: '/mdv', component: () => import('./views/tools/MarkdownViewer.vue'), meta: { title: 'Markdown预览' } },
  { path: '/processIMG', component: () => import('./views/tools/ProcessIMG.vue'), meta: { title: '图片处理' } },
  { path: '/displayHDR', component: () => import('./views/tools/DisplayHDR.vue'), meta: { title: 'HDR显示测试' } },

  // ===== 对照列表 =====
  { path: '/userAgentList', component: () => import('./views/tools/UserAgentList.vue'), meta: { title: '常用User-Agent' } },
  { path: '/contentType', component: () => import('./views/tools/ContentType.vue'), meta: { title: 'Content-Type对照表' } },
  { path: '/httpStatusCodes', component: () => import('./views/tools/HttpStatusCodes.vue'), meta: { title: 'HTTP状态码' } },
  { path: '/portList', component: () => import('./views/tools/PortList.vue'), meta: { title: '常见端口大全' } },
  { path: '/htmlEntities', component: () => import('./views/tools/HtmlEntities.vue'), meta: { title: 'HTML特殊字符转义' } },
  { path: '/asciiTable', component: () => import('./views/tools/AsciiTable.vue'), meta: { title: 'ASCII对照表' } },
  { path: '/regexSyntax', component: () => import('./views/tools/RegexSyntax.vue'), meta: { title: '正则语法速查' } },

  // ===== Android / 移动开发 =====
  { path: '/androidKeycode', component: () => import('./views/tools/AndroidKeycode.vue'), meta: { title: 'Android键码' } },
  { path: '/androidPermission', component: () => import('./views/tools/AndroidPermission.vue'), meta: { title: 'Android权限列表' } },

  // ===== 文章与文本工具 =====
  { path: '/articleCollect', component: () => import('./views/tools/ArticleCollect.vue'), meta: { title: '文章内容采集' } },
  { path: '/articleFormat', component: () => import('./views/tools/ArticleFormat.vue'), meta: { title: '文章自动排版' } },
  { path: '/asciiConvert', component: () => import('./views/tools/AsciiConvert.vue'), meta: { title: 'ASCII编码转换' } },
  { path: '/caseChange', component: () => import('./views/tools/CaseChange.vue'), meta: { title: '英文大小写转换' } },
  { path: '/textCompress', component: () => import('./views/tools/TextCompress.vue'), meta: { title: '字符串文本压缩' } },
  { path: '/textDiff', component: () => import('./views/tools/TextDiff.vue'), meta: { title: '文本内容对比' } },
  { path: '/textEffect', component: () => import('./views/tools/TextEffect.vue'), meta: { title: '文字特效工具' } },
  { path: '/textFlip', component: () => import('./views/tools/TextFlip.vue'), meta: { title: '文字翻转工具' } },
  { path: '/textReplace', component: () => import('./views/tools/TextReplace.vue'), meta: { title: '文本内容替换' } },
  { path: '/textVertical', component: () => import('./views/tools/TextVertical.vue'), meta: { title: '文字竖排工具' } },
  { path: '/fullHalfWidth', component: () => import('./views/tools/FullHalfWidth.vue'), meta: { title: '全角半角转换' } },
  { path: '/rmbUpper', component: () => import('./views/tools/RmbUpper.vue'), meta: { title: '人民币大写转换' } },
  { path: '/nativeUnicode', component: () => import('./views/tools/NativeUnicode.vue'), meta: { title: 'Native/Unicode转换' } },
  { path: '/unicodeAscii', component: () => import('./views/tools/UnicodeAscii.vue'), meta: { title: 'Unicode/ASCII转换' } },
  { path: '/utf8Gbk', component: () => import('./views/tools/Utf8Gbk.vue'), meta: { title: 'UTF-8/GBK转换' } },
  { path: '/lxLyUrl', component: () => import('./views/tools/LxLyUrl.vue'), meta: { title: '迅雷链接转换' } },

  // ===== 代码格式化（补充）=====
  { path: '/cppFormat', component: () => import('./views/tools/CppFormat.vue'), meta: { title: 'C++代码格式化' } },
  { path: '/perlFormat', component: () => import('./views/tools/PerlFormat.vue'), meta: { title: 'Perl代码格式化' } },
  { path: '/rubyFormat', component: () => import('./views/tools/RubyFormat.vue'), meta: { title: 'Ruby代码格式化' } },
  { path: '/vbsFormat', component: () => import('./views/tools/VbsFormat.vue'), meta: { title: 'VBScript格式化' } },

  // ===== HTML 工具（补充）=====
  { path: '/htmlTable', component: () => import('./views/tools/HtmlTable.vue'), meta: { title: 'HTML表格生成' } },
  { path: '/htmlToAsp', component: () => import('./views/tools/HtmlToAsp.vue'), meta: { title: 'HTML转ASP' } },
  { path: '/htmlToCsharp', component: () => import('./views/tools/HtmlToCsharp.vue'), meta: { title: 'HTML转C#' } },
  { path: '/htmlToPhp', component: () => import('./views/tools/HtmlToPhp.vue'), meta: { title: 'HTML转PHP' } },
  { path: '/htmlUbb', component: () => import('./views/tools/HtmlUbb.vue'), meta: { title: 'HTML/UBB互转' } },
  { path: '/excelToHtml', component: () => import('./views/tools/ExcelToHtml.vue'), meta: { title: 'Excel转HTML表格' } },

  // ===== 站长工具（补充）=====
  { path: '/barcodeGen', component: () => import('./views/tools/BarcodeGen.vue'), meta: { title: '条形码生成器' } },
  { path: '/bootstrapIcons', component: () => import('./views/tools/BootstrapIcons.vue'), meta: { title: 'Bootstrap图标库' } },
  { path: '/deadLink', component: () => import('./views/tools/DeadLink.vue'), meta: { title: '死链检测' } },
  { path: '/drawingBoard', component: () => import('./views/tools/DrawingBoard.vue'), meta: { title: '在线画板' } },
  { path: '/gzipTest', component: () => import('./views/tools/GzipTest.vue'), meta: { title: 'GZip压缩检测' } },
  { path: '/htaccessNginx', component: () => import('./views/tools/HtaccessNginx.vue'), meta: { title: 'htaccess转Nginx' } },
  { path: '/htpasswdGen', component: () => import('./views/tools/HtpasswdGen.vue'), meta: { title: 'htpasswd生成' } },
  { path: '/httpHeaders', component: () => import('./views/tools/HttpHeaders.vue'), meta: { title: 'HTTP请求头' } },
  { path: '/icoGenerator', component: () => import('./views/tools/IcoGenerator.vue'), meta: { title: 'ICO图标生成器' } },
  { path: '/icpQuery', component: () => import('./views/tools/IcpQuery.vue'), meta: { title: 'ICP备案查询' } },
  { path: '/keyboardTest', component: () => import('./views/tools/KeyboardTest.vue'), meta: { title: '键盘测试' } },
  { path: '/keycode', component: () => import('./views/tools/Keycode.vue'), meta: { title: '键盘键码查询' } },
  { path: '/keywordDensity', component: () => import('./views/tools/KeywordDensity.vue'), meta: { title: '关键词密度分析' } },
  { path: '/metaAnalysis', component: () => import('./views/tools/MetaAnalysis.vue'), meta: { title: '网页Meta分析' } },
  { path: '/pageRefresh', component: () => import('./views/tools/PageRefresh.vue'), meta: { title: '网页刷新跳转' } },
  { path: '/requestMethods', component: () => import('./views/tools/RequestMethods.vue'), meta: { title: 'HTTP请求方法' } },
  { path: '/wechatDomain', component: () => import('./views/tools/WechatDomain.vue'), meta: { title: '微信域名检测' } },
  { path: '/whoisQuery', component: () => import('./views/tools/WhoisQuery.vue'), meta: { title: 'WHOIS域名查询' } },

  // ===== 参考手册（补充）=====
  { path: '/linuxCommands', component: () => import('./views/tools/LinuxCommands.vue'), meta: { title: 'Linux命令速查' } },
  { path: '/xpathTool', component: () => import('./views/tools/XpathTool.vue'), meta: { title: 'XPath解析工具' } },

  // ===== 世界信息（补充）=====
  { path: '/worldCapital', component: () => import('./views/tools/WorldCapital.vue'), meta: { title: '世界国家首都' } },
  { path: '/worldCountryCode', component: () => import('./views/tools/WorldCountryCode.vue'), meta: { title: '世界国家区号' } },
  { path: '/worldCurrency', component: () => import('./views/tools/WorldCurrency.vue'), meta: { title: '世界货币信息' } },
  { path: '/worldFestival', component: () => import('./views/tools/WorldFestival.vue'), meta: { title: '世界节日查询' } },

  // ===== 历史文化（补充）=====
  { path: '/chineseDynasty', component: () => import('./views/tools/ChineseDynasty.vue'), meta: { title: '中国历代王朝' } },
  { path: '/chineseMinority', component: () => import('./views/tools/ChineseMinority.vue'), meta: { title: '中国少数民族' } },

  // 404
  { path: '/:pathMatch(.*)*', component: () => import('./views/NotFound.vue'), meta: { title: '404' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - 在线工具箱` : '在线工具箱'
})

createApp(App).use(router).mount('#app')
