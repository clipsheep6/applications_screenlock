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
// 导入电池模型、电池图标、电池SOC（State of Charge，电池剩余电量）、常量、日志记录和样式配置等。
import mBatteryModel from '../batteryModel';
import BatteryPic from './batteryPic'
import BatterySoc from './batterySoc'
import Constants from '../common/constants'
import Log from '../../../../../../../common/src/main/ets/default/Log'
import StyleConfigurationCommon from '../../../../../../../common/src/main/ets/default/StyleConfiguration'
import StyleConfiguration from '../common/StyleConfiguration'
import {StatusBarGroupComponentData} from '../../../../../../screenlock/src/main/ets/com/ohos/common/constants'
import StatusBarVM from '../../../../../../screenlock/src/main/ets/com/ohos/vm/StatusBarVM'

const TAG = 'BatteryComponent-batteryIcon'

// 使用@Component装饰器定义了一个名为BatteryIcon的组件。
@Component
export default struct BatteryIcon {

  // @StorageLink装饰器用于链接到存储的属性，定义batterySoc（电池剩余电量）和StatusCoefficient（状态系数），分别初始化为100和1.0。
  @StorageLink('batterySoc') batterySoc: number = 100
  @StorageLink('StatusCoefficient') StatusCoefficient: number = 1.0

  // mGroupId是一个私有属性，用于存储组标识符，初始为空字符串。
  private mGroupId: string = ''

  // mStatusBarGroupComponentData是一个状态属性，用于存储状态栏组件数据，初始化为新创建的StatusBarGroupComponentData实例。
  // componentGap和statusBarMarginLeftRight是状态属性，用于存储组件间隙和状态栏左右边距的资源值。
  @State mStatusBarGroupComponentData: StatusBarGroupComponentData = new StatusBarGroupComponentData()
  @State componentGap: Resource = $r('app.float.battery_component_gap')
  @State statusBarMarginLeftRight: Resource = $r("app.float.signal_status_margin_Left_right")

  // 当组件即将显示时调用，用于初始化状态栏组件数据和电池模型，并记录日志。
  aboutToAppear() {
    this.mStatusBarGroupComponentData = StatusBarVM.getStatusBarGroupComponentData(this.mGroupId)
    mBatteryModel.initBatteryModel();
    Log.showInfo(TAG, 'aboutToAppear');
  }

  // 当组件即将消失时调用，记录日志。
  aboutToDisappear() {
    Log.showInfo(TAG, 'aboutToDisappear');
  }

  build() {
    Row() {
      Row().width(this.statusBarMarginLeftRight)
      BatterySoc({ mContentColor: this.mStatusBarGroupComponentData.contentColor })
      Row().width(this.componentGap)
      BatteryPic({ mContentColor: this.mStatusBarGroupComponentData.contentColor })
      Row().width(this.statusBarMarginLeftRight)
    }
    .height('100%')
  }

}