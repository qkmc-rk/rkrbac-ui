<template>
    <div class="box">
        <!--面包屑导航-->
        <a-breadcrumb class="breadcrumb">
            <a-breadcrumb-item>用户管理</a-breadcrumb-item>
            <a-breadcrumb-item>权限管理</a-breadcrumb-item>
        </a-breadcrumb>
        <!--内容主体-->
        <div class="content">
            <!--模糊搜索-->
            <a-form layout="inline" :form="searchform" @submit="searchPermission">
                <a-form-item>
                    <a-input placeholder="权限名称" autocomplete="off" v-decorator="['name']">
                        <a-icon slot="prefix" type="notification" style="color:rgba(0,0,0,.25)"/>
                    </a-input>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" html-type="submit">
                        搜索
                    </a-button>
                </a-form-item>
                <div layout="inline-block" class="button-group">
                    <a-button type="primary" html-type="submit" @click="addPermission">
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
                <!--类型-->
                <span slot="type" slot-scope="type">
                    <a-tag v-if="type === 0" color="green">目录</a-tag>
                    <a-tag v-if="type === 1" color="purple">菜单</a-tag>
                    <a-tag v-if="type === 2" color="orange">按钮</a-tag>
                </span>
                <!--创建时间、更新时间-->
                <span slot="timeFormat" slot-scope="timeFormat">
                    {{formatDateTime(timeFormat)}}
                </span>
                <!--操作-->
                <span slot="action" slot-scope="record">
                    <a href="javascript:;" @click="updatePermission(record)">编辑</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm title="确定要删除吗？" @confirm="deletePermission(record.id)" okText="是" cancelText="否">
                        <a href="#">删除</a>
                      </a-popconfirm>
                </span>
            </a-table>
            <!--增加权限-->
            <a-modal title="添加权限"
                     :visible="addModalVisible"
                     okText="确认"
                     cancelText="取消"
                     :keyboard="false"
                     :maskClosable="false"
                     @ok="addHandleOk"
                     @cancel="addHandleCancel">
                <a-form :form="permissionform">
                    <a-form-item label="父级" v-bind="modalFormItemLayout">
                        <a-input placeholder="" autocomplete="off" v-decorator="['parentId']" disabled/>
                    </a-form-item>
                    <a-form-item label="权限" v-bind="modalFormItemLayout">
                        <a-input placeholder="请输入权限名称" autocomplete="off" v-decorator="['name']"/>
                    </a-form-item>
                    <a-form-item label="url" v-bind="modalFormItemLayout">
                        <a-input placeholder="user:insertUser" autocomplete="off" v-decorator="['url']"/>
                    </a-form-item>
                    <a-form-item label="类型" v-bind="modalFormItemLayout">
                        <a-select v-decorator="['type']" >
                            <a-select-option value="0">目录</a-select-option>
                            <a-select-option value="1">菜单</a-select-option>
                            <a-select-option value="2">按钮</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-form>
            </a-modal>
            <!--修改权限-->
            <a-modal title="修改权限"
                     :visible="editModalVisible"
                     okText="确认"
                     cancelText="取消"
                     :keyboard="false"
                     :maskClosable="false"
                     @ok="editHandleOk"
                     @cancel="editHandleCancel">
                <a-form :form="permissionform">
                    <a-form-item label="父级" v-bind="modalFormItemLayout">
                        <a-input placeholder="" autocomplete="off" v-decorator="['parentId']" disabled/>
                    </a-form-item>
                    <a-form-item label="ID" v-bind="modalFormItemLayout">
                        <a-input placeholder="" autocomplete="off" v-decorator="['id']" disabled/>
                    </a-form-item>
                    <a-form-item label="权限" v-bind="modalFormItemLayout">
                        <a-input placeholder="请输入权限名称" autocomplete="off" v-decorator="['name']"/>
                    </a-form-item>
                    <a-form-item label="url" v-bind="modalFormItemLayout">
                        <a-input placeholder="user:insertUser" autocomplete="off" v-decorator="['url']"/>
                    </a-form-item>
                    <a-form-item label="类型" v-bind="modalFormItemLayout">
                        <a-select v-decorator="['type']" >
                            <a-select-option value="0">目录</a-select-option>
                            <a-select-option value="1">菜单</a-select-option>
                            <a-select-option value="2">按钮</a-select-option>
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
        {title: '权限名称', dataIndex: 'name'},
        {title: '权限标识', dataIndex: 'url'},
        {title: '父级ID', dataIndex: 'parentId'},
        {title: '类型', dataIndex: 'type', scopedSlots: {customRender: 'type'}},
        {title: '创建时间', dataIndex: 'createTime', scopedSlots: {customRender: 'timeFormat'}},
        {title: '更新时间', dataIndex: 'updateTime', scopedSlots: {customRender: 'timeFormat'}},
        {title: '操作', scopedSlots: {customRender: 'action'}, align: 'center'}
    ];

    export default {
        name: 'Permission',
        beforeCreate() {
            this.searchform = this.$form.createForm(this);
            this.permissionform = this.$form.createForm(this);
        },
        data() {
            return {
                loading: true,
                addModalVisible: false, 
                editModalVisible: false,
                columns,
                modalFormItemLayout: {
                    labelCol: {span: 2},
                    wrapperCol: {span: 22}
                },
                data: [],
                selectedRowKeys: []
            };
        },
        mounted() {
            this.listPermission();
        },
        methods: {
            listPermission() {
                this.loading = true;
                this.$axios({
                    url: '/permission/listPermission',
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
            addPermission() {
                this.addModalVisible = true;
                this.$nextTick(() => {
                    // 设置默认值
                    this.permissionform.setFieldsValue({parentId: '0', type: '2'});
                });
            },
            updatePermission(record) {
                this.editModalVisible = true;
                this.$nextTick(() => {
                    // 设置默认值
                    this.permissionform.setFieldsValue({id: record.id, parentId: record.parentId, type: record.type + '', name: record.name, url: record.url});
                });
            },
            searchPermission(e) {
                e.preventDefault();
                this.listPermission();
            },
            deletePermission(ids) {
                this.loading = true;
                this.$axios({
                    url: '/permission/deletePermission',
                    method: 'delete',
                    params: {ids: ids}
                }).then(() => {
                    this.loading = false;
                    this.listPermission();
                }).catch(() => {
                    this.loading = false;
                    this.listPermission();
                });
            },
            onSelectChange(selectedRowKeys) {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                this.selectedRowKeys = selectedRowKeys;
            },
            addHandleOk() {
                const params = this.permissionform.getFieldsValue();
                this.$axios({
                    url: '/permission/insertPermission',
                    method: 'post',
                    params: params
                }).then(() => {
                    this.loading = false;
                    this.listPermission();
                    this.addModalVisible = false;
                }).catch(() => {
                    this.loading = false;
                    this.addModalVisible = false;
                });
            },
            addHandleCancel() {
                this.addModalVisible = false;
            },
            editHandleOk() {
                const params = this.permissionform.getFieldsValue();
                this.$axios({
                    url: '/permission/insertPermission',
                    method: 'post',
                    params: params
                }).then(() => {
                    this.loading = false;
                    this.listPermission();
                    this.editModalVisible = false;
                }).catch(() => {
                    this.loading = false;
                    this.editModalVisible = false;
                });
            },
            editHandleCancel() {
                this.editModalVisible = false;
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
