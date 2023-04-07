# 高考信息和志愿填报威信小程序

  这是一个微信小程序，可以提供高考一分一段的信息，同时还可以根据考生的所在省份、高考成绩、高考类型推荐志愿学校，同时还可以进行过滤选择学校。
  接下来将依次介绍小程序的简单介绍、所有数据的来源、数据的存储管理。

## 小程序的功能简单介绍

## 数据来源
  所有的数据来源均是来自 [掌上高考](https://www.gaokao.cn/)，数据主要包含
  - 每个省份每一年各科类的高考一分一段
  - 每个院校在各个省份每一年的录取分数线
  - 每个院校的基本信息
  至于如何获取这些数据，可以参考另外一个项目 []()

## 数据的存储管理
  使用微信的云开发平台提供的类MongoDB数据库和云存储能力来存储数据
  
