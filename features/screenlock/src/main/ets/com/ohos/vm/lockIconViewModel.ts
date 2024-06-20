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
import { PreferencesHelper } from '../../../../../../../../common/src/main/ets/default/PreferencesHelper'

const TAG = 'ScreenLock-LockIconViewModel'

export default class LockIconViewModel {
    cutMessage: any= {}
    iconPath: any= {}

    ViewModelInit(): void{
        Log.showDebug(TAG, `ViewModelInit`);
        this.iconPath = $r('app.media.ic_public_lock_filled');
        this.cutMessage = $r('app.string.lock_prompt')
    }

    async unlockScreen() {
        Log.showError(TAG, `打印 unlockScreen`)
        let isFirst = await PreferencesHelper.getInstance().get('isFirst', true);
        if (isFirst || isFirst === 'undefined') {
            AppStorage.setOrCreate('lockStatus', ScreenLockStatus.Locking)
            setTimeout(()=>{
                this.iconPath = $r('app.media.ic_public_unlock_filled');
                this.cutMessage = $r('app.string.unlock_prompt')
                Log.showError(TAG, `定时器内打印 可以进行解锁1 isFirst：${isFirst}`)
                PreferencesHelper.getInstance().put('isFirst', false);
                AppStorage.setOrCreate('lockStatus', ScreenLockStatus.Unlock)
           }, 5000)
        } else {
            this.iconPath = $r('app.media.ic_public_unlock_filled');
            this.cutMessage = $r('app.string.unlock_prompt')
            Log.showError(TAG, `定时器内打印 可以进行解锁2 isFirst：${isFirst}`)
        }
     }

    onStatusChange(lockStatus: ScreenLockStatus): void {
        Log.showInfo(TAG, `onStatusChange lockStatus:${lockStatus}`);
        switch (lockStatus) {
            case ScreenLockStatus.Locking:
                this.iconPath = $r('app.media.ic_public_lock_filled');
                this.cutMessage = $r('app.string.lock_prompt')
                break;
            case ScreenLockStatus.Unlock:
                 this.unlockScreen();
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
        Log.showInfo(TAG, `onRecognizeFace lockStatus: ${lockStatus}`);
        if (lockStatus == ScreenLockStatus.FaceNotRecognized) {
            screenLockService.authUserByFace()
        }
    }
}