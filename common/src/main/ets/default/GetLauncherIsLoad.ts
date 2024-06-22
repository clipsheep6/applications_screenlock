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
import { PreferencesHelper } from './PreferencesHelper'

const TAG = 'GetLauncherIsLoad';

export class GetLauncherIsLoad {

  private static sInstance:GetLauncherIsLoad | undefined = undefined;

  static getInstance() {
    if (!GetLauncherIsLoad.sInstance) {
      GetLauncherIsLoad.sInstance = new GetLauncherIsLoad();
    }
    return GetLauncherIsLoad.sInstance;
  }

  async checkIsFirst(context: any) {
    Log.showError(TAG, `为什么不执行`)
    try {
      let isFirst = await PreferencesHelper.getInstance().get('isFirst', true);
      Log.showError(TAG, `打印isFirst ${isFirst}`);
      if (isFirst || isFirst === 'undefined') {
        this.getLauncherLoad(context);
      }
    } catch (err) {
      Log.showError(TAG, `打印这个报错为什么是 ${err}`)
    }
    )
  }

  public async getLauncherLoad(context) {
    Log.showError(TAG, 'initLauncherLoad');
    const UPDATE_INTERVAL = 50;
    const timer = setInterval(() => {
      settings.getValue(context, 'launcherIsLoad', (err, value)=>{
        if (err) {
          Log.showError(TAG, `Failed to get the setting. ${err.message} `);
          return;
        }
        clearInterval(timer);
        Log.showError(TAG, `获取成功 拿到的value：${value}`)
        if (value) {
          Log.showError(TAG, `在桌面加载完成,设置解锁状态为解锁2`)
          PreferencesHelper.getInstance().put('isFirst', false);
          AppStorage.setOrCreate('lockStatus', ScreenLockStatus.Unlock);
        }
      })
    }, UPDATE_INTERVAL);
  }
}

