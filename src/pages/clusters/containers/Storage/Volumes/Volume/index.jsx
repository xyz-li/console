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
 *
 * along with KubeSphere Console.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react'
import { isEmpty } from 'lodash'
import { withClusterList, ListPage } from 'components/HOCs/withList'
import ResourceTable from 'clusters/components/ResourceTable'
import VolumeStore from 'stores/volume'
import { getLocalTime, getDisplayName } from 'utils'
import { getVolumeStatus } from 'utils/status'
import { VOLUME_STATUS } from 'utils/constants'
import StatusReason from 'projects/components/StatusReason'

import { Avatar, Status } from 'components/Base'

import { Link } from 'react-router-dom'

@withClusterList({
  store: new VolumeStore(),
  module: 'persistentvolumeclaims',
  authKey: 'volumes',
  name: 'VOLUME',
  rowKey: 'uid',
})
export default class Volumes extends React.Component {
  get tips() {
    return [
      {
        title: t('WHAT_IS_STORAGE_CLASS_Q'),
        description: t('WHAT_IS_STORAGE_CLASS_A'),
      },
      {
        title: t('WHAT_IS_LOCAL_VOLUME_Q'),
        description: t('WHAT_IS_LOCAL_VOLUME_A'),
      },
    ]
  }

  get tabs() {
    return {
      value: 'Volume',
      onChange: this.handleTabChange,
      options: [
        {
          value: `Volume`,
          label: t('VOLUME'),
        },
        {
          value: 'PV',
          label: t('PV'),
        },
      ],
    }
  }

  handleTabChange = () => {
    const { cluster } = this.props.match.params
    this.props.rootStore.routing.push(`/clusters/${cluster}/PV`)
  }

  showAction = record => !record.isFedManaged

  get itemActions() {
    const { trigger, name } = this.props

    return [
      {
        key: 'edit',
        icon: 'pen',
        text: t('EDIT'),
        action: 'edit',
        show: this.showAction,
        onClick: item =>
          trigger('resource.baseinfo.edit', {
            detail: item,
          }),
      },
      {
        key: 'editYaml',
        icon: 'pen',
        text: t('EDIT_YAML'),
        action: 'edit',
        show: this.showAction,
        onClick: item =>
          trigger('resource.yaml.edit', {
            detail: item,
          }),
      },
      {
        key: 'delete',
        icon: 'trash',
        text: t('DELETE'),
        action: 'delete',
        show: this.showAction,
        onClick: item =>
          trigger('resource.delete', {
            type: t(name),
            detail: item,
          }),
      },
    ]
  }

  getItemDesc = record => {
    const status = getVolumeStatus(record)
    const desc = !isEmpty(status) ? (
      <StatusReason reason={status} data={record} type={'volume'} />
    ) : (
      record.storageClassName || '-'
    )

    return desc
  }

  getCheckboxProps = record => ({
    disabled: record.isFedManaged,
    name: record.name,
  })

  getStatus() {
    return VOLUME_STATUS.map(status => ({
      text: t(status.text),
      value: status.value,
    }))
  }

  getColumns() {
    const { getSortOrder, getFilteredValue } = this.props
    const { cluster } = this.props.match.params

    const pvColumn = {
      title: t('VOLUME_BACKEND_TCAP'),
      dataIndex: '_originData',
      isHideable: true,
      search: false,
      width: '28.5%',
      render: _ => (
        <Link to={`/clusters/${cluster}/pv/${_.spec.volumeName}`}>
          {_.spec.volumeName}
        </Link>
      ),
    }

    const allColumns = [
      {
        title: t('NAME'),
        dataIndex: 'name',
        sortOrder: getSortOrder('name'),
        search: true,
        sorter: true,
        render: (name, record) => (
          <Avatar
            icon={'storage'}
            iconSize={40}
            to={`/clusters/${cluster}/projects/${record.namespace}/volumes/${name}`}
            isMultiCluster={record.isFedManaged}
            desc={this.getItemDesc(record)}
            title={getDisplayName(record)}
          />
        ),
      },
      {
        title: t('STATUS'),
        dataIndex: 'status',
        isHideable: true,
        search: true,
        filters: this.getStatus(),
        filteredValue: getFilteredValue('status'),
        width: '8.8%',
        render: (_, { phase }) => (
          <Status
            type={phase}
            name={t(`VOLUME_STATUS_${phase.toUpperCase()}`)}
            flicker
          />
        ),
      },
      {
        title: t('ACCESS_MODE_TCAP'),
        dataIndex: 'capacity',
        isHideable: true,
        width: '12.32%',
        render: (capacity, { accessMode }) => (
          <div>
            <p>{accessMode}</p>
          </div>
        ),
      },
      {
        title: t('MOUNT_STATUS'),
        dataIndex: 'inUse',
        isHideable: true,
        width: '7.74%',
        render: inUse => (inUse ? t('MOUNTED_TCAP') : t('NOT_MOUNTED')),
      },
      {
        title: t('CREATED_AT'),
        dataIndex: 'createTime',
        sorter: true,
        sortOrder: getSortOrder('createTime'),
        isHideable: true,
        width: 140,
        render: time => getLocalTime(time).format('YYYY-MM-DD HH:mm'),
      },
    ]

    if (this.props.store.supportPv) {
      allColumns.splice(2, 0, pvColumn)
    }

    return allColumns
  }

  showCreate = () => {
    const { store, match, module } = this.props

    return this.props.trigger('volume.create', {
      store,
      module,
      cluster: match.params.cluster,
    })
  }

  render() {
    const { tableProps, match } = this.props
    return (
      <ListPage {...this.props}>
        <ResourceTable
          {...tableProps}
          itemActions={this.itemActions}
          columns={this.getColumns()}
          onCreate={this.showCreate}
          cluster={match.params.cluster}
          getCheckboxProps={this.getCheckboxProps}
        />
      </ListPage>
    )
  }
}
