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

export const TIME_CHANGE_EVENT = "Time_Change_Event";

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
  private mUse24hFormat: boolean = false;
  private mSettingsHelper?: DataAbilityHelper;
  private mLauncherLoadHelper?: DataAbilityHelper;
  private mManager?: CommonEventManager;
  private readonly LAUNCHER_LOAD_STATUS_KEY: string = 'settings.display.launcher_load_status';

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

  public release() {
    this.mManager?.release();
    this.mManager = undefined;
    this.mSettingsHelper?.off("dataChange", Constants.getUriSync(TIME_FORMAT_KEY));
  }

  public formatTime(date: Date) {
    return concatTime(date.getHours() % (this.mUse24hFormat ? 24 : 12), date.getMinutes());
  }

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

  public async initLauncherLoad() {
    Log.showDebug(TAG, "initLauncherLoad");
    let url:string = Constants.getUriSync(this.LAUNCHER_LOAD_STATUS_KEY)
    try {
      this.mLauncherLoadHelper = await dataShare.createDataShareHelper(this.context, url);
    } catch (err) {
      Log.showError(TAG, `创建dataShare 失败： ${err}`)
    }
    Log.showDebug(TAG, "桌面的url:" + url);
    if (this.mLauncherLoadHelper){
      Log.showError(TAG, `桌面获取的helpar不是空的`)
    }
    try {
      this.mLauncherLoadHelper.on("dataChange", Constants.getUriSync(this.LAUNCHER_LOAD_STATUS_KEY), () => {
        Log.showDebug(TAG, "initLauncherLoad mLauncherLoadHelper on");
        this.dataChangesCallback(context);
      });
    } catch (e) {
      Log.showError(TAG, `Can't listen initLauncherLoad change.`);
    }
  }

  /**
   * Get launcher load status data.
   * @return
   */
  dataChangesCallback(context): void {
    Log.showError(TAG, `锁屏注册的回调执行了`)
    let getRetValue:string = settings.getValueSync(context, TIME_FORMAT_KEY, "isNotLoad")
    Log.showError(TAG, `dataChangesCallback initValue ${getRetValue}`);
    if (getRetValue == 'isLoad') {
      AppStorage.setOrCreate('launcherIsLoad', true);
      AppStorage.setOrCreate('lockStatus', 1);
    }
  }

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

  private notifyTimeChange() {
    Log.showDebug(TAG, "notifyTimeChange");
    let args: TimeEventArgs = {
      date: new Date(),
      timeFormat: this.mUse24hFormat,
    };
    EventManager.publish(obtainLocalEvent(TIME_CHANGE_EVENT, args));
  }
}

let sTimeManager = createOrGet(TimeManager, TAG);

export default sTimeManager as TimeManager;
