(function () {
  const REGION_OPTIONS = [
    { key: "jp", label: "日本" },
    { key: "cn", label: "中国・香港・台湾" },
    { key: "us", label: "米国" },
    { key: "world", label: "その他海外" },
  ];

  const WORLD_LOCATIONS = [
    { id: "cn-beijing", country: "cn", label: "中国 / 北京市", city: "北京市", region: "北京市", timezone: "Asia/Shanghai", utcOffset: 8, latitude: 39.9042, longitude: 116.4074, keywords: "北京 beijing" },
    { id: "cn-shanghai", country: "cn", label: "中国 / 上海市", city: "上海市", region: "上海市", timezone: "Asia/Shanghai", utcOffset: 8, latitude: 31.2304, longitude: 121.4737, keywords: "上海 shanghai" },
    { id: "cn-guangzhou", country: "cn", label: "中国 / 広東省 広州市", city: "広州市", region: "広東省", timezone: "Asia/Shanghai", utcOffset: 8, latitude: 23.1291, longitude: 113.2644, keywords: "广东 廣東 広東 广州 廣州 guangzhou canton" },
    { id: "cn-shenzhen", country: "cn", label: "中国 / 広東省 深圳市", city: "深圳市", region: "広東省", timezone: "Asia/Shanghai", utcOffset: 8, latitude: 22.5431, longitude: 114.0579, keywords: "广东 廣東 広東 深圳 shenzhen" },
    { id: "cn-hangzhou", country: "cn", label: "中国 / 浙江省 杭州市", city: "杭州市", region: "浙江省", timezone: "Asia/Shanghai", utcOffset: 8, latitude: 30.2741, longitude: 120.1551, keywords: "浙江 杭州 hangzhou" },
    { id: "cn-nanjing", country: "cn", label: "中国 / 江蘇省 南京市", city: "南京市", region: "江蘇省", timezone: "Asia/Shanghai", utcOffset: 8, latitude: 32.0603, longitude: 118.7969, keywords: "江苏 江蘇 南京 nanjing" },
    { id: "cn-chengdu", country: "cn", label: "中国 / 四川省 成都市", city: "成都市", region: "四川省", timezone: "Asia/Shanghai", utcOffset: 8, latitude: 30.5728, longitude: 104.0668, keywords: "四川 成都 chengdu" },
    { id: "cn-chongqing", country: "cn", label: "中国 / 重慶市", city: "重慶市", region: "重慶市", timezone: "Asia/Shanghai", utcOffset: 8, latitude: 29.563, longitude: 106.5516, keywords: "重庆 重慶 chongqing" },
    { id: "cn-wuhan", country: "cn", label: "中国 / 湖北省 武漢市", city: "武漢市", region: "湖北省", timezone: "Asia/Shanghai", utcOffset: 8, latitude: 30.5928, longitude: 114.3055, keywords: "湖北 武汉 武漢 wuhan" },
    { id: "cn-xian", country: "cn", label: "中国 / 陝西省 西安市", city: "西安市", region: "陝西省", timezone: "Asia/Shanghai", utcOffset: 8, latitude: 34.3416, longitude: 108.9398, keywords: "陕西 陝西 西安 xian xi an" },
    { id: "cn-tianjin", country: "cn", label: "中国 / 天津市", city: "天津市", region: "天津市", timezone: "Asia/Shanghai", utcOffset: 8, latitude: 39.3434, longitude: 117.3616, keywords: "天津 tianjin" },
    { id: "cn-hong-kong", country: "cn", label: "中国 / 香港", city: "香港", region: "香港", timezone: "Asia/Hong_Kong", utcOffset: 8, latitude: 22.3193, longitude: 114.1694, keywords: "香港 hong kong hk" },
    { id: "cn-taipei", country: "cn", label: "台湾 / 台北市", city: "台北市", region: "台湾", timezone: "Asia/Taipei", utcOffset: 8, latitude: 25.033, longitude: 121.5654, keywords: "台湾 臺灣 台北 taipei" },
    { id: "us-new-york", country: "us", label: "米国 / New York, NY", city: "New York", region: "NY", timezone: "America/New_York", utcOffset: -5, latitude: 40.7128, longitude: -74.006, keywords: "new york ny ニューヨーク" },
    { id: "us-los-angeles", country: "us", label: "米国 / Los Angeles, CA", city: "Los Angeles", region: "CA", timezone: "America/Los_Angeles", utcOffset: -8, latitude: 34.0522, longitude: -118.2437, keywords: "los angeles california ca ロサンゼルス" },
    { id: "us-san-francisco", country: "us", label: "米国 / San Francisco, CA", city: "San Francisco", region: "CA", timezone: "America/Los_Angeles", utcOffset: -8, latitude: 37.7749, longitude: -122.4194, keywords: "san francisco california ca サンフランシスコ" },
    { id: "us-chicago", country: "us", label: "米国 / Chicago, IL", city: "Chicago", region: "IL", timezone: "America/Chicago", utcOffset: -6, latitude: 41.8781, longitude: -87.6298, keywords: "chicago illinois il シカゴ" },
    { id: "us-houston", country: "us", label: "米国 / Houston, TX", city: "Houston", region: "TX", timezone: "America/Chicago", utcOffset: -6, latitude: 29.7604, longitude: -95.3698, keywords: "houston texas tx ヒューストン" },
    { id: "us-seattle", country: "us", label: "米国 / Seattle, WA", city: "Seattle", region: "WA", timezone: "America/Los_Angeles", utcOffset: -8, latitude: 47.6062, longitude: -122.3321, keywords: "seattle washington wa シアトル" },
    { id: "us-boston", country: "us", label: "米国 / Boston, MA", city: "Boston", region: "MA", timezone: "America/New_York", utcOffset: -5, latitude: 42.3601, longitude: -71.0589, keywords: "boston massachusetts ma ボストン" },
    { id: "us-honolulu", country: "us", label: "米国 / Honolulu, HI", city: "Honolulu", region: "HI", timezone: "Pacific/Honolulu", utcOffset: -10, latitude: 21.3069, longitude: -157.8583, keywords: "honolulu hawaii hi ハワイ ホノルル" },
    { id: "world-london", country: "world", label: "英国 / London", city: "London", region: "England", timezone: "Europe/London", utcOffset: 0, latitude: 51.5074, longitude: -0.1278, keywords: "london uk england ロンドン" },
    { id: "world-paris", country: "world", label: "フランス / Paris", city: "Paris", region: "Ile-de-France", timezone: "Europe/Paris", utcOffset: 1, latitude: 48.8566, longitude: 2.3522, keywords: "paris france パリ" },
    { id: "world-sydney", country: "world", label: "オーストラリア / Sydney", city: "Sydney", region: "NSW", timezone: "Australia/Sydney", utcOffset: 10, latitude: -33.8688, longitude: 151.2093, keywords: "sydney australia シドニー" },
    { id: "world-singapore", country: "world", label: "シンガポール / Singapore", city: "Singapore", region: "Singapore", timezone: "Asia/Singapore", utcOffset: 8, latitude: 1.3521, longitude: 103.8198, keywords: "singapore シンガポール" },
    { id: "world-bangkok", country: "world", label: "タイ / Bangkok", city: "Bangkok", region: "Bangkok", timezone: "Asia/Bangkok", utcOffset: 7, latitude: 13.7563, longitude: 100.5018, keywords: "bangkok thailand バンコク" },
    { id: "world-seoul", country: "world", label: "韓国 / Seoul", city: "Seoul", region: "Seoul", timezone: "Asia/Seoul", utcOffset: 9, latitude: 37.5665, longitude: 126.978, keywords: "seoul korea ソウル 韓国" },
  ];

  window.HOSHI_REGION_OPTIONS = REGION_OPTIONS;
  window.HOSHI_WORLD_LOCATIONS = WORLD_LOCATIONS;
}());
