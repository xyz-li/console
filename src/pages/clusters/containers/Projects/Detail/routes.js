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

import { getIndexRoute } from 'utils/router.config'

import Overview from './Overview'
import Pods from './Pods'
import Gateway from './Gateway'
import Quota from './Quota'

const PATH = '/clusters/:cluster/projects/:namespace'

export default [
  {
    path: `${PATH}/overview`,
    title: 'Project Overview',
    component: Overview,
    exact: true,
  },
  { path: `${PATH}/pods`, title: 'Pods', component: Pods, exact: true },
  {
    path: `${PATH}/gateway`,
    title: 'Gateway Info',
    component: Gateway,
    exact: true,
  },
  {
    path: `${PATH}/quota`,
    title: 'PROJECT_QUOTA',
    component: Quota,
    exact: true,
  },
  getIndexRoute({ path: PATH, to: `${PATH}/overview`, exact: true }),
]
