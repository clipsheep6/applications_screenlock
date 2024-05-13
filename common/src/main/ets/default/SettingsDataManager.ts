//@ts-nocheck
/*
 * Copyright (c) 2024 Huawei Device Co., Ltd.
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

import { Log } from './Log';
import settings from '@ohos.settings';
import dataShare from '@ohos.data.dataShare';
import { Context } from '@ohos.abilityAccessCtrl';

const TAG = 'SettingsDataManager'
/**
 * Wrapper class for settings interfaces.
 */
export class SettingsDataManager {
  /**
   * settingsData manager instance
   *
   * @return settingsDataManager instance
   */
  // static getInstance(): SettingsDataManager {
  //   if (globalThis.SettingsDataManagerInstance == null) {
  //     globalThis.SettingsDataManagerInstance = new SettingsDataManager();
  //   }
  //   return globalThis.SettingsDataManagerInstance;
  // }

  // /**
  //  * Update launcher load  settingData by settingDataKey.
  //  */
  // setLoadValue(helper: dataShare.DataShareHelper | null, settingDataKey: string, value: boolean): void {
  //   Log.showError(TAG, "setLoadValue:" + value)
  //   if (typeof globalThis.desktopContext === 'undefined') {
  //     settings.setValueSync(globalThis.settingsContext as Context, settingDataKey, value);
  //   } else {
  //     settings.setValueSync(globalThis.desktopContext as Context, settingDataKey, value);
  //   }
  // }

  /**
   * get launcher load settingDataValue by settingDataKey.
   *
   * @return settingsDataValue by settingDataKey.
   */
  getLoadValue(context, settingDataKey: string, defaultValue: string): string {
    let value: string = 'isNotLoad';
    value = settings.getValueSync(context as Context, settingDataKey, defaultValue);
    Log.showError(TAG, "getValue:" + value);
    return value;
  }
}