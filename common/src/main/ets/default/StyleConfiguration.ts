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

// 从当前目录下的 StyleManager 文件导入 StyleManager 类
import StyleManager from './StyleManager';

const TAG = 'Common-StyleConfiguration';

export default class StyleConfiguration {
    // 在 StyleConfiguration 类中定义一个静态方法 getCommonStyle。静态方法可以直接通过类名调用，不需要创建类的实例
    static getCommonStyle() {
        // 在方法内部定义一个字符串常量 key，它是通过拼接 TAG 和 "-Common" 来生成的，用作获取样式的键
        const key: string = TAG + "-Common";
        // 调用 StyleManager 类的 getStyle 方法，并传入两个参数：key 和一个箭头函数
        // getStyle 方法可能是用于获取或设置样式的函数，这里它接收一个键和一个回调函数作为参数
        return StyleManager.getStyle(key, () => {
            // 箭头函数返回一个对象，包含几个样式属性
            return {
                // 对象属性 statusBarFontSize 的值是通过调用 $r 函数并传入资源标识符 "app.float.signal_fontSize" 来获取的
                // 对象属性 statusBarIconWidth 设置为 '24vp'，表示状态栏图标的宽度是 24 虚拟像素
                // 对象属性 statusBarIconHeight 设置为 '24vp'，表示状态栏图标的高度是 24 虚拟像素
                // 对象属性 statusBarMarginLeftRight 的值是通过调用 $r 函数并传入资源标识符来获取的，表示状态栏图标左右的边距
                statusBarFontSize: $r("app.float.signal_fontSize"),
                statusBarIconWidth: '24vp',
                statusBarIconHeight: '24vp',
                statusBarMarginLeftRight: $r("app.float.signal_status_margin_Left_right"),
            };
        });
    }
}