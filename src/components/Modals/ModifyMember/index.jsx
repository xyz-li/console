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

import { get } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import { Form, Select } from '@kube-design/components'
import { Modal } from 'components/Base'

import styles from './index.scss'

@observer
export default class ModifyMemberModal extends React.Component {
  static propTypes = {
    role: PropTypes.string,
    roles: PropTypes.array,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
  }

  static defaultProps = {
    role: '',
    roles: [],
    visible: false,
    isSubmitting: false,
    onOk() {},
    onCancel() {},
  }

  handleOk = (data = {}) => {
    const { onOk } = this.props
    const { role } = data
    onOk(role)
  }

  getRoleOptions = () => {
    const { roles } = this.props
    return roles.map(role => {
      const desc = get(role, 'description')
      return {
        label: role.name,
        value: role.name,
        desc: t(desc),
      }
    })
  }

  optionRenderer = option => (
    <div className={styles.option}>
      <div>{option.label}</div>
      <p>{option.desc}</p>
    </div>
  )

  render() {
    const { visible, onCancel, isSubmitting, role } = this.props

    return (
      <Modal.Form
        width={691}
        title={t('CHANGE_MEMBER_ROLE')}
        icon="role"
        onOk={this.handleOk}
        onCancel={onCancel}
        visible={visible}
        isSubmitting={isSubmitting}
      >
        <Form.Item
          label={t('ROLE')}
          rules={[{ required: true, message: t('SELECT_ROLE_TIP') }]}
        >
          <Select
            name="role"
            optionRenderer={this.optionRenderer}
            options={this.getRoleOptions()}
            defaultValue={role}
          />
        </Form.Item>
      </Modal.Form>
    )
  }
}
