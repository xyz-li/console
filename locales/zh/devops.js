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

module.exports = {
  DEVOPS_NAME: 'DevOps 工程名称',
  DEVOPS_PROJECT: 'DevOps 工程',
  'DevOps Role': '成员角色',
  'DevOps Roles': '成员角色',
  'DevOps Member': '工程成员',
  'DevOps Members': '工程成员',
  DEVOPS_PROJECT_CREDENTIAL_PL: 'DevOps 工程凭证',
  DEVOPS_CREDENTIAL_EMPTY_DESC: '请创建一个 DevOps 凭证。',
  DEVOPS_CREDENTIAL_LOW: 'DevOps 凭证',
  'DevOps Basic Info': '基本信息',
  DEVOPS_PROJECT_MANAGEMENT: '工程管理',
  DEVOPS_PROJECT_SETTINGS: 'DevOps 工程设置',
  MANAGE_DEVOPS_PROJECT: '管理 DevOps 工程',
  DEVOPS_PROJECT_MEMBER_PL: 'DevOps 工程成员',
  DEVOPS_PROJECT_ROLE_PL: 'DevOps 工程角色',

  MANAGER: '管理员',
  Administrator: '管理员',
  'DevOps Project Manager': 'DevOps 工程管理员',
  CREATE_DEVOPS_PROJECT: '创建 DevOps 工程',
  DELETE_DEVOPS_PROJECT: '删除 DevOps 工程',

  DEVOPS_BASEINFO_DESC: '请输入 DevOps 工程的基本信息',

  DEVOPS_DESCRIPTION:
    'DevOps 工程是一个独立的命名空间，其中定义了一组流水线。用户可以按照自己的方式对流水线进行分组（例如：项目类型、组织类型）。',
  DEVOPS_PROJECT_CREATE_DESC:
    'DevOps 是一个独立的命名空间，其中定义了一组的流水线；用户可以按照自己的方式对流水线进行分组 (例如：项目类型、组织类型)。',
  DEVOPS_PROJECT_EMPTY_DESC: '请创建一个 DevOps 工程。',
  PIPELINE_EMPTY_DESC: '请创建一个流水线。',
  DEVOPS_ADMIN_DESC: '指定工程内一个成员为管理员。',

  NO_RELATE_DEVOPS_TITLE: '没有找到与您相关联的 DevOps 工程',
  NO_RELATE_DEVOPS_DESC:
    '您可以创建或者联系项目管理员将您邀请到 DevOps 工程中开始您的工作',

  DEVOPS_PROJECT_CREDENTIALS_DESC:
    '凭证是包含了一些敏感数据的对象，如用户名密码、SSH 密钥和令牌等，用于在流水线运行时, 为拉取代码、推送或拉取镜像、SSH 执行脚本等过程提供认证。',

  DEVOPS_PROJECT_ROLES_DESC:
    '成员角色定义了在当前 DevOps 工程下用户所拥有的权限。',

  DEVOPS_PROJECT_MEM_DESC: '对工程内的成员进行管理及角色分配。',

  DELETE_DEVOPS_TIP:
    '确定删除 DevOps 工程 <strong>{resource}</strong> ? 删除后将无法恢复, 工程下的资源也同时会被销毁。',

  DEVOPS_TIP_GITOPS_Q: '如何落地 GitOps？',
  DEVOPS_TIP_GITOPS_A:
    '创建关联代码仓库的流水线，并积极使用部署 Kubernetes 部署步骤，就可以实现 GitOps 了。',

  DEVOPS_TIP_TYPE_Q: '流水线 (Pipeline) 支持哪些代码仓库类？',
  DEVOPS_TIP_TYPE_A:
    '流水线支持 Git、GitHub、Gitlab、SVN、以及 Bitbucket 代码仓库.',

  NO_DEVOPS_INSTALL: '未安装 DevOps',

  // Credentials Creation Page
  SECRET_DEVOPS: '密钥',
  CONTENT: '内容',
  INVITE_DEVOPS_MEMBER: 'Invite Members to the Project',
  INVALID_ID_TIP:
    'ID 只能包含小写字母、数字和连字符（-），必须以小写字母或数字开头和结尾，最长 63 个字符。',
}
