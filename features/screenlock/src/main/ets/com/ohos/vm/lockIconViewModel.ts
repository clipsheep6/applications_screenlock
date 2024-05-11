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

import Log from '../../../../../../../../common/src/main/ets/default/Log'
import {ScreenLockStatus} from '../../../../../../../../common/src/main/ets/default/ScreenLockCommon'
import screenLockService from '../model/screenLockService'
import { settingsDataManager } from '../../../../../../../../common/src/main/ets/default/SettingsDataManager'
import AbilityManager from '../../../../../../../../common/src/main/ets/default/abilitymanager/abilityManager'
import dataShare from '@ohos.data.dataShare';
import settings from '@ohos.settings';

const TAG = 'ScreenLock-LockIconViewModel'

export default class LockIconViewModel {
    cutMessage: any= {}
    iconPath: any= {}
    isLoad: boolean = false;
    private readonly LAUNCHER_LOAD_STATUS_KEY: string = 'settings.display.launcher_load_status';
    private helper: dataShare.DataShareHelper;

    ViewModelInit(): void{
        Log.showDebug(TAG, `ViewModelInit`);
        this.iconPath = $r('app.media.ic_public_lock_filled');
        this.cutMessage = $r('app.string.lock_prompt')
        this.initHelper(this.dataChangesCallback.bind(this));
    }

    async initHelper(callback: () => void): Promise<void> {
        let url = "datashare:///com.ohos.settingsdata/entry/settingsdata/SETTINGSDATA?Proxy=true&key=" + this.LAUNCHER_LOAD_STATUS_KEY;
        this.helper = await dataShare.createDataShareHelper(AbilityManager.getContext(AbilityManager.ABILITY_NAME_SCREEN_LOCK), url);
        Log.showError(TAG, 'initHelper, helper: ' + this.helper + ', uri: ' + url);
        this.helper.on('dataChange', url, () => {
            Log.showError(TAG, 'onDataChange.');
            callback();
        });
    }

    /**
     * Get launcher load status data.
     * @return
     */
    dataChangesCallback(): void {
        Log.showError(TAG, `锁屏注册的回调执行了`)
        let getRetValue:string = this.getValue('isNotLoad');
        Log.showError(TAG, `dataChangesCallback initValue ${getRetValue}`);
        if (getRetValue == 'isLoad') {
            this.isLoad = true;
            AppStorage.setOrCreate('lockStatus', ScreenLockStatus.Unlock);
        }
    }

    private getValue(defaultValue: string): string {
        let context = AbilityManager.getContext(AbilityManager.ABILITY_NAME_SCREEN_LOCK);
        if (context == undefined || context == null) {
            Log.showError(TAG, `getValue: ${context}`);
            return defaultValue
        }
        try {
            return settingsDataManager.getLoadValue(context, this.LAUNCHER_LOAD_STATUS_KEY, defaultValue)
        } catch (err) {
            Log.showError(TAG, `getValue: ${context}, ${JSON.stringify(err)}`);
            return defaultValue
        }
    }

    onStatusChange(lockStatus: ScreenLockStatus): void {
        Log.showError(TAG, `onStatusChange lockStatus:${lockStatus}`);
        switch (lockStatus) {
            case ScreenLockStatus.Locking:
                this.iconPath = $r('app.media.ic_public_lock_filled');
                this.cutMessage = $r('app.string.lock_prompt')
                break;
            case ScreenLockStatus.Unlock:
            // this.iconPath = $r('app.media.ic_public_unlock_filled');
            // this.cutMessage = $r('app.string.unlock_prompt')
                if (!this.isLoad){
                    AppStorage.SetOrCreate('lockStatus', ScreenLockStatus.Locking);
                    Log.showError(TAG, `桌面没有准备好呢 继续锁定状态`)
                }else {
                    this.iconPath = $r('app.media.ic_public_unlock_filled');
                    this.cutMessage = $r('app.string.unlock_prompt')
                }
                break;
            case ScreenLockStatus.RecognizingFace:
                this.iconPath = $r('app.media.ic_public_unlock_filled');
                this.cutMessage = $r('app.string.recognizing_face')
                break;
            case ScreenLockStatus.FaceNotRecognized:
                this.iconPath = $r('app.media.ic_public_unlock_filled');
                this.cutMessage = $r('app.string.face_not_recognized')
                break;
            default:
                this.iconPath = $r('app.media.ic_public_lock_filled');
                this.cutMessage = $r('app.string.lock_prompt')
                break;
        }
    }

    onRecognizeFace(lockStatus: ScreenLockStatus) {
        Log.showError(TAG, `onRecognizeFace lockStatus: ${lockStatus}`);
        if (lockStatus == ScreenLockStatus.FaceNotRecognized) {
            screenLockService.authUserByFace()
        }
    }
}