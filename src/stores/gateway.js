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

import { get, isEmpty } from 'lodash'

import { action, observable } from 'mobx'

import { LIST_DEFAULT_ORDER } from 'utils/constants'
import ObjectMapper from 'utils/object.mapper'

import Base from './base'
import List from './base.list'

export default class Gateway extends Base {
  module = 'gateways'

  getOldGatewayUrl = params =>
    `kapis/resources.kubesphere.io/v1alpha2${this.getPath(params)}/router`

  gatewayUrl = ({ cluster, namespace, gatewayName = '' }) =>
    `/${
      this.isCluster(namespace) ? 'k' : ''
    }apis/gateway.kubesphere.io/v1alpha1/${this.getPath({
      namespace: namespace || 'kubesphere-controls-system',
      cluster,
    })}/${this.module}${
      this.isCluster(namespace)
        ? `/${gatewayName}`
        : '/kubesphere-router-kubesphere-system'
    }`

  isCluster(namespace) {
    return namespace && namespace !== 'kubesphere-controls-system'
  }

  @observable
  gateway = {
    data: {},
    isLoading: true,
  }

  @observable
  podList = new List()

  @observable
  logs = new List()

  @action
  async getGateway(params) {
    this.gateway.isLoading = true
    const url = this.gatewayUrl(params)
    const result = await request.get(url, null, null, () => {})
    let data = {}

    if (result && !isEmpty(result)) {
      if (this.isCluster(params.namespace)) {
        const gatewayData = result
          .map(item => ObjectMapper.gateway(item))
          .find(item => item.name.indexOf(params.namespace) > -1)

        data = gatewayData
      } else {
        data = ObjectMapper.gateway(result)
      }
    }
    this.detail = data
    this.gateway.data = data
    this.gateway.isLoading = false
  }

  @action
  async addGateway(params, data) {
    return this.submitting(request.post(this.gatewayUrl(params), data))
  }

  @action
  async editGateway(params, data) {
    return this.submitting(request.put(this.gatewayUrl(params), data))
  }

  @action
  async deleteGateway(params) {
    return this.submitting(request.delete(this.gatewayUrl(params)))
  }

  @action
  async updateGateway(params, data) {
    const url = `${this.gatewayUrl(params)}/upgrade`
    return this.submitting(request.post(url, data))
  }

  @action
  async getGatewayLogs({ cluster, namespace, gatewayName, more, ...params }) {
    this.logs.isLoading = true

    if (!params.sortBy && params.ascending === undefined) {
      params.sortBy = LIST_DEFAULT_ORDER[this.module] || 'createTime'
    }

    if (params.limit === Infinity || params.limit === -1) {
      params.limit = -1
      params.page = 1
    }

    params.limit = params.limit || 10

    const result = await request.get(
      `${this.gatewayUrl({ cluster, namespace, gatewayName })}/log`,
      {
        ...params,
      },
      {},
      () => {
        return []
      }
    )

    const data = (get(result, 'items') || []).map(item => ({
      cluster,
      namespace: item.metadata.name.split('kubesphere-router-')[1],
      ...ObjectMapper.pods(item),
    }))

    this.logs.update({
      data: more ? [...this.list.data, ...data] : data,
      total: result.totalItems || result.total_count || data.length || 0,
      ...params,
      limit: Number(params.limit) || 10,
      page: Number(params.page) || 1,
      isLoading: false,
      ...(this.list.silent ? {} : { selectedRowKeys: [] }),
    })

    return []
  }

  @action
  async getGatewayPods(params) {
    const url = `${this.gatewayUrl(params)}/pods`
    const result = await this.submitting(request.get(url))
    let pods = []
    if (result && result.totalItems > 0) {
      pods = result.items.map(item => ObjectMapper.pods(item))
    }
    this.gateway.data.pods = pods
    return pods
  }

  @action
  async getGatewayPodsList({
    cluster,
    name,
    gatewayName,
    namespace,
    workspace,
    more,
    ...params
  }) {
    this.podList.isLoading = true

    if (!params.sortBy && params.ascending === undefined) {
      params.sortBy = LIST_DEFAULT_ORDER[this.module] || 'createTime'
    }

    if (params.limit === Infinity || params.limit === -1) {
      params.limit = -1
      params.page = 1
    }

    params.limit = params.limit || 10

    const result = await request.get(
      `${this.gatewayUrl({ cluster, namespace, gatewayName })}/pods`,
      {
        ...params,
      },
      {},
      () => {
        return []
      }
    )

    const data = (get(result, 'items') || []).map(item => ({
      cluster,
      namespace: item.metadata.name.split('kubesphere-router-')[1],
      ...ObjectMapper.pods(item),
    }))

    this.podList.update({
      data: more ? [...this.list.data, ...data] : data,
      total: result.totalItems || result.total_count || data.length || 0,
      ...params,
      limit: Number(params.limit) || 10,
      page: Number(params.page) || 1,
      isLoading: false,
      ...(this.list.silent ? {} : { selectedRowKeys: [] }),
    })

    return []
  }

  @action
  scale(params, newReplicas) {
    const data = this.gateway.data._originData
    data.spec.deployment.replicas = newReplicas
    return this.submitting(request.put(this.gatewayUrl(params), data))
  }

  @action
  async fetchList({ cluster, namespace, more, component, ...params }) {
    this.list.isLoading = true

    if (!params.sortBy && params.ascending === undefined) {
      params.sortBy = LIST_DEFAULT_ORDER[this.module] || 'createTime'
    }

    if (params.limit === Infinity || params.limit === -1) {
      params.limit = -1
      params.page = 1
    }

    params.limit = params.limit || 10

    const result = await request.get(
      `/kapis/gateway.kubesphere.io/v1alpha1/${this.getPath({
        cluster,
      })}/gateways`,
      {
        ...params,
      },
      {},
      () => {
        return []
      }
    )

    const data = (get(result, 'items') || []).map(item => ({
      cluster,
      namespace: item.metadata.name.split('kubesphere-router-')[1],
      ...ObjectMapper.gateway(item),
    }))

    this.list.update({
      data: more ? [...this.list.data, ...data] : data,
      total: result.totalItems || result.total_count || data.length || 0,
      ...params,
      limit: Number(params.limit) || 10,
      page: Number(params.page) || 1,
      isLoading: false,
      ...(this.list.silent ? {} : { selectedRowKeys: [] }),
    })

    return []
  }
}
