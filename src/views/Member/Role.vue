<template>
    <div class="box">
        <!--面包屑导航-->
        <a-breadcrumb class="breadcrumb">
            <a-breadcrumb-item>用户管理</a-breadcrumb-item>
            <a-breadcrumb-item>角色管理</a-breadcrumb-item>
        </a-breadcrumb>
        <!--内容主体-->
        <div class="content">
            <!--模糊搜索-->
            <a-form layout="inline" :form="searchform" @submit="searchRole">
                <a-form-item>
                    <a-input placeholder="角色名称" autocomplete="off" v-decorator="['name']">
                        <a-icon slot="prefix" type="team" style="color:rgba(0,0,0,.25)"/>
                    </a-input>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" html-type="submit">
                        搜索
                    </a-button>
                </a-form-item>
                <div layout="inline-block" class="button-group">
                    <a-button type="primary" html-type="submit" @click="addRole">
                        <a-icon type="plus" />
                    </a-button>
                </div>
            </a-form>
            <!--数据表格-->
            <a-table bordered
                     size="small"
                     :loading="loading"
                     class="table"
                     :columns="columns"
                     :dataSource="data"
                     rowKey="id"
                     :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
                <!--状态-->
                <span slot="status" slot-scope="status">
                    <a-tag v-if="status === 0" color="green">启用</a-tag>
                    <a-tag v-if="status === 1" color="purple">停用</a-tag>
                </span>
                <!--创建时间、更新时间-->
                <span slot="timeFormat" slot-scope="timeFormat">
                    {{formatDateTime(timeFormat)}}
                </span>
                <!--操作-->
                <span slot="action" slot-scope="record">
                    <a href="javascript:;" @click="updateRole(record)">编辑</a>
                    <a-divider type="vertical"/>
                    <a href="javascript:;" @click="editRolePermission(record)">权限编辑</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm title="确定要删除吗？" @confirm="deleteRole(record.id)" okText="是" cancelText="否">
                        <a href="#">删除</a>
                      </a-popconfirm>
                </span>
            </a-table>
            <!--编辑角色-->
            <a-modal title="编辑角色"
                     :visible="editModalVisible"
                     okText="确认"
                     cancelText="取消"
                     :keyboard="false"
                     :maskClosable="false"
                     @ok="editHandleOk"
                     @cancel="editHandleCancel">
                <a-form :form="roleform">
                    <a-form-item label="ID" v-bind="modalFormItemLayout">
                        <a-input placeholder="" autocomplete="off" v-decorator="['id']" disabled/>
                    </a-form-item>
                    <a-form-item label="角色名称" v-bind="modalFormItemLayout">
                        <a-input placeholder="请输入角色名称" autocomplete="off" v-decorator="['name']"/>
                    </a-form-item>
                    <a-form-item label="说明" v-bind="modalFormItemLayout">
                        <a-input placeholder="请输入说明信息" autocomplete="off" v-decorator="['remarks']"/>
                    </a-form-item>
                    <a-form-item label="状态" v-bind="modalFormItemLayout">
                        <a-select defaultValue="0" v-decorator="['status']">
                            <a-select-option value="0">启用</a-select-option>
                            <a-select-option value="1">停用</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-form>
            </a-modal>
            <!--增加角色-->
            <a-modal title="添加角色"
                     :visible="addModalVisible"
                     okText="确认"
                     cancelText="取消"
                     :keyboard="false"
                     :maskClosable="false"
                     @ok="addHandleOk"
                     @cancel="addHandleCancel">
                <a-form :form="roleform">
                    <a-form-item label="角色" v-bind="modalFormItemLayout">
                        <a-input placeholder="请输入角色名称" autocomplete="off" v-decorator="['name']"/>
                    </a-form-item>
                    <a-form-item label="说明" v-bind="modalFormItemLayout">
                        <a-input placeholder="请输入说明信息" autocomplete="off" v-decorator="['remarks']"/>
                    </a-form-item>
                    <a-form-item label="状态" v-bind="modalFormItemLayout">
                        <a-select v-decorator="['status']">
                            <a-select-option value="0">启用</a-select-option>
                            <a-select-option value="1">停用</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-form>
            </a-modal>
        </div>
        <a-back-top/>
    </div>
</template>
<script>
    import {formatDate} from '../../utils/date';

    const columns = [
        {title: 'ID', dataIndex: 'id'},
        {title: '角色名称', dataIndex: 'name'},
        {title: '角色说明', dataIndex: 'remarks'},
        {title: '创建者', dataIndex: 'createBy'},
        {title: '更新者', dataIndex: 'updateBy'},
        {title: '状态', dataIndex: 'status', scopedSlots: {customRender: 'status'}},
        {title: '权限', dataIndex: 'permissions', scopedSlots: {customRender: 'permissions'}},
        {title: '创建时间', dataIndex: 'createTime', scopedSlots: {customRender: 'timeFormat'}},
        {title: '更新时间', dataIndex: 'updateTime', scopedSlots: {customRender: 'timeFormat'}},
        {title: '操作', scopedSlots: {customRender: 'action'}, align: 'center'}
    ];

    export default {
        name: 'Role',
        beforeCreate() {
            this.searchform = this.$form.createForm(this);
            this.roleform = this.$form.createForm(this);
        },
        data() {
            return {
                loading: true,
                editModalVisible: false,
                addModalVisible: false,
                modalFormItemLayout: {
                    labelCol: {span: 2},
                    wrapperCol: {span: 22}
                },
                columns,
                data: [],
                selectedRowKeys: []
            };
        },
        mounted() {
            this.listRole();
        },
        methods: {
            listRole() {
                this.loading = true;
                this.$axios({
                    url: '/role/listRole',
                    method: 'get',
                    params: this.searchform.getFieldsValue()
                }).then(response => {
                    this.data = response;
                    this.loading = false;
                }).catch(error => {
                    console.log(error);
                    this.loading = false;
                });
            },
            formatDateTime(time) {
                let date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
            },
            searchRole(e) {
                e.preventDefault();
                this.listRole();
            },
            updateRole(record) {
                this.editModalVisible = true;
                this.$nextTick(() => {
                    this.roleform.setFieldsValue({id: record.id, name: record.name, remarks: record.remarks, status:record.status});
                });
            },
            addRole() {
                this.addModalVisible = true;
                this.$nextTick(() => {
                    this.roleform.setFieldsValue({ status: '0'});
                });
            },
            deleteRole(ids) {
                this.loading = true;
                this.$axios({
                    url: '/role/deleteRole',
                    method: 'delete',
                    params: {'ids': ids}
                }).then(() => {
                    this.loading = false;
                    this.listRole();
                }).catch(() => {
                    this.loading = false;
                    this.listRole();
                });
            },
            onSelectChange(selectedRowKeys) {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                this.selectedRowKeys = selectedRowKeys;
            },
            editHandleOk() {
                const params = this.roleform.getFieldsValue();
                this.$axios({
                    url: '/role/updateRole',
                    method: 'put',
                    params: params
                }).then(() => {
                    this.loading = false;
                    this.listRole();
                    this.editModalVisible = false;
                }).catch(() => {
                    this.loading = false;
                    this.editModalVisible = false;
                });

            },
            editHandleCancel() {
                this.editModalVisible = false;
            },
            addHandleOk() {
                const params = this.roleform.getFieldsValue();
                this.$axios({
                    url: '/role/insertRole',
                    method: 'post',
                    params: params
                }).then(() => {
                    this.loading = false;
                    this.listRole();
                    this.addModalVisible = false;
                }).catch(() => {
                    this.loading = false;
                    this.addModalVisible = false;
                });

            },
            addHandleCancel() {
                this.addModalVisible = false;
            }
        }
    };
</script>

<style scoped lang="less">
    .box {
        .breadcrumb {
            margin: 16px 0;
        }

        .content {
            padding: 5px;
            background: #fff;

            .table {
                margin-top: 10px;
            }
        }

        a {
            text-decoration: none;
        }
    }
    .button-group{
        border-top:1px solid #ccc;
        padding-top:6px;
        border-bottom:1px solid #ccc;
        padding-bottom:6px;
        margin: 9px 0 9px 0;
    }
</style>
