/*
 * This file is part of KubeSphere Console.
 * Copyright (C) 2019 The KubeSphere Console Authors.
 *
 * KubeSphere Console is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * KubeSphere Console is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with KubeSphere Console.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {
  get,
  set,
  isEqual,
  isFinite,
  isEmpty,
  isNaN,
  isUndefined,
} from 'lodash'

import {
  Icon,
  Input,
  Columns,
  Column,
  Alert,
  Select,
} from '@kube-design/components'

import { cpuFormat, memoryFormat } from 'utils'

import Slider from './Slider'

import styles from './index.scss'

export default class ResourceLimit extends React.Component {
  static propTypes = {
    value: PropTypes.object,
    defaultValue: PropTypes.object,
    onChange: PropTypes.func,
    onError: PropTypes.func,
    supportGpuSelect: PropTypes.bool,
  }

  static defaultProps = {
    value: {},
    onChange() {},
    onError() {},
    cpuProps: {},
    memoryProps: {},
    supportGpuSelect: false,
  }

  constructor(props) {
    super(props)

    this.state = {
      ...ResourceLimit.getValue(props),
      defaultValue: props.defaultValue,
      cpuError: '',
      memoryError: '',
      workspaceLimitCheck: {},
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.isEdit &&
      !this.props.isEdit &&
      isEqual(prevProps.defaultValue, prevState.defaultValue)
    ) {
      this.setState({
        ...ResourceLimit.getValue(this.props),
        defaultValue: this.props.defaultProps,
      })
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (!isEqual(props.defaultValue, state.defaultValue)) {
      return {
        ...ResourceLimit.getValue(props),
        defaultValue: props.defaultValue,
      }
    }

    return null
  }

  static allowInputDot(formatNum, unit, formatFn, isMemory = false) {
    const inputNum = formatNum && isMemory ? formatNum.slice(0, -2) : formatNum
    if (inputNum && String(inputNum).endsWith('.')) {
      const number = formatFn(formatNum, unit)
      return `${number}.`
    }
    if (inputNum && String(inputNum).endsWith('.0')) {
      const number = formatFn(formatNum, unit)
      return `${number}.0`
    }

    return formatFn(formatNum, unit)
  }

  static getValue(props) {
    const cpuUnit = get(props, 'cpuProps.unit', 'Core')
    const memoryUnit = get(props, 'memoryProps.unit', 'Mi')

    const cpuRequests = ResourceLimit.allowInputDot(
      ResourceLimit.getDefaultRequestValue(props, 'cpu'),
      cpuUnit,
      cpuFormat
    )

    const cpuLimits = ResourceLimit.allowInputDot(
      ResourceLimit.getDefaultLimitValue(props, 'cpu'),
      cpuUnit,
      cpuFormat
    )

    const memoryRequests = ResourceLimit.allowInputDot(
      ResourceLimit.getDefaultRequestValue(props, 'memory'),
      memoryUnit,
      memoryFormat,
      true
    )

    const memoryLimits = ResourceLimit.allowInputDot(
      ResourceLimit.getDefaultLimitValue(props, 'memory'),
      memoryUnit,
      memoryFormat,
      true
    )

    const requestMeo = memoryFormat(
      `${ResourceLimit.getWorkspaceRequestLimit(props, 'memory')}Mi`,
      memoryUnit
    )

    const limitMeo = memoryFormat(
      `${ResourceLimit.getWorkspaceLimitValue(props, 'memory')}Mi`,
      memoryUnit
    )

    return {
      requests: {
        cpu: cpuRequests,
        memory: memoryRequests,
      },
      limits: {
        cpu: cpuLimits,
        memory: memoryLimits,
      },
      workspaceRequests: {
        cpu: cpuFormat(
          ResourceLimit.getWorkspaceRequestLimit(props, 'cpu'),
          cpuUnit
        ),
        memory: isNaN(requestMeo) ? undefined : requestMeo,
      },
      workspaceLimits: {
        cpu: cpuFormat(
          ResourceLimit.getWorkspaceLimitValue(props, 'cpu'),
          cpuUnit
        ),
        memory: isNaN(limitMeo) ? undefined : limitMeo,
      },
      gpu: ResourceLimit.gpuSetting(props),
    }
  }

  static gpuSetting(props) {
    const value = get(props, 'value', {})
    const defaultValue = get(props, 'defaultValue', {})
    if (!isEmpty(value)) {
      return {
        type: get(value, 'gpu.type', ''),
        value: get(value, 'gpu.value', ''),
      }
    }
    if (!isEmpty(defaultValue)) {
      return {
        type: get(defaultValue, 'gpu.type', ''),
        value: get(defaultValue, 'gpu.value', ''),
      }
    }
    return {
      type: '',
      value: '',
    }
  }

  static getDefaultRequestValue(props, key) {
    return get(
      props,
      `value.requests.${key}`,
      get(props, `defaultValue.requests.${key}`)
    )
  }

  static getDefaultLimitValue(props, key) {
    return get(
      props,
      `value.limits.${key}`,
      get(props, `defaultValue.limits.${key}`)
    )
  }

  static getWorkspaceRequestLimit(props, key) {
    return get(props, `workspaceLimitProps.requests.${key}`, 0)
  }

  static getWorkspaceLimitValue(props, key) {
    return get(props, `workspaceLimitProps.limits.${key}`, 0)
  }

  cpuFormatter = value => {
    if (value > 0 && value < 1) {
      return value.toFixed(2)
    }
    if (value > 1 && value !== Infinity) {
      return value.toFixed(1)
    }
    return value
  }

  memoryFormatter = value => {
    value = Math.round(value)
    if (value > 0 && value < 1000) {
      return value - (value % 10)
    }
    if (value > 1000 && value < 2000) {
      return value - (value % 50)
    }
    if (value > 2000 && value !== Infinity) {
      return value - (value % 100)
    }
    return value
  }

  get cpuUnit() {
    return this.props.cpuProps.unit || 'Core'
  }

  get memoryUnit() {
    return this.props.memoryProps.unit || 'Mi'
  }

  get gpuOption() {
    return [
      {
        label: 'nvidia.com/gpu',
        value: 'nvidia.com/gpu',
      },
    ]
  }

  get gpuType() {
    return this.state.gpu.type
  }

  getCPUProps() {
    const { requests, limits } = this.state
    return {
      marks: [
        { value: 0, label: t('NO_REQUEST'), weight: 2 },
        { value: 0.2, label: 0.2, weight: 2 },
        { value: 0.5, label: 0.5, weight: 2 },
        { value: 1, label: 1, weight: 2 },
        { value: 2, label: 2, weight: 2 },
        { value: 3, label: 3, weight: 2 },
        { value: 4, label: 4 },
        { value: Infinity, label: t('NO_LIMIT') },
      ],
      value: [requests.cpu || 0, limits.cpu || Infinity],
      onChange: this.handleCPUChange,
      valueFormatter: this.cpuFormatter,
      ...this.props.cpuProps,
      unit: this.cpuUnit,
    }
  }

  getMemoryProps() {
    const { requests, limits } = this.state
    return {
      marks: [
        { value: 0, label: t('NO_REQUEST'), weight: 2 },
        { value: 200, label: 200, weight: 1 },
        { value: 500, label: 500, weight: 1 },
        { value: 1000, label: 1000, weight: 2 },
        { value: 2000, label: 2000, weight: 2 },
        { value: 4000, label: 4000, weight: 2 },
        { value: 6000, label: 6000, weight: 1 },
        { value: 8000, label: 8000 },
        { value: Infinity, label: t('NO_LIMIT') },
      ],
      value: [requests.memory || 0, limits.memory || Infinity],
      onChange: this.handleMemoryChange,
      valueFormatter: this.memoryFormatter,
      ...this.props.memoryProps,
      unit: this.memoryUnit,
    }
  }

  getLimit(value) {
    return value === Infinity ? t('NO_LIMIT') : value || ''
  }

  getRequest(value) {
    return value === 0 ? t('NO_REQUEST') : value || ''
  }

  checkError = state => {
    let cpuError = ''
    let memoryError = ''
    const { requests, limits } = state

    if (
      limits.cpu &&
      !String(limits.cpu).endsWith('.') &&
      Number(requests.cpu) > Number(limits.cpu)
    ) {
      cpuError = 'RequestExceed'
    }

    if (
      limits.memory &&
      !String(limits.memory).endsWith('.') &&
      Number(requests.memory) > Number(limits.memory)
    ) {
      memoryError = 'RequestExceed'
    }

    return { cpuError, memoryError }
  }

  checkAndTrigger = () => {
    const {
      requests,
      limits,
      workspaceLimits: wsL,
      workspaceRequests: wsR,
    } = this.state

    this.setState(
      {
        workspaceLimitCheck: {
          requestCpuError: this.checkNumOutLimit(requests.cpu, wsR.cpu),
          requestMemoryError: this.checkNumOutLimit(
            requests.memory,
            wsR.memory
          ),
          limitCpuError: this.checkNumOutLimit(limits.cpu, wsL.cpu),
          limitMemoryError: this.checkNumOutLimit(limits.memory, wsL.memory),
        },
      },
      this.triggerChange
    )
  }

  checkNumOutLimit = (num, limit) => {
    return limit && isFinite(Number(num)) && Number(num) > limit
      ? 'workspaceRequestExceed'
      : ''
  }

  triggerChange = () => {
    const { onChange, onError } = this.props
    const {
      requests,
      limits,
      cpuError,
      memoryError,
      workspaceLimitCheck: wsL,
      gpu,
    } = this.state
    const { unit: memoryUnit } = this.getMemoryProps()
    let { unit: cpuUnit } = this.getCPUProps()

    cpuUnit = cpuUnit === 'Core' ? '' : cpuUnit

    const errorList = this.getWorkspaceCheckError()
    errorList.length > 0
      ? onError(cpuError || memoryError || wsL[errorList[0]])
      : onError(cpuError || memoryError)

    const result = {}
    if (requests.cpu > 0 && requests.cpu < Infinity) {
      set(result, 'requests.cpu', `${requests.cpu}${cpuUnit}`)
    }
    if (requests.memory > 0 && requests.memory < Infinity) {
      set(result, 'requests.memory', `${requests.memory}${memoryUnit}`)
    }
    if (limits.cpu > 0 && limits.cpu < Infinity) {
      set(result, 'limits.cpu', `${limits.cpu}${cpuUnit}`)
    }
    if (limits.memory > 0 && limits.memory < Infinity) {
      set(result, 'limits.memory', `${limits.memory}${memoryUnit}`)
    }
    set(result, 'gpu', gpu)

    onChange(result)
  }

  getWorkspaceCheckError = () => {
    return Object.keys(this.state.workspaceLimitCheck).filter(
      key => this.state.workspaceLimitCheck[key] !== ''
    )
  }

  handleCPUChange = value => {
    this.setState(
      ({ requests, limits }) => ({
        requests: { ...requests, cpu: value[0] },
        limits: { ...limits, cpu: value[1] },
      }),
      this.checkAndTrigger
    )
  }

  handleMemoryChange = value => {
    this.setState(
      ({ requests, limits }) => ({
        requests: { ...requests, memory: value[0] },
        limits: { ...limits, memory: value[1] },
      }),
      this.checkAndTrigger
    )
  }

  getInputMaxiNum(name) {
    let maxiNum
    if (!isEmpty(this.props.cpuProps)) {
      if (name.indexOf('cpu') > -1) {
        const marks = this.props.cpuProps.marks
        maxiNum = marks[marks.length - 2].value
      } else if (name.indexOf('memory') > -1) {
        const memoryMarks = this.props.memoryProps.marks
        maxiNum = memoryMarks[memoryMarks.length - 2].value
      }
    } else if (name.indexOf('cpu') > -1) {
      maxiNum = 4
    } else if (name.indexOf('memory') > -1) {
      maxiNum = 8000
    }
    return maxiNum
  }

  handleInputChange = (e, value) => {
    let inputNum
    const name = e.target.name
    const maxiNum = this.getInputMaxiNum(name)
    if (value === '') {
      inputNum = 0
    } else if (value > maxiNum) {
      value = 'infinity'
    } else {
      const number = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/.exec(value)
      inputNum = number == null ? get(this.state, name, null) : number[0]
    }

    this.setState(state => {
      set(state, name, isNaN(inputNum) ? '' : inputNum)
      return { ...state, ...this.checkError(state) }
    }, this.checkAndTrigger)
  }

  handleGpuInputChange = (e, value) => {
    let inputNum
    if (value === '') {
      inputNum = ''
    } else {
      const number = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/.exec(value)
      inputNum = number == null ? get(this.state, 'gpu.value', '') : number[0]
    }
    this.setState(
      {
        gpu: {
          type: this.state.gpu.type,
          value: inputNum,
        },
      },
      this.triggerChange
    )
  }

  gpuSelectChange = type => {
    this.setState(
      {
        gpu: {
          type,
          value: this.state.gpu.value,
        },
      },
      this.triggerChange
    )
  }

  renderTip() {
    const { workspaceLimits: wsL, workspaceRequests: wsR } = this.state
    const { limitType } = this.props.workspaceLimitProps
    const memoryUnit = this.memoryUnit
    const cpuUnit = this.cpuUnit

    const title =
      limitType === 'workspace'
        ? t('WORKSPACE_REMAINING_QUOTAS')
        : t('PROJECT_REMAINING_QUOTAS')

    const message = () => (
      <>
        <div>
          <div className={styles.message}>
            <span>{t('WS_RESOURCE_REQUESTS')}</span>
            <span>
              CPU&nbsp;
              {wsR.cpu}
              {cpuUnit},&nbsp;
              {t('MEMORY')}&nbsp;
              {wsR.memory}
              {memoryUnit}
            </span>
          </div>
          <div className={styles.message}>
            <span>{t('WS_RESOURCE_LIMITS')}</span>
            <span>
              CPU&nbsp;
              {wsL.cpu}
              {cpuUnit},&nbsp;
              {t('MEMORY')}&nbsp;
              {wsL.memory}
              {memoryUnit}
            </span>
          </div>
        </div>
      </>
    )

    return (
      <Alert
        title={title}
        type="info"
        className="margin-t12"
        message={message()}
      />
    )
  }

  ifRenderTip() {
    const { workspaceLimitProps } = this.props
    if (isEmpty(workspaceLimitProps)) {
      return false
    }
    const { limits, requests } = workspaceLimitProps
    if (
      isUndefined(limits.cpu) &&
      isUndefined(limits.memory) &&
      isUndefined(requests.cpu) &&
      isUndefined(requests.memory)
    ) {
      return false
    }

    return true
  }

  renderGpuSelect = () => {
    return (
      <Column>
        <div className={styles.inputGroup}>
          <img src="/assets/GPU.svg" size={48} />
          <div className={classnames(styles.input)}>
            <span className={styles.label}>{t('GPU_TYPE')}:</span>
            <Select
              options={this.gpuOption}
              value={this.state.gpu.type}
              onChange={this.gpuSelectChange}
              placeholder=" "
            ></Select>
          </div>
          <div className={classnames(styles.input)}>
            <span className={styles.label}>{t('RESOURCE_LIMIT')}:</span>
            <Input
              name="gpu.value"
              value={this.state.gpu.value}
              onChange={this.handleGpuInputChange}
              placeholder={t('NO_LIMIT')}
            />
          </div>
        </div>
      </Column>
    )
  }

  render() {
    const { cpuError, memoryError, workspaceLimitCheck: limit } = this.state
    const { supportGpuSelect } = this.props
    const outWorkSpaceLimit = this.getWorkspaceCheckError()

    return (
      <div className={styles.wrapper}>
        <div className={styles.sliderWrapper}>
          <div>CPU ({this.cpuUnit})</div>
          <Slider {...this.getCPUProps()} />
        </div>
        <div className={styles.sliderWrapper}>
          <div>
            {t('MEMORY')} ({this.memoryUnit})
          </div>
          <Slider {...this.getMemoryProps()} />
        </div>
        <div className={styles.inputWrapper}>
          <Columns className="is-gapless">
            <Column>
              <div className={styles.inputGroup}>
                <Icon name="cpu" size={48} />
                <div
                  className={classnames(styles.input, {
                    [styles.error]: cpuError || limit.requestCpuError,
                  })}
                >
                  <span className={styles.label}>
                    {t('WS_RESOURCE_REQUESTS')}
                  </span>
                  <div className={styles.inputBox}>
                    <Input
                      name="requests.cpu"
                      value={this.getRequest(this.state.requests.cpu)}
                      onChange={this.handleInputChange}
                      placeholder={t('NO_REQUEST')}
                    />
                    <span className={styles.unit}>{this.cpuUnit}</span>
                  </div>
                </div>
                <div
                  className={classnames(styles.input, {
                    [styles.error]: cpuError || limit.limitCpuError,
                  })}
                >
                  <span className={styles.label}>
                    {t('WS_RESOURCE_LIMITS')}
                  </span>
                  <div className={styles.inputBox}>
                    <Input
                      name="limits.cpu"
                      value={this.getLimit(this.state.limits.cpu)}
                      onChange={this.handleInputChange}
                      placeholder={t('NO_LIMIT')}
                    />
                    <span className={styles.unit}>{this.cpuUnit}</span>
                  </div>
                </div>
              </div>
            </Column>
            <Column>
              <div className={styles.inputGroup}>
                <Icon name="memory" size={48} />
                <div
                  className={classnames(styles.input, {
                    [styles.error]: memoryError || limit.requestMemoryError,
                  })}
                >
                  <span className={styles.label}>
                    {t('WS_RESOURCE_REQUESTS')}
                  </span>
                  <div className={styles.inputBox}>
                    <Input
                      name="requests.memory"
                      value={this.getRequest(this.state.requests.memory)}
                      onChange={this.handleInputChange}
                      placeholder={t('NO_REQUEST')}
                    />
                    <span className={styles.unit}>{this.memoryUnit}</span>
                  </div>
                </div>
                <div
                  className={classnames(styles.input, {
                    [styles.error]: memoryError || limit.limitMemoryError,
                  })}
                >
                  <span className={styles.label}>
                    {t('WS_RESOURCE_LIMITS')}
                  </span>
                  <div className={styles.inputBox}>
                    <Input
                      name="limits.memory"
                      value={this.getLimit(this.state.limits.memory)}
                      onChange={this.handleInputChange}
                      placeholder={t('NO_LIMIT')}
                    />
                    <span className={styles.unit}>{this.memoryUnit}</span>
                  </div>
                </div>
              </div>
            </Column>
            {supportGpuSelect && this.renderGpuSelect()}
          </Columns>
        </div>
        {this.ifRenderTip() && this.renderTip()}
        {(cpuError || memoryError) && (
          <Alert
            type="error"
            className="margin-t12"
            message={t('REQUEST_EXCEED_LIMIT')}
          />
        )}
        {outWorkSpaceLimit.length > 0 && (
          <Alert
            type="error"
            className="margin-t12"
            message={t('REQUEST_EXCEED_WORKSPACE')}
          />
        )}
      </div>
    )
  }
}
