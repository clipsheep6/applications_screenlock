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

// 导入了commonEvent模块，用于处理通用事件。
// 导入了CommonEventData类型，表示通用事件数据的结构。
// 导入了EventManager，可能是用于管理特定事件的自定义模块。
// 导入了SCREEN_CHANGE_EVENT，一个特定的事件常量，表示屏幕开关状态变化的事件。
import commonEvent from "@ohos.commonEvent";
import { CommonEventData } from "commonEvent/commonEventData";
import EventManager from "../event/EventManager";
import Log from "../Log";
import { SCREEN_CHANGE_EVENT } from "../ScreenLockManager";

// 定义了一个接口，包含四个方法：订阅通用事件、取消订阅通用事件、应用策略和释放资源
export type CommonEventManager = {
  subscriberCommonEvent: () => Promise<void>;
  unSubscriberCommonEvent: () => void;
  applyPolicy: (policys: Array<POLICY>) => void;
  release: () => void;
};

// 定义了一个枚举类型POLICY，目前只有一个成员SCREEN_POLICY，表示屏幕开关策略
export enum POLICY {
  SCREEN_POLICY = "screenOnOffPolicy",
}

// ClearPolicy是一个函数类型，返回void，用于清除策略。
// InnerManager是一个包含订阅和取消订阅方法的对象类型。
type ClearPolicy = () => void;
type InnerManager = {
  subscriberCommonEvent: () => void;
  unSubscriberCommonEvent: () => void
};

// 一个对象，其键是POLICY枚举的成员，值是函数，这些函数接受一个InnerManager对象并返回一个ClearPolicy
const policyMap: { [key in POLICY]: (manager: InnerManager) => ClearPolicy } = {
  screenOnOffPolicy: ScreenPolicy,
};

// 接受参数：标签tag，事件订阅信息subscribeInfos，通用事件回调函数commonEventCallback，可选的订阅状态变化回调subscribeStateChange
export function getCommonEventManager(
  tag: string,
  subscribeInfos: { events: Array<string> },
  commonEventCallback: (data: CommonEventData) => void,
  subscribeStateChange?: (isSubscribe: boolean) => void
): CommonEventManager {

  // 函数内部定义了日志标签TAG，订阅信息SUBSCRIBE_INFOS，取消订阅函数数组unSubcribers，以及策略清除回调映射policyClearCb。
  const TAG = `CommonEvent_${tag}`;
  const SUBSCRIBE_INFOS = subscribeInfos;
  let unSubcribers: Array<() => void> = [];
  let policyClearCb: Map<POLICY, ClearPolicy> | undefined = undefined;

  // 定义了异步函数subscriberCommonEvent用于注册事件订阅。
  async function subscriberCommonEvent() {
    Log.showDebug(TAG, "registerSubscriber start");
    let subscriber = await commonEvent.createSubscriber(SUBSCRIBE_INFOS);
    commonEvent.subscribe(subscriber, (err, data) => {
      if (err.code != 0) {
        Log.showError(TAG, `Can't handle common event, err: ${JSON.stringify(err)}`);
        return;
      }
      Log.showInfo(TAG, `handle common event: ${data.event}`);
      commonEventCallback(data);
    });
    unSubcribers.push(() => commonEvent.unsubscribe(subscriber));
    subscribeStateChange && subscribeStateChange(true);
    Log.showInfo(TAG, `registerSubscriber success, size: ${unSubcribers.length}`);
  }

  // 定义了函数unSubscriberCommonEvent用于取消事件订阅。
  function unSubscriberCommonEvent() {
    Log.showDebug(TAG, `UnSubcribers size: ${unSubcribers.length}`);
    unSubcribers.forEach((unsubscribe) => unsubscribe());
    unSubcribers.length = 0;
    subscribeStateChange && subscribeStateChange(false);
  }

  // 定义了函数applyPolicy用于应用策略。
  function applyPolicy(policys: Array<POLICY>) {
    const innerManager = { subscriberCommonEvent, unSubscriberCommonEvent };
    policyClearCb = policyClearCb ?? new Map();
    policys.forEach((policy) => {
      if (policyClearCb) {
        !policyClearCb.has(policy) && policyClearCb.set(policy, policyMap[policy](innerManager));
        Log.showDebug(TAG, `apply policy: ${policy}`);
      }
    });
  }

  // 定义了函数release用于释放资源。
  function release() {
    policyClearCb?.forEach((cb) => cb());
    policyClearCb?.clear();
    unSubscriberCommonEvent();
  }

  return { subscriberCommonEvent, unSubscriberCommonEvent, applyPolicy, release };
}

// 接受一个InnerManager对象作为参数，并使用EventManager订阅SCREEN_CHANGE_EVENT事件。
function ScreenPolicy(manager: InnerManager): ClearPolicy {
  return EventManager.subscribe(SCREEN_CHANGE_EVENT, (isScreenOn: boolean) => {
    // 根据屏幕是否开启来决定是订阅还是取消订阅通用事件。
    isScreenOn ? manager.subscriberCommonEvent() : manager.unSubscriberCommonEvent();
  });
}
