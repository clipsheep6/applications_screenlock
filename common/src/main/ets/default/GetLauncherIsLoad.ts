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
      let isFirst = await PreferencesHelper.getInstance().get('isFirst', true);
      if (isFirst || isFirst === undefined) {
        this.getLauncherLoad(context);
        AppStorage.setOrCreate('isFirst', true)
      }
    } catch (err) {
      Log.showError(TAG, `Check whether the initial startup fails, err: ${err}`)
    }
  }

  public async getLauncherLoad(context) {
    Log.showInfo(TAG, 'initLauncherLoad');
    this.timer = setInterval(() => {
      settings.getValue(context, 'launcherIsLoad', (err, value)=>{
        if (err) {
          Log.showError(TAG, `Failed to get the setting. ${err.message}`);
          return;
        }
        clearInterval(this.timer);
        if (value) {
          AppStorage.setOrCreate('lockStatus', ScreenLockStatus.Unlock);
          PreferencesHelper.getInstance().put('isFirst', false);
        }
      })
    }, 200);
  }
}
