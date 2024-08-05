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

// 这是一个使用 export 关键字导出的常量对象 WindowNameMap。
// 它是一个键值对的集合，其中键是数字，值是字符串。这个对象可能用于将窗口的ID映射到它们的名称。
export const WindowNameMap = {
  2112: 'navigation',
  2108: 'status',
  2111: 'volume'
};

// 这是一个导出的接口 Rect，它定义了一个具有四个属性的对象的结构：left, top, width, height。
// 这些属性都是数字类型，通常用于定义矩形的位置和尺寸。
export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
};

// 这是一个使用 export 关键字导出的类型别名 WindowType。
// 它使用联合类型定义了两种可能的字符串字面量值：'status' 和 'navigation'。这可能用于限定窗口类型的值。
export type WindowType = 'status' | 'navigation';

// 这是一个默认导出的类 Constants，它包含静态属性和方法。默认导出意味着你可以使用任何名称来导入这个类。
export default class Constants {
  static URI_VAR: string = 'dataability:///com.ohos.settingsdata.DataAbility';

  static getUriSync(key: string): string {
    return "datashare:///com.ohos.settingsdata/entry/settingsdata/SETTINGSDATA?Proxy=true&key=" + key;
  }
}