// @ts-nocheck
/**
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

import settings from "@ohos.settings";
import commonEvent from "@ohos.commonEvent";
import dataShare from '@ohos.data.dataShare';
import featureAbility from "@ohos.ability.featureAbility";
import { DataAbilityHelper } from "ability/dataAbilityHelper";
import Log from "./Log";
import EventManager from "./event/EventManager";
import createOrGet from "./SingleInstanceHelper";
import Constants from "./Constants";
import { obtainLocalEvent } from "./event/EventUtil";
import { CommonEventManager, getCommonEventManager, POLICY } from "./commonEvent/CommonEventManager";

// 导出一个常量 TIME_CHANGE_EVENT，用作时间变更事件的标识。
export const TIME_CHANGE_EVENT = "Time_Change_Event";

// 导出一个类型别名 TimeEventArgs，定义了时间事件参数的结构，包含日期和时间格式。
export type TimeEventArgs = {
  date: Date;
  timeFormat: boolean;
};

const TAG = "TimeManagerSc";
//const URI_VAR = "dataability:///com.ohos.settingsdata.DataAbility";
const TIME_FORMAT_KEY = settings.date.TIME_FORMAT;
const TIME_SUBSCRIBE_INFO = {
  events: [
    commonEvent.Support.COMMON_EVENT_TIME_CHANGED,
    commonEvent.Support.COMMON_EVENT_TIMEZONE_CHANGED,
    commonEvent.Support.COMMON_EVENT_TIME_TICK,
  ],
};

function fill(value: number) {
  return (value > 9 ? "" : "0") + value;
}

export function concatTime(h: number, m: number) {
  return `${fill(h)}:${fill(m)}`;
}

class TimeManager {

  // mUse24hFormat：一个私有变量，用于存储是否使用24小时格式。
  // mSettingsHelper：一个可能未定义的私有变量，用于数据能力助手。
  // mManager：一个可能未定义的私有变量，用于公共事件管理器。
  private mUse24hFormat: boolean = false;
  private mSettingsHelper?: DataAbilityHelper;
  private mManager?: CommonEventManager;

  // init 方法接受一个上下文参数，并进行事件管理器的初始化、订阅时间变更事件、应用策略等。
  public init(context: any) {
    this.mManager = getCommonEventManager(
      TAG,
      TIME_SUBSCRIBE_INFO,
      () => this.notifyTimeChange(),
      (isSubscribe) => isSubscribe && this.notifyTimeChange()
    );
    this.mManager.subscriberCommonEvent();
    this.mManager.applyPolicy([POLICY.SCREEN_POLICY]);
    this.initTimeFormat(context);
  }

  // release 方法用于释放资源，包括取消订阅公共事件和清除数据能力助手的监听器。
  public release() {
    this.mManager?.release();
    this.mManager = undefined;
    this.mSettingsHelper?.off("dataChange", Constants.getUriSync(TIME_FORMAT_KEY));
  }

  // formatTime 方法接受一个日期对象，返回格式化后的小时和分钟字符串。
  public formatTime(date: Date) {
    return concatTime(date.getHours() % (this.mUse24hFormat ? 24 : 12), date.getMinutes());
  }

  // initTimeFormat 方法异步获取时间格式设置，并监听时间格式变化。
  private async initTimeFormat(context: any) {
    Log.showDebug(TAG, "initTimeFormat");
    //this.mSettingsHelper = featureAbility.acquireDataAbilityHelper(context, URI_VAR);
    this.mSettingsHelper = await dataShare.createDataShareHelper(context, Constants.getUriSync(TIME_FORMAT_KEY));
    //Log.showDebug(TAG, "url:"+Constants.getUriSync(TIME_FORMAT_KEY));
    //Log.showDebug(TAG, "mSettingsHelper:"+JSON.stringify(this.mSettingsHelper));
    try {
      this.mSettingsHelper.on("dataChange", Constants.getUriSync(TIME_FORMAT_KEY), () => {
        Log.showDebug(TAG, "mSettingsHelper on");
        this.handleTimeFormatChange(context);
      });
      this.handleTimeFormatChange(context);
    } catch (e) {
      Log.showError(TAG, `Can't listen timeformate change.`);
    }
  }

  // handleTimeFormatChange 方法处理时间格式变化，更新 mUse24hFormat 变量，并通知时间变更。
  private handleTimeFormatChange(context: any) {
    Log.showDebug(TAG, "handleTimeFormatChange")
    if (!this.mSettingsHelper) {
      Log.showError(TAG, `Can't get dataAbility helper.`);
      return;
    }
    let timeString = settings.getValueSync(context, TIME_FORMAT_KEY, "24");
    Log.showDebug(TAG, `timeFormat change: ${timeString}`);
    this.mUse24hFormat = timeString == "24";
    this.notifyTimeChange();
  };

  // notifyTimeChange 方法创建时间事件参数并发布时间变更事件。
  private notifyTimeChange() {
    Log.showDebug(TAG, "notifyTimeChange");
    let args: TimeEventArgs = {
      date: new Date(),
      timeFormat: this.mUse24hFormat,
    };
    EventManager.publish(obtainLocalEvent(TIME_CHANGE_EVENT, args));
  }

}

// 使用 createOrGet 方法创建 TimeManager 类的单例。
let sTimeManager = createOrGet(TimeManager, TAG);

// 将 sTimeManager 作为默认导出，允许其他模块使用这个单例。
export default sTimeManager as TimeManager;
