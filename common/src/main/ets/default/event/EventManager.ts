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

// ServiceExtensionContext：服务扩展上下文，可能用于跨服务通信。
// createOrGet：一个单例助手函数，用于确保EventManager类只有一个实例。
// EventUtil：事件工具模块，包括事件解析器接口和事件类型。
// EventBus：事件总线，用于事件的发布和订阅机制。
import ServiceExtensionContext from "application/ServiceExtensionContext";
import Log from "../Log";
import createOrGet from "../SingleInstanceHelper";
import { EventParser, START_ABILITY_EVENT, Event, LocalEvent } from "./EventUtil";
import { Callback, createEventBus, EventBus } from "./EventBus";

// 定义了两个类型别名：unsubscribe为取消订阅的函数类型，Events为事件类型的别名，可以是字符串或字符串数组。
export type unsubscribe = () => void;
export type Events = string | string[];

const TAG = "EventManagerSc";

// 定义了EventManager类，负责事件的发布和订阅
class EventManager {

    // 属性mEventBus：事件总线实例。
    // 属性eventParser：事件解析器，包含不同类型的事件处理方法。
    // 属性mContext：服务扩展上下文，用于可能的服务间通信。
    mEventBus: EventBus<string>;
    eventParser: EventParser;
    mContext: ServiceExtensionContext | undefined;

    // 构造函数初始化事件总线，并设置事件解析器。
    constructor() {
        this.mEventBus = createEventBus();
        this.eventParser = {
            local: this.publishLocalEvent,
            ability: this.startAbility,
            commonEvent: this.publishCommonEvent,
            remote: this.publishRemoteEvent,
        };
    }

    setContext(ctx: ServiceExtensionContext) {
        this.mContext = ctx;
    }

    // 根据事件类型调用相应的解析器方法。
    publish(event: Event): boolean {
        return this.eventParser[event.target].call(this, event.data);
    }

    // subscribe和subscribeOnce方法允许订阅者注册对特定事件类型的响应函数，返回一个取消订阅的函数。
    subscribe(eventType: Events, callback: Callback): unsubscribe {
        return this.mEventBus.on(eventType, callback);
    }
    subscribeOnce(eventType: string, callback: Callback): unsubscribe {
        return this.mEventBus.once(eventType, callback);
    }

    // 处理本地事件，记录日志并使用事件总线发布事件。
    private publishLocalEvent(data: LocalEvent): boolean {
        Log.showInfo(TAG, `publish localEvent type: ${data.eventName}`);
        if (data.eventName) {
            this.mEventBus.emit(data.eventName, data.args);
            return true;
        }
        return false;
    }

    // 用于启动一个Ability，记录日志，发布启动事件，并调用上下文的startAbility方法实际启动能力。
    private startAbility(data: { [key: string]: any }): boolean {
        Log.showInfo(TAG, `start Ability: ${data.abilityName}`);
        if (data.bundleName && data.abilityName && this.mContext) {
            this.mEventBus.emit(START_ABILITY_EVENT, { abilityName: data.abilityName });
            this.mContext.startAbility({
                bundleName: data.bundleName,
                abilityName: data.abilityName,
                parameters: data.args??undefined
            });
            return true;
        }
        return false;
    }

    // 用于处理远程事件，但目前实现为不执行任何操作。
    private publishRemoteEvent(data: { [key: string]: any }): boolean {
        return false;
    }

    // 用于处理普通事件，但目前实现为不执行任何操作。
    private publishCommonEvent(data: { [key: string]: any }): boolean {
        return false;
    }
}

// 创建EventManager的单例实例，并通过export default导出。
let sEventManager = createOrGet(EventManager, TAG);

export default sEventManager as EventManager;