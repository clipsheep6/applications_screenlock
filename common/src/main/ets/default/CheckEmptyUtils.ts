/*
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// 检查不同类型的数据是否为空
export default class CheckEmptyUtils {

  // 这个方法接收一个参数 obj，即需要检查的对象。
  // 它返回一个布尔值，如果 obj 是 undefined、null、空字符串 ''，或者是一个没有属性的对象（Object.keys(obj).length === 0），则返回 true，表示该对象为空。
  static isEmpty(obj) {
    return (typeof obj === 'undefined' || obj === null || obj === '' || Object.keys(obj).length === 0);
  }

  // 这个方法接收一个字符串参数 str，即需要检查的字符串。
  // 它首先使用 str.trim() 移除字符串两端的空白字符，然后检查去除空白后的字符串长度是否为 0。如果是，返回 true，表示字符串为空。
  static checkStrIsEmpty(str) {
    return str.trim().length === 0;
  }

  // 这个方法接收一个数组参数 arr，即需要检查的数组。
  // 它检查数组的长度是否为 0。如果是，返回 true，表示数组为空。
  static isEmptyArr(arr) {
    return arr.length === 0;
  }
}