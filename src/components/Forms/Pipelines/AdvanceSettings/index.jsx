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

import { get, isEmpty, set } from 'lodash'
import React from 'react'
import { observer } from 'mobx-react'
import {
  Checkbox,
  Column,
  Columns,
  Form,
  Icon,
  Input,
  Select,
  Tooltip,
} from '@kube-design/components'

import { NumberInput } from 'components/Inputs'
import { getLocalTime, learnMoreTip } from 'utils'
import { TIMETRIGGERINTERVALS, REPO_KEY_MAP } from 'utils/constants'

import ScmStore from 'stores/devops/scm'
import PipelineStore from 'stores/devops/pipelines'

import ParamsInput from '../ParamsInput'
import ActionsInput from '../ActionsInput'
import styles from './index.scss'

@observer
export default class AdvanceSettings extends React.Component {
  constructor(props) {
    super(props)

    this.scmStore = new ScmStore()
    this.pipelineStore = new PipelineStore()
    this.state = { cronMessage: {} }
  }

  static defaultProps = {
    type: 'create',
  }

  get sourceType() {
    const { formTemplate } = this.props
    return get(formTemplate, 'multi_branch_pipeline.source_type', '')
  }

  get prefix() {
    if (this.sourceType) {
      return 'multi_branch_pipeline'
    }
    return 'pipeline'
  }

  get scmPrefix() {
    return `multi_branch_pipeline.${REPO_KEY_MAP[this.sourceType]}`
  }

  get webhookUrl() {
    const { formTemplate } = this.props
    const url = get(formTemplate, `${this.scmPrefix}.url`, '')
    const api_uri = get(formTemplate, `${this.scmPrefix}.api_uri`, '')
    const owner = get(formTemplate, `${this.scmPrefix}.owner`, '')
    const repo = get(formTemplate, `${this.scmPrefix}.repo`, '')
    const bitbucket_url = `${api_uri}/scm/${owner}/${repo}.git`

    switch (this.sourceType) {
      case 'bitbucket_server':
        return `${window.location.protocol}//${window.location.host}/devops_webhook/git/?url=${bitbucket_url}`
      case 'github':
        return `${window.location.protocol}//${window.location.host}/devops_webhook/${this.sourceType}/`
      default:
        return `${window.location.protocol}//${window.location.host}/devops_webhook/git/?url=${url}`
    }
  }

  get pipelineLists() {
    const { data } = this.pipelineStore.list
    return data.map(pipeline => ({
      label: pipeline.name,
      value: pipeline.fullName,
    }))
  }

  componentDidMount() {
    const { devopsName, cluster, devops } = this.props.formTemplate
    this.pipelineStore.fetchList({
      devopsName,
      devops,
      cluster,
      filter: 'no-folders',
    })
  }

  handleChange = key => value => {
    const { formTemplate } = this.props
    set(formTemplate, key, value)
    this.forceUpdate()
  }

  removeCronError = () => {
    if (this.state.cronMessage) {
      this.setState({ cronMessage: {} })
    }
  }

  checkCronScript = async (rule, value, callback) => {
    const { formTemplate, type } = this.props
    const { name, cluster, devops } = formTemplate
    const script = value

    const result = await this.scmStore.checkCronScript({
      devops,
      script,
      cluster,
      pipeline: type === 'create' ? undefined : name,
    })

    if (result.result === 'error') {
      this.setState({ cronMessage: { error: result.message } }, () => {})
      callback(result.message)
      return
    }

    if (result.result === 'ok') {
      const message = t('CRON_DESC', {
        lastTime: getLocalTime(result.lastTime).format(
          `${t('MMMM Do YYYY')} HH:mm:ss`
        ),
        nextTime: getLocalTime(result.nextTime).format(
          `${t('MMMM Do YYYY')} HH:mm:ss`
        ),
      })
      this.setState({ cronMessage: { message } })
      callback()
    }
  }

  handleScrollToBottom = () => {
    const { devopsName, cluster, devops } = this.props.formTemplate
    const { total, page, limit } = this.pipelineStore.list

    if (total <= limit * page) {
      return
    }

    this.pipelineStore.fetchList({
      devopsName,
      cluster,
      devops,
      filter: 'no-folders',
      page: page + 1,
    })
  }

  renderTip(tip) {
    return (
      <Tooltip content={tip} placement="right">
        <Icon name="question" className="margin-l12" />
      </Tooltip>
    )
  }

  renderNoSource() {
    const { formTemplate } = this.props
    const enable_timer_trigger = get(formTemplate, 'enable_timer_trigger')
    const enable_remote_trigger = get(formTemplate, 'enable_remote_trigger')
    const htmlDes = t.html('PIPELINE_CRONJOB_CRON_DESC')

    return (
      <div>
        <Form.Item desc={t('NO_CONCURRENT_BUILD_DESC')}>
          <Checkbox
            name={`${this.prefix}.disable_concurrent`}
            checked={get(formTemplate, `${this.prefix}.disable_concurrent`)}
            onChange={this.handleChange(`${this.prefix}.disable_concurrent`)}
          >
            {t('NO_CONCURRENT_BUILDS')}
          </Checkbox>
        </Form.Item>
        <div className="h6">
          <>
            {t('PARAMETERIZED_BUILD')}
            {this.renderTip(t('PARAMETERIZED_BUILD_TIP'))}
          </>
        </div>
        <ParamsInput
          name={`${this.prefix}.parameters`}
          formTemplate={this.props.formTemplate}
        />
        <div className="h6">{t('BUILD_TRIGGER')}</div>
        <Form.Item>
          <Checkbox
            name={`enable_timer_trigger`}
            checked={enable_timer_trigger}
            onChange={this.handleChange('enable_timer_trigger')}
          >
            {t('SCHEDULED_BUILD')}
            {this.renderTip(t('SCHEDULED_BUILD_TIP'))}
          </Checkbox>
        </Form.Item>
        {enable_timer_trigger && (
          <div className={styles.wrapper}>
            <Columns>
              <Column>
                <Form.Item
                  label={t('SCHEDULE')}
                  desc={this.state.cronMessage.message || learnMoreTip(htmlDes)}
                  tip={t('CRON_TIP')}
                  rules={[{ validator: this.checkCronScript }]}
                >
                  <Input
                    name={`${this.prefix}.timer_trigger.cron`}
                    placeholder=" "
                    onChange={this.removeCronError}
                  />
                </Form.Item>
              </Column>
            </Columns>
          </div>
        )}
        <Form.Item>
          <Checkbox
            name="enable_remote_trigger"
            checked={enable_remote_trigger}
            onChange={this.handleChange('enable_remote_trigger')}
          >
            {t('TRIGGER_REMOTE_BUILD')}
          </Checkbox>
        </Form.Item>
        {enable_remote_trigger && (
          <div className={styles.wrapper}>
            <Form.Item
              label={t('Authentication Token')}
              desc={t('AUTHENTICATION_TOKEN_DESC')}
              tip={t('AUTHENTICATION_TOKEN_TIP')}
            >
              <Input
                name={`${this.prefix}.remote_trigger.token`}
                placeholder=" "
              />
            </Form.Item>
          </div>
        )}
      </div>
    )
  }

  renderGitOptions() {
    const { formTemplate } = this.props

    return (
      <>
        <div className="h6">{t('GIT_CLONE_OPTIONS')}</div>
        <Columns>
          <Column>
            <Form.Item label={t('CLONE_DEPTH')}>
              <NumberInput
                name={`${this.scmPrefix}.git_clone_option.depth`}
                defaultValue={1}
              />
            </Form.Item>
          </Column>
          <Column>
            <Form.Item label={t('PIPELINE_CLONE_TIMEOUT')}>
              <NumberInput
                name={`${this.scmPrefix}.git_clone_option.timeout`}
                defaultValue={20}
              />
            </Form.Item>
          </Column>
        </Columns>
        <Form.Item>
          <Checkbox
            checked={get(
              formTemplate,
              `${this.scmPrefix}.git_clone_option.shallow`,
              false
            )}
            name={`${this.scmPrefix}.git_clone_option.shallow`}
            onChange={this.handleChange(
              `${this.scmPrefix}.git_clone_option.shallow`
            )}
          >
            {t('ENABLE_SHALLOW_CLONE')}
          </Checkbox>
        </Form.Item>
        <div className="h6">{t('WEBHOOK_PUSH')}</div>
        <Form.Item label={t('WEBHOOK_PUSH_URL')} tip={t('WEBHOOK_DESC')}>
          <Input value={this.webhookUrl} disabled />
        </Form.Item>
      </>
    )
  }

  renderRegFilter() {
    const { formTemplate } = this.props
    const { enable_regex_filter } = formTemplate

    return (
      <>
        <Form.Item>
          <Checkbox
            checked={enable_regex_filter}
            name="enable_regex_filter"
            onChange={this.handleChange('enable_regex_filter')}
          >
            {t('REG_FILTER_DESC')}
          </Checkbox>
        </Form.Item>
        {enable_regex_filter && (
          <div className={styles.wrapper}>
            <Form.Item label={t('REGEX_FILTER')}>
              <Input
                name={`${this.scmPrefix}.regex_filter`}
                defaultValue=".*"
              />
            </Form.Item>
          </div>
        )}
      </>
    )
  }

  renderWithSource() {
    const { formTemplate } = this.props
    const source_type = get(
      formTemplate,
      'multi_branch_pipeline.source_type',
      ''
    )
    const {
      enable_timer_trigger,
      enable_multibranch_job_trigger,
    } = formTemplate
    const { isLoading } = this.pipelineStore.list

    const hasWebhook = ['git', 'github', 'bitbucket_server'].includes(
      source_type
    )

    const isShowRepoTrigger = [
      'git',
      'github',
      'bitbucket_server',
      'gitlab',
    ].includes(source_type)

    return (
      <div>
        {source_type !== 'git' && source_type !== 'svn' ? (
          <React.Fragment>
            <div className="h6">{t('BEHAVIORAL_STRATEGY')}</div>
            <Form.Item>
              <ActionsInput
                sourceType={source_type}
                name={`multi_branch_pipeline.${source_type}_source`}
              />
            </Form.Item>
          </React.Fragment>
        ) : null}
        <div className="h6">{t('SCRIPT_PATH')}</div>
        <Form.Item label={t('PATH')} desc={t('SCRIPT_PATH_DESC')}>
          <Input
            name={`${this.prefix}.script_path`}
            defaultValue="Jenkinsfile"
          />
        </Form.Item>
        <div className="h6">{t('REPO_SCAN_TRIGGER')}</div>
        {isShowRepoTrigger ? this.renderRegFilter() : null}
        <Form.Item>
          <Checkbox
            checked={enable_timer_trigger}
            name="enable_timer_trigger"
            onChange={this.handleChange('enable_timer_trigger')}
          >
            {t('SCAN_REGULARLY')}
            {this.renderTip(t('TIME_TRIGGER_DESC'))}
          </Checkbox>
        </Form.Item>
        {enable_timer_trigger && (
          <div className={styles.wrapper}>
            <Form.Item label={t('SCAN_INTERVAL')}>
              <Select
                name={`${this.prefix}.timer_trigger.interval`}
                options={TIMETRIGGERINTERVALS}
                defaultValue={
                  source_type === 'svn' || source_type === 'single_svn'
                    ? '600000'
                    : '3600000'
                }
              />
            </Form.Item>
          </div>
        )}
        <div className="h6">{t('BUILD_TRIGGER')}</div>
        <Form.Item>
          <Checkbox
            checked={enable_multibranch_job_trigger}
            name="enable_multibranch_job_trigger"
            onChange={this.handleChange('enable_multibranch_job_trigger')}
          >
            {t('PIPELINE_EVENT_TRIGGER')}
          </Checkbox>
        </Form.Item>
        {enable_multibranch_job_trigger && (
          <div className={styles.wrapper}>
            <Columns>
              <Column>
                <Form.Item
                  label={t('WHEN_CREATE_PIPELINE')}
                  desc={t('WHEN_CREATE_PIPELINE_DESC')}
                >
                  <Select
                    name={`${this.prefix}.multibranch_job_trigger.create_action_job_to_trigger`}
                    isLoading={isLoading}
                    isLoadingAtBottom
                    onMenuScrollToBottom={this.handleScrollToBottom}
                    options={this.pipelineLists}
                    placeholder={t('SELECT_A_PIPELINE')}
                  />
                </Form.Item>
              </Column>
              <Column>
                <Form.Item
                  label={t('WHEN_DELETE_PIPELINE')}
                  desc={t('WHEN_DELETE_PIPELINE_DESC')}
                >
                  <Select
                    name={`${this.prefix}.multibranch_job_trigger.delete_action_job_to_trigger`}
                    isLoading={isLoading}
                    isLoadingAtBottom
                    onMenuScrollToBottom={this.handleScrollToBottom}
                    options={this.pipelineLists}
                    placeholder={t('SELECT_A_PIPELINE')}
                  />
                </Form.Item>
              </Column>
            </Columns>
          </div>
        )}
        {hasWebhook ? this.renderGitOptions() : null}
      </div>
    )
  }

  renderDisCarder = () => {
    const { formTemplate } = this.props
    const multi_branch_pipeline = get(formTemplate, 'multi_branch_pipeline')
    const { enable_discarder } = formTemplate
    if (!enable_discarder) {
      return
    }
    if (isEmpty(multi_branch_pipeline)) {
      return (
        <div className={styles.wrapper}>
          <Columns>
            <Column>
              <Form.Item
                label={t('DAYS_TO_KEEP_BUILDS')}
                desc={t('DAYS_TO_KEEP_BUILDS_DESC')}
              >
                <Input
                  name={`${this.prefix}.discarder.days_to_keep`}
                  defaultValue="7"
                />
              </Form.Item>
            </Column>
            <Column>
              <Form.Item
                label={t('MAXIMUM_NUMBER_OF_BUILDS_TO_KEEP')}
                desc={t('MAXIMUM_NUMBER_OF_BUILDS_TO_KEEP_DESC')}
              >
                <Input
                  name={`${this.prefix}.discarder.num_to_keep`}
                  defaultValue="10"
                />
              </Form.Item>
            </Column>
          </Columns>
        </div>
      )
    }
    return (
      <div className={styles.wrapper}>
        <Columns>
          <Column>
            <Form.Item
              label={t('DAYS_TO_KEEP_BRANCHES')}
              desc={t('DAYS_TO_KEEP_BRANCHES_DESC')}
            >
              <Input
                name={`${this.prefix}.discarder.days_to_keep`}
                defaultValue="7"
              />
            </Form.Item>
          </Column>
          <Column>
            <Form.Item
              label={t('MAXIMUM_NUMBER_OF_BRANCHES_TO_KEEP')}
              desc={t('MAXIMUM_NUMBER_OF_BRANCHES_TO_KEEP_DESC')}
            >
              <Input
                name={`${this.prefix}.discarder.num_to_keep`}
                defaultValue="5"
              />
            </Form.Item>
          </Column>
        </Columns>
      </div>
    )
  }

  render() {
    const { formRef, formTemplate } = this.props

    const multi_branch_pipeline = get(formTemplate, 'multi_branch_pipeline')

    return (
      <div className={styles.advance}>
        <Form data={formTemplate} ref={formRef}>
          <div className="h6">
            {isEmpty(multi_branch_pipeline)
              ? t('BUILD_SETTINGS')
              : t('BRANCH_SETTINGS')}
          </div>
          <Form.Item>
            <Checkbox
              checked={formTemplate.enable_discarder}
              name="enable_discarder"
              onChange={this.handleChange('enable_discarder')}
            >
              {isEmpty(multi_branch_pipeline)
                ? t('DISCARD_OLD_BUILDS')
                : t('DISCARD_OLD_BRANCHES')}
              {this.renderTip(
                isEmpty(multi_branch_pipeline)
                  ? t('DISABLE_CONCURRENT_TIP')
                  : t('DISABLE_CONCURRENT_SCM_TIP')
              )}
            </Checkbox>
          </Form.Item>
          {this.renderDisCarder()}
          {isEmpty(multi_branch_pipeline)
            ? this.renderNoSource()
            : this.renderWithSource()}
        </Form>
      </div>
    )
  }
}
