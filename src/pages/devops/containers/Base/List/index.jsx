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

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Loading } from '@kube-design/components'

import { renderRoutes } from 'utils/router.config'
import { Nav } from 'components/Layout'
import Selector from 'projects/components/Selector'

import styles from './index.scss'

@inject('rootStore', 'devopsStore')
@observer
class DevOpsListLayout extends Component {
  get workspace() {
    return this.props.match.params.workspace
  }

  get cluster() {
    return this.props.match.params.cluster
  }

  get devops() {
    return this.props.match.params.devops
  }

  get routing() {
    return this.props.rootStore.routing
  }

  handleChange = url => this.routing.push(url)

  render() {
    const { match, route, location } = this.props
    const { initializing, detail } = this.props.devopsStore

    if (initializing) {
      return <Loading className={styles.loading} />
    }

    return (
      <div className="ks-page">
        <div className="ks-page-side">
          <Selector
            type="devops"
            title={t('DEVOPS_PROJECT')}
            detail={detail}
            onChange={this.handleChange}
            workspace={this.workspace}
            cluster={this.cluster}
          />
          <Nav
            className="ks-page-nav"
            navs={globals.app.getDevOpsNavs({
              devops: this.devops,
              cluster: this.cluster,
              workspace: this.workspace,
            })}
            location={location}
            match={match}
          />
        </div>

        <div className="ks-page-main">{renderRoutes(route.routes)}</div>
      </div>
    )
  }
}

export default DevOpsListLayout
