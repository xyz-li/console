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
import GatewayStore from 'stores/gateway'
import withList, { ListPage } from 'components/HOCs/withList'
import Table from 'components/Tables/List'
import { Tooltip, Icon } from '@kube-design/components'
import { isEmpty } from 'lodash'

@withList({
  store: new GatewayStore(),
  name: 'PROJECT_GATEWAY',
  module: 'gateways',
})
export default class ProjectGatewayCard extends React.Component {
  getData = async ({ silent, ...params } = {}) => {
    const { store } = this.props

    silent && (store.list.silent = true)

    await store.fetchList({
      ...this.props.match.params,
      ...params,
    })

    store.list.silent = false
  }

  get routing() {
    return this.props.rootStore.routing
  }

  getGatewayResource = gatewayData => {
    const name = gatewayData.name.split('kubesphere-router-')[1]
    const namespace = name === 'kubesphere-system' ? '' : name
    const cluster = gatewayData.cluster
    return { cluster, namespace }
  }

  get itemActions() {
    const { trigger } = this.props

    return [
      {
        key: 'edit',
        icon: 'pen',
        text: t('EDIT'),
        action: 'edit',
        onClick: item => {
          trigger('gateways.edit', {
            detail: item._originData,
            ...this.getGatewayResource(item),
            success: this.routing.query,
          })
        },
      },
      {
        key: 'update',
        icon: 'update',
        text: t('Update Gateway'),
        action: 'manage',
        show: item => !item.createTime,
        onClick: item =>
          trigger('gateways.update', {
            detail: item._originData,
            ...this.getGatewayResource(item),
            success: this.routing.query,
          }),
      },
      {
        key: 'delete',
        icon: 'trash',
        text: t('DELETE'),
        action: 'delete',
        onClick: item =>
          trigger('gateways.delete', {
            detail: item,
            ...this.getGatewayResource(item),
            success: this.routing.query,
          }),
      },
    ]
  }

  get tableActions() {
    const { tableProps, trigger } = this.props
    return {
      ...tableProps.tableActions,
      selectActions: [
        {
          key: 'delete',
          type: 'danger',
          text: t('DELETE'),
          action: 'delete',
          onClick: () =>
            trigger('gateways.batch.delete', {
              type: t(this.name),
              rowKey: 'name',
              success: this.routing.query,
            }),
        },
      ],
      onFetch: this.handleFetch,
    }
  }

  handleFetch = (params, refresh) => {
    this.routing.query({ ...params, type: this.type }, refresh)
  }

  renderDisabledTip(record) {
    if (!record.createTime) {
      return (
        <Tooltip content={t('UPDATE_GATEWAY_DESC')} placement="top">
          <Icon
            name="update"
            color={{
              primary: '#ffc781',
              secondary: '#f5a623',
            }}
          />
        </Tooltip>
      )
    }

    return null
  }

  getColumns = () => {
    const { getSortOrder } = this.props
    return [
      {
        title: t('PROJECT_GATEWAY'),
        dataIndex: 'name',
        sorter: true,
        sortOrder: getSortOrder('name'),
        render: (name, record) => {
          return (
            <span>
              {name}
              {this.renderDisabledTip(record)}
            </span>
          )
        },
      },
      {
        title: t('ACCESS_MODE'),
        dataIndex: 'type',
      },
      {
        title: t('GATEWAY_IP'),
        dataIndex: 'defaultIngress',
      },
      {
        title: t('Host Port'),
        dataIndex: 'ports',
        render: ports => {
          return isEmpty(ports)
            ? '-'
            : ports.map(item => `${item.name}:${item.nodePort}`).join(';')
        },
      },
      {
        title: t('REPLICAS'),
        dataIndex: 'replicas',
      },
      {
        title: t('Application Governance'),
        dataIndex: 'serviceMeshEnable',
        render: serviceMeshEnable =>
          serviceMeshEnable
            ? t('GATEWAY_SERVICE_MESH_STATUS_ON')
            : t('GATEWAY_SERVICE_MESH_STATUS_OFF'),
      },
    ]
  }

  render() {
    const { tableProps } = this.props

    return (
      <ListPage {...this.props} getData={this.getData} noWatch>
        <Table
          {...tableProps}
          itemActions={this.itemActions}
          tableActions={this.tableActions}
          columns={this.getColumns()}
          onCreate={null}
          searchType="name"
        />
      </ListPage>
    )
  }
}
