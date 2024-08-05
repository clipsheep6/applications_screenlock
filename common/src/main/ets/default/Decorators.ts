/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
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

import Log from "./Log";

const TAG = "Decorators";

// 定义了一个名为 debounce 的装饰器函数，它接受一个参数 timeout，表示延迟执行的时间（毫秒）。
// 这个装饰器用于确保在指定的时间间隔内，无论触发了多少次函数调用，只有第一次调用会被执行。
export function debounce(timeout: number) {
    return function inner(target: any, propKey: string, descriptor: PropertyDescriptor) {
        let curFunc: number = 0;
        const original = descriptor.value;
        descriptor.value = function (...args: string[]) {
            Log.showInfo(TAG, `debounce invoke ${propKey} curFunc: ${curFunc}`);
            curFunc && clearTimeout(curFunc);
            curFunc = setTimeout(() => original.call(this, ...args), timeout);
        };
    };
}

// 定义了一个名为 throttle 的装饰器函数，它接受一个参数 waitTime，表示两次函数执行之间必须等待的时间（毫秒）。
// 这个装饰器用于限制函数在指定的时间间隔内只能执行一次。
export function throttle(waitTime: number) {
    return function inner(target: any, propKey: string, descriptor: PropertyDescriptor) {
        let lastTime: number = 0;
        const original = descriptor.value;
        descriptor.value = function (...args: string[]) {
            let curTime = Date.now();
            Log.showInfo(TAG, `throttle invoke ${propKey} timeInterval: ${curTime - lastTime}`);
            if (curTime - lastTime >= waitTime) {
                original.call(this, ...args);
                lastTime = curTime;
            }
        };
    };
}
