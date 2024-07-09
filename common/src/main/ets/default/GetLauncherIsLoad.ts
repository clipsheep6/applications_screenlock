//@ts-nocheck
/**
 * Copyright (c) 2024-2024 Huawei Device Co., Ltd.
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

import settings from '@ohos.settings';
import Log from './Log';
import { ScreenLockStatus } from './ScreenLockCommon';
import { PreferencesHelper } from './PreferencesHelper';
import { ScreenStatus } from './Constants';

const TAG = 'GetLauncherIsLoad';

export class GetLauncherIsLoad {

  private static sInstance:GetLauncherIsLoad | undefined = undefined;
  public timer:number | null = null;

  static getInstance() {
    if (!GetLauncherIsLoad.sInstance) {
      GetLauncherIsLoad.sInstance = new GetLauncherIsLoad();
    }
    return GetLauncherIsLoad.sInstance;
  }

  async checkIsFirst(context: any) {
    try {
      let isFirst = await PreferencesHelper.getInstance().get(ScreenStatus.isFirst, true);
      Log.showError(TAG, `The power-on status is obtained, isFirst:${isFirst}`)
      if (isFirst || isFirst === undefined) {
        this.getLauncherLoad(context);
        return isFirst;
      }
    } catch (err) {
      Log.showError(TAG, `Check whether the initial startup fails, err: ${err}`)
    }
  }

  public async getLauncherLoad(context) {
    Log.showInfo(TAG, 'initLauncherLoad');
    this.timer = setInterval(() => {
      settings.getValue(context, ScreenStatus.launcherLoadingStatus, (err, value)=>{
        if (err) {
          Log.showError(TAG, `Failed to get the setting. ${err.message}`);
          return;
        }
        clearInterval(this.timer);
        Log.showError(TAG, `The data is obtained successfully. value:${value}`)
        if (value) {
          AppStorage.setOrCreate(ScreenStatus.lockStatus, ScreenLockStatus.Unlock);
        }
      })
    }, 200);
  }
}
