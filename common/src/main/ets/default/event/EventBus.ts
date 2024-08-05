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

import Log from "../Log";

// 定义了一个回调函数类型Callback，它接受任意类型的参数args，并返回void。
export type Callback = (args: any) => void;
const TAG = "EventBus";

// 这个接口定义了事件总线的行为，包括注册事件监听器(on)、注册一次性事件监听器(once)、注销事件监听器(off)和触发事件(emit)。
export interface EventBus<T> {
    on(event: T | T[], cb: Callback): () => void;
    once(event: T, cb: Callback): () => void;
    off(event: T | T[] | undefined, cb: Callback): void;
    emit(event: T, args: any): void;
}

// 这个函数用于创建事件总线实例。这里使用泛型T来确保事件类型是字符串。
export function createEventBus<T extends string>(): EventBus<T> {

    // 这行初始化了一个对象_cbs来存储事件监听器集合。每个事件类型T对应一个回调函数集合(Set)。
    let _cbs: { [key: string]: Set<Callback> } = {};

    // 如果传入事件是一个数组，对每个事件都调用on。
    // 否则，将回调添加到对应事件的集合中，并记录日志。
    function on(events: T | T[], cb: Callback): () => void {
        if (Array.isArray(events)) {
            events.forEach((e) => on(e, cb));
        } else {
            (_cbs[events] || (_cbs[events] = new Set())).add(cb);
            Log.showInfo(TAG, `add event[${events}] callback, size: ${_cbs[events]?.size}`);
        }
        return () => off(events, cb);
    }

    // 这个方法创建了一个新的回调函数newCallback，它在调用原始回调后会注销自身。
    // 然后使用on方法注册这个一次性回调函数。
    function once(event: T, cb: Callback): () => void {
        let newCallback = (args: any) => {
            cb(args);
            removeSelf();
        };
        function removeSelf() {
            off(event, newCallback);
        }
        return on(event, newCallback);
    }

    // 如果没有提供事件类型，则清除所有事件监听器并记录日志。
    // 如果传入事件是一个数组，对每个事件都调用off。
    // 否则，从指定事件的监听器集合中删除指定的回调函数，并记录日志。
    function off(event: T | T[] | undefined, cb: Callback) {
        if (!event) {
            _cbs = {};
            Log.showInfo(TAG, `remove event[${event}] all callback`);
            return;
        }
        if (Array.isArray(event)) {
            event.forEach((e) => off(e, cb));
            return;
        }
        _cbs[event]?.delete(cb);
        Log.showInfo(TAG, `remove event[${event}] callback, size: ${_cbs[event]?.size}`);
    }

    // 如果指定事件有注册监听器，遍历并调用每个回调函数，传递args参数。
    function emit(event: T, args: any) {
        _cbs[event]?.forEach((cb) => cb(args));
    }

    // 这个函数返回包含on、once、off和emit方法的对象，它们可以被用来操作事件总线。
    function stickyEmit(event: T, argument: any[]) {}
    return {
        on,
        once,
        off,
        emit,
    };
}