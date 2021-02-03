/*
2
东东超市兑换奖品 脚本地址：https://raw.githubusercontent.com/LXK9301/jd_scripts/master/jd_blueCoin.js
3
感谢@yangtingxiao提供PR
4
更新时间：2020-12-24
5
支持京东多个账号
6
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
7
============QuantumultX==============
8
[task_local]
9
#东东超市兑换奖品
10
0 0 0 * * * https://raw.githubusercontent.com/LXK9301/jd_scripts/master/jd_blueCoin.js, tag=东东超市兑换奖品, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jxc.png, enabled=true
11
​
12
====================Loon=================
13
[Script]
14
cron "0 0 0 * * *" script-path=https://raw.githubusercontent.com/LXK9301/jd_scripts/master/jd_blueCoin.js,tag=东东超市兑换奖品
15
​
16
===================Surge==================
17
东东超市兑换奖品 = type=cron,cronexp="0 0 0 * * *",wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/LXK9301/jd_scripts/master/jd_blueCoin.js
18
​
19
============小火箭=========
20
东东超市兑换奖品 = type=cron,script-path=https://raw.githubusercontent.com/LXK9301/jd_scripts/master/jd_blueCoin.js, cronexpr="0 0 0 * * *", timeout=3600, enable=true
21
 */
22
const $ = new Env('东东超市兑换奖品');
23
const notify = $.isNode() ? require('./sendNotify') : '';
24
//Node.js用户请在jdCookie.js处填写京东ck;
25
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
26
let coinToBeans = $.getdata('coinToBeans') || 20; //兑换多少数量的京豆（20或者1000），0表示不兑换，默认兑换20京豆，如需兑换把0改成20或者1000，或者'商品名称'(商品名称放到单引号内)即可
27
let jdNotify = false;//是否开启静默运行，默认false关闭(即:奖品兑换成功后会发出通知提示)
28
//IOS等用户直接用NobyDa的jd cookie
29
let cookiesArr = [], cookie = '';
30
if ($.isNode()) {
31
  Object.keys(jdCookieNode).forEach((item) => {
32
    cookiesArr.push(jdCookieNode[item])
33
  })
34
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
35
} else {
36
  let cookiesData = $.getdata('CookiesJD') || "[]";
37
  cookiesData = jsonParse(cookiesData);
38
  cookiesArr = cookiesData.map(item => item.cookie);
39
  cookiesArr.reverse();
40
  cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
41
  cookiesArr.reverse();
42
  cookiesArr = cookiesArr.filter(item => item !== "" && item !== null && item !== undefined);
43
}
44
​
45
const JD_API_HOST = `https://api.m.jd.com/api?appid=jdsupermarket`;
