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
  GATEWAY_SETTING: '網關設置',
  GATEWAY_DESC: '對集群和項目中的外網訪問網關以及服務治理等配置進行設置和管理',
  CLUSTER_GATEWAY: '集群網關',
  PROJECT_GATEWAY: '項目網關',
  CLUSTER_GATEWAYS_SETTING_DESC:
    '創建應用路由之前，需要先啟用外網訪問入口，即網關。這一步是創建對應的應用路由控制器，負責將請求轉發到對應的後端服務。 ',
  PROJECT_GATEWAYS_SETTING_DESC:
    '集群管理頁面不支持項目網關的設置，如需設置需要轉到對應項目下進行設置。 ',
  'Cluster Gateway Not Set': '集群網關未設置',
  'Project Gateway Not Set': '沒有找到 項目網關',
  'Gateway Not Set': '網關未設置',
  'View Gateway': '查看網關',
  'Set Gateway': '設置網關',
  'Edit Gateway': '編輯網關',
  'Update Gateway': '更新網關',
  'Gateway Config': '網關配置',
  'Add Gateway Config': '添加網關配置',
  'LoadBalancer Support': 'LoadBalancer提供商',
  'Use default annotations': '使用默認註解',
  GATEWAY_IP: '訪問地址',
  UPDATE_GATEWAY_DESC: '當前網關可升級',
  DISK_LOG_COLLECTION_TITLE: '落盤日誌',
  DISK_LOG_COLLECTION_DESC:
    '容器內的落盤日誌進行收集，並轉發到標準輸出，然後由日誌收集系統統一採集。 ',
  UPDATED_GATEWAY_DESC: '請在業務低峰期操作，升級過程可能會造成業務短暫中斷。 ',
  UPDATED_GATEWAY_TITLE: '升級網關確認?',
  CLUSTER_GATEWAY_GUIDE_DESC:
    '開啟集群網關後，無法再設置項目網關。若已存在項目網關，刪除後無法重新設置。 ',
  'Request Count': '請求量',
  'Active Connections': '連接數',
  'Request Duration': '請求延遲',
  'Request Error': '請求錯誤',
  'Duration Average': '平均延遲',
  'Duration 50percentage': 'P50 延遲',
  'Duration 95percentage': 'P95 延遲',
  'Duration 99percentage': 'P99 延遲',
  'Request 4xx': '4xx 錯誤',
  'Request 5xx': '5xx 錯誤',
  'Total Requests': '總請求數',
  'Request Success': '請求成功',
  GATEWAYS_REPLICA_DESC:
    '部署 (Deployment) 用來描述期望應用達到的目標狀態，主要用來描述無狀態應用，副本的數量和狀態由其背後的控制器來維護，確保狀態與定義的期望狀態一致。您可以增加副本數量來滿足更高負載；回滾部署的版本來消除程序的錯誤修改；創建自動伸縮器來彈性應對不同場景下的負載。 ',
}
