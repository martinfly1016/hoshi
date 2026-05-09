# 星の命式 MVP Site

This is the first static MVP scaffold for `hoshinomeishiki.jp`.

## Pages

- `/` - brand home
- `/shichusuimei/` - 四柱推命 pillar page
- `/shichusuimei/free/` - free鑑定 tool page scaffold
- `/shichusuimei/compatibility/` - compatibility entry page
- `/birthday-fortune/` - 生年月日占い entry page
- `/shiheitousu/` - 紫微斗数 preparation page

## Local Preview

Open `site/index.html` directly in a browser, or serve the folder with any static server.

The current free鑑定 page intentionally does not generate a fake命式. The calculation module is isolated behind `assets/app.js` and should be replaced with a verified 四柱推命 calculation engine before public launch.

