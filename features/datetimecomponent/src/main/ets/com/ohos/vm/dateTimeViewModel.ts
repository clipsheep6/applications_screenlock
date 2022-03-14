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

import featureAbility from '@ohos.ability.featureAbility'
import commonEvent from '@ohos.commonEvent';
import settings from '@ohos.settingsnapi';
import Log from '../../../../../../../../common/src/main/ets/default/Log.ets'
import DateTimeCommon from '../../../../../../../../common/src/main/ets/default/DateTimeCommon'
import Constants from '../common/constants'

const TAG = 'ScreenLock-DateTimeViewModel'

let mCommonEventSubscribeInfo = {
    events: [
        commonEvent.Support.COMMON_EVENT_TIME_CHANGED,
        commonEvent.Support.COMMON_EVENT_TIMEZONE_CHANGED,
        commonEvent.Support.COMMON_EVENT_TIME_TICK
    ]
};

let mEventSubscriber

/**
 * DateTimeViewModel class
 */
export default class DateTimeViewModel {
    timeVal: string = ''
    dateVal: any = {}
    weekVal: any = {}
    isUsing24hFormat: boolean= false

    ViewModelInit(): void{
        Log.showInfo(TAG, 'ViewModelInit');

        // TODO api 8 下有问题，临时注释
        // this.timeFormatMonitor();

        this.setDateTime.bind(this)()
        commonEvent.createSubscriber(mCommonEventSubscribeInfo, this.createSubscriberCallBack.bind(this));
        Log.showInfo(TAG, 'ViewModelInit end');
    }

    private timeFormatMonitor(): void {
        Log.showInfo(TAG, 'timeFormatMonitor');
        let urivar = settings.getUri('settings.time.format')
        let helper = featureAbility.acquireDataAbilityHelper(urivar);
        this.checkTimeFormat(helper);
        helper.on("dataChange", urivar, (err) => {
            if (err.code !== 0) {
                Log.showError(TAG, `failed to getAbilityWant because ${err.message}`);
                return;
            } else {
                this.checkTimeFormat(helper);
            }
            Log.showInfo(TAG, 'observer reveive notifychange on success data : ' + JSON.stringify(err))
        })
    }

    private checkTimeFormat(helper) {
        Log.showInfo(TAG, 'checkTimeFormat');
        let getRetValue = settings.getValue(helper, 'settings.time.format', '24')
        if (getRetValue === '12') {
            this.isUsing24hFormat = false;
        } else if (getRetValue === '24') {
            this.isUsing24hFormat = true;
        }
    }

    private setDateTime() {
        Log.showInfo(TAG, `setDateTime`)
        this.timeVal = DateTimeCommon.getSystemTime(this.isUsing24hFormat)
        this.dateVal = DateTimeCommon.getSystemDate()
        this.weekVal = DateTimeCommon.getSystemWeek()
    }

    private createSubscriberCallBack(err, data) {
        Log.showInfo(TAG, "start createSubscriberCallBack " + JSON.stringify(data))
        mEventSubscriber = data
        commonEvent.subscribe(data, this.setDateTime.bind(this));
        Log.showInfo(TAG, "start createSubscriberCallBack finish")
    }

    stopPolling() {
        Log.showInfo(TAG, `stopPolling start`)
        commonEvent.unsubscribe(mEventSubscriber);
        Log.showInfo(TAG, `stopPolling end`)
    }
}
