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
  DEVOPS_NAME: 'DevOps 工程名稱',
  DEVOPS_PROJECT: 'DevOps 工程',
  'DevOps Role': '成員角色',
  'DevOps Roles': '成員角色',
  'DevOps Member': '工程成員',
  'DevOps Members': '工程成員',
  DEVOPS_PROJECT_CREDENTIAL_PL: 'DevOps 工程憑證',
  DEVOPS_CREDENTIAL_EMPTY_DESC: 'Please create a DevOps credential.',
  DEVOPS_CREDENTIAL_LOW: 'DevOps 憑證',
  'DevOps Basic Info': '基本資訊',
  DEVOPS_PROJECT_MANAGEMENT: '工程管理',
  DEVOPS_PROJECT_SETTINGS: '工程管理',
  MANAGE_DEVOPS_PROJECT: 'Manage DevOps Project',
  DEVOPS_PROJECT_MEMBER_PL: 'DevOps 工程成員',
  DEVOPS_PROJECT_ROLE_PL: 'DevOps 工程角色',

  MANAGER: '管理員',
  'DevOps Project Manager': 'DevOps 工程管理員',
  CREATE_DEVOPS_PROJECT: '創建 DevOps 工程',
  DELETE_DEVOPS_PROJECT: '刪除 DevOps 工程',

  DEVOPS_BASEINFO_DESC: '請輸入 DevOps 工程的基本資訊',

  DEVOPS_DESCRIPTION:
    'DevOps 是一個獨立的命名空間，其中定義了一組流水線。用戶可以按照自己的方式對流水線進行分組（例如：項目類型、組織類型）。',
  DEVOPS_PROJECT_CREATE_DESC:
    'DevOps 是一個獨立的命名空間，其中定義了一組流水線；用戶可以按照自己的方式對流水線進行分組 (例如：項目類型、組織類型)。',
  DEVOPS_PROJECT_EMPTY_DESC: 'Please create a DevOps project.',
  PIPELINE_EMPTY_DESC: 'Please create a pipeline.',
  DEVOPS_ADMIN_DESC: '指定工程内一個成員為管理員。',

  NO_RELATE_DEVOPS_TITLE: '沒有找到與您相關聯的 DevOps 工程',
  NO_RELATE_DEVOPS_DESC:
    '您可以創建或者聯繫項目管理員將您邀請到 DevOps 工程中開始您的工作',

  DEVOPS_PROJECT_CREDENTIALS_DESC:
    '憑證是包含了一些敏感數據的對象，如用戶名密碼，SSH 密鑰和令牌等，用於在流水線運行時，為拉取代碼、拉取或推送鏡像、SSH 執行腳本等過程提供認證。',

  DEVOPS_PROJECT_ROLES_DESC:
    '成員角色定義了在目前 DevOps 工程下用戶所擁有的權限。',

  DEVOPS_PROJECT_MEM_DESC: '對工程内的成員進行管理及角色分配。',

  DELETE_DEVOPS_TIP:
    '確定刪除 DevOps 工程 <strong>{resource}</strong> ? 刪除後將無法恢復, 工程下的資源也同時會被銷毀。',

  DEVOPS_TIP_GITOPS_Q: '如何落地 GitOps？',
  DEVOPS_TIP_GITOPS_A:
    '創建關聯代碼倉庫的流水線，並積極使用部署 Kubernetes 部署步驟，就可以實現 GitOps 了。',

  DEVOPS_TIP_TYPE_Q: '流水線 (Pipeline) 支持哪些代碼倉庫類別？',
  DEVOPS_TIP_TYPE_A:
    '流水線支持 Git、GitHub、Gitlab、SVN、以及 Bitbucket 代碼倉庫.',

  NO_DEVOPS_INSTALL: '未安裝 DevOps',

  // Credentials Creation Page
  SECRET_DEVOPS: '密鑰',
  CONTENT: '內容',
  INVALID_ID_TIP:
    'ID 最長 63 個字元，只能包含小寫字母、數字及分隔符號（-），且必須以小寫字母或數字開頭及結尾。',
}
