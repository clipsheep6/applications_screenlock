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

// 定义一个名为 EventTarget 的类型，包含四种事件目标类型：本地（local）、远程（remote）、能力（ability）和公共事件（commonEvent）。
export type EventTarget = "local" | "remote" | "ability" | "commonEvent";

// 表示一个事件对象。它包含一个 target 属性，类型为 EventTarget，和一个 data 属性，是一个键值对对象，键是字符串，值是任意类型。
export type Event = {
    target: EventTarget;
    data: { [key: string]: any };
};

// 定义一个名为 EventParser 的类型，是一个映射类型，其键是 EventTarget 类型，值是一个函数，接受任意类型的数据并返回一个布尔值。
export type EventParser = {
    [key in EventTarget]: (data: any) => boolean;
};

// 定义一个名为 LocalEvent 的类型，表示本地事件，包含一个事件名称（eventName）和一个参数（args）。
export type LocalEvent = {
    eventName: string;
    args: any;
};

export const START_ABILITY_EVENT = "startAbilityEvent";
export const PUBLISH_COMMON_EVENT = "publishCommonEvent";

const TAG = "EventUtil";
const LOCAL_EVENT_TYPE = "local";
const START_ABILITY_TYPE = "ability";

// 定义一个函数 obtainLocalEvent，接受一个事件名称和一个参数，返回一个符合 Event 类型的对象，其 data 属性为 LocalEvent 类型。
export function obtainLocalEvent(event: string, args: any): Event & { data: LocalEvent } {
    return {
        target: LOCAL_EVENT_TYPE,
        data: {
            eventName: event,
            args,
        },
    };
}

// 定义一个函数 obtainStartAbility，接受一个应用包名称、一个能力名称和一个可选参数，返回一个符合 Event 类型的对象。
export function obtainStartAbility(bundleName: string, abilityName: string, args?: any): Event {
    return {
        target: START_ABILITY_TYPE,
        data: {
            bundleName,
            abilityName,
            args
        },
    };
}

// 定义一个函数 parseEventString，接受一个字符串或 undefined，尝试解析字符串并返回一个 Event 对象或 undefined。
export function parseEventString(eventString: string | undefined): Event | undefined {
    // string must be "local=eventName|args" or "ability=bundleName|abilityName"
    if (!eventString) {
        return;
    }
    let [eventType, eventData] = eventString.split("=");
    if (eventType == LOCAL_EVENT_TYPE && eventData) {
        let [localEventName, args] = eventData.split("|");
        if (localEventName) {
            Log.showDebug(TAG, `parseEventData name:${localEventName}, args: ${args}`);
            return obtainLocalEvent(localEventName, args);
        }
    }
    if (eventType == START_ABILITY_TYPE && eventData) {
        let [bundleName, abilityName] = eventData.split("|");
        if (bundleName && abilityName) {
            Log.showDebug(TAG, `parseEventData bundleName:${bundleName}, abilityName: ${abilityName}`);
            return obtainStartAbility(bundleName, abilityName);
        }
    }
    Log.showError(TAG, `Can't parse event data: ${eventString}`);
    return undefined;
}
