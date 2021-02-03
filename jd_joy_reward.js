/*
2
宠汪汪积分兑换奖品脚本, 目前脚本只兑换京豆，兑换京豆成功，才会发出通知提示，其他情况不通知。
3
更新时间：2021-1-20
4
兑换规则：一个账号一天只能兑换一次京豆。
5
兑换奖品成功后才会有系统弹窗通知
6
每日京豆库存会在0:00、8:00、16:00更新，经测试发现中午12:00也会有补发京豆。
7
支持京东双账号
8
脚本兼容: Quantumult X, Surge, Loon, JSBox, Node.js
9
==============Quantumult X==============
10
[task_local]
11
#宠汪汪积分兑换奖品
12
0 0-16/8 * * * https://raw.githubusercontent.com/LXK9301/jd_scripts/master/jd_joy_reward.js, tag=宠汪汪积分兑换奖品, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jdcww.png, enabled=true
13
​
14
==============Loon==============
15
[Script]
16
cron "0 0-16/8 * * *" script-path=https://raw.githubusercontent.com/LXK9301/jd_scripts/master/jd_joy_reward.js,tag=宠汪汪积分兑换奖品
17
​
18
================Surge===============
19
宠汪汪积分兑换奖品 = type=cron,cronexp="0 0-16/8 * * *",wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/LXK9301/jd_scripts/master/jd_joy_reward.js
20
​
21
===============小火箭==========
22
宠汪汪积分兑换奖品 = type=cron,script-path=https://raw.githubusercontent.com/LXK9301/jd_scripts/master/jd_joy_reward.js, cronexpr="0 0-16/8 * * *", timeout=3600, enable=true
23
 */
24
const $ = new Env('宠汪汪积分兑换奖品');
25
let joyRewardName = 20;//是否兑换京豆，默认开启兑换功能，其中20为兑换20京豆,500为兑换500京豆，0为不兑换京豆.数量有限先到先得
26
//Node.js用户请在jdCookie.js处填写京东ck;
27
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
28
const notify = $.isNode() ? require('./sendNotify') : '';
29
let jdNotify = false;//是否开启静默运行，默认false关闭(即:奖品兑换成功后会发出通知提示)
30
//IOS等用户直接用NobyDa的jd cookie
31
let cookiesArr = [], cookie = '';
32
if ($.isNode()) {
33
  Object.keys(jdCookieNode).forEach((item) => {
34
    cookiesArr.push(jdCookieNode[item])
35
  })
36
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
37
} else {
38
  let cookiesData = $.getdata('CookiesJD') || "[]";
39
  cookiesData = jsonParse(cookiesData);
40
  cookiesArr = cookiesData.map(item => item.cookie);
41
  cookiesArr.reverse();
42
  cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
43
  cookiesArr.reverse();
44
  cookiesArr = cookiesArr.filter(item => item !== "" && item !== null && item !== undefined);
45
}
