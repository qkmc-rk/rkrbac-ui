<template>
    <div class="box">
        <!--面包屑导航-->
        <a-breadcrumb class="breadcrumb">
            <a-breadcrumb-item>用户管理</a-breadcrumb-item>
            <a-breadcrumb-item>用户管理</a-breadcrumb-item>
        </a-breadcrumb>
        <!--内容主体-->
        <div class="content">
            <!--模糊搜索-->
            <a-form layout="inline" :form="searchform" @submit="searchUser">
                <a-form-item>
                    <a-input placeholder="账号" autocomplete="off" v-decorator="['username']">
                        <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)"/>
                    </a-input>
                </a-form-item>
                <a-form-item>
                    <a-input placeholder="邮箱" autocomplete="off" v-decorator="['email']">
                        <a-icon slot="prefix" type="mail" style="color:rgba(0,0,0,.25)"/>
                    </a-input>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" html-type="submit">
                        搜索
                    </a-button>
                </a-form-item>
            </a-form >
            <div layout="inline-block" class="button-group">
                <a-button type="primary" html-type="submit" @click="addUser">
                    <a-icon type="plus" />
                </a-button>
            </div>
            <!--数据表格-->
            <a-table bordered
                     size="small"
                     :loading="loading"
                     class="table"
                     :columns="columns"
                     :dataSource="data"
                     rowKey="id"
                     :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
                <!--性别-->
                <span slot="sex" slot-scope="sex">
                    <a-tag v-if="sex === 1" color="blue">男</a-tag>
                    <a-tag v-if="sex === 2" color="pink">女</a-tag>
                </span>
                <!--角色-->
                <span slot="roles" slot-scope="roles">
                    <a-tag v-for="role in roles" color="blue" :key="role">{{role}}</a-tag>
                </span>
                <!--状态-->
                <span slot="status" slot-scope="status">
                    <a-tag v-if="status === 0" color="green">正常</a-tag>
                    <a-tag v-if="status === 1" color="purple">冻结</a-tag>
                    <a-tag v-if="status === 2" color="orange">删除</a-tag>
                </span>
                <!--创建时间、更新时间-->
                <span slot="timeFormat" slot-scope="timeFormat">
                    {{formartDateTime(timeFormat)}}
                </span>
                <!--操作-->
                <span slot="action" slot-scope="record">
                    <a href="javascript:;" @click="updateUser(record)">编辑</a>
                    <a-divider type="vertical"/>
                    <a href="javascript:;" @click="editUserRole(record)">角色设置</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm title="确定要删除吗？" @confirm="deleteUser(record.id)" okText="是" cancelText="否">
                        <a href="#">删除</a>
                      </a-popconfirm>
                </span>
            </a-table>
            <!--编辑用户-->
            <a-modal title="编辑用户"
                     :visible="editModalVisible"
                     okText="确认"
                     cancelText="取消"
                     :keyboard="false"
                     :maskClosable="false"
                     @ok="editHandleOk"
                     @cancel="editHandleCancel">
                <a-form :form="userform">
                    <a-form-item label="ID" v-bind="modalFormItemLayout">
                        <a-input placeholder="" autocomplete="off" v-decorator="['id']" disabled/>
                    </a-form-item>
                    <a-form-item label="账号" v-bind="modalFormItemLayout">
                        <a-input placeholder="请输入账号" autocomplete="off" v-decorator="['username']" disabled/>
                    </a-form-item>
                    <a-form-item label="邮箱" v-bind="modalFormItemLayout">
                        <a-input placeholder="请输入邮箱" autocomplete="off" v-decorator="['email']"/>
                    </a-form-item>
                    <a-form-item label="密码" v-bind="modalFormItemLayout">
                        <a-input type='password' placeholder="请输入密码" autocomplete="off"  v-decorator="['password']"/>
                    </a-form-item>
                    <a-form-item label="状态" v-bind="modalFormItemLayout">
                        <a-select defaultValue="0" v-decorator="['status']">
                            <a-select-option value="0">正常</a-select-option>
                            <a-select-option value="1">冻结</a-select-option>
                            <a-select-option value="2">删除</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-form>
            </a-modal>
            <!--新增用户-->
            <a-modal title="增加用户"
                     :visible="addModalVisible"
                     okText="确认"
                     cancelText="取消"
                     :keyboard="false"
                     :maskClosable="false"
                     @ok="addHandleOk"
                     @cancel="addHandleCancel">
                <a-form :form="userform">
                    <a-form-item label="账号" v-bind="modalFormItemLayout">
                        <a-input placeholder="请输入账号" autocomplete="off" v-decorator="['username']"/>
                    </a-form-item>
                    <a-form-item label="密码" v-bind="modalFormItemLayout">
                        <a-input placeholder="请输入密码" type="password" autocomplete="off" v-decorator="['password']"/>
                    </a-form-item>
                    <a-form-item label="姓名" v-bind="modalFormItemLayout">
                        <a-input placeholder="请输入真实姓名" autocomplete="off" v-decorator="['reallyName']"/>
                    </a-form-item>
                    <a-form-item label="邮箱" v-bind="modalFormItemLayout">
                        <a-input placeholder="请输入邮箱" autocomplete="off" v-decorator="['email']"/>
                    </a-form-item>
                    <a-form-item label="昵称" v-bind="modalFormItemLayout">
                        <a-input placeholder="请输入昵称" autocomplete="off" v-decorator="['nickname']"/>
                    </a-form-item>
                    <a-form-item label="性别" v-bind="modalFormItemLayout">
                        <a-select defaultValue="1" v-decorator="['sex']">
                            <a-select-option value="1">男</a-select-option>
                            <a-select-option value="2">女</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-form>
            </a-modal>
            <!--用户角色修改-->
            <a-modal title="修改用户角色"
                     :visible="userRoleModalVisible"
                     okText="确认"
                     cancelText="取消"
                     :keyboard="false"
                     :maskClosable="false"
                     @ok="userRoleHandleOk"
                     @cancel="userRoleHandleCancel">
                <a-form :form="userRoleform">
                    <!-- 用户角色编辑表单 -->
                    <a-form-item label="昵称" v-bind="modalFormItemLayout">
                        <a-input placeholder="请输入昵称" autocomplete="off" v-decorator="['nickname']"/>
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
        {title: '账号', dataIndex: 'username'},
        {title: '密码', dataIndex: 'password'},
        {title: '真实姓名', dataIndex: 'reallyName'},
        {title: '昵称', dataIndex: 'nickname'},
        {title: '性别', dataIndex: 'sex', scopedSlots: {customRender: 'sex'}},
        {title: '年龄', dataIndex: 'age'},
        // {title: '手机', dataIndex: 'phone'},
        {title: '邮箱', dataIndex: 'email'},
        {title: '状态', dataIndex: 'status', scopedSlots: {customRender: 'status'}},
        {title: '角色', dataIndex: 'roles', scopedSlots: {customRender: 'roles'}},
        {title: '创建时间', dataIndex: 'createTime', scopedSlots: {customRender: 'timeFormat'}},
        // {title: '更新时间', dataIndex: 'updateTime', scopedSlots: {customRender: 'timeFormat'}},
        {title: '操作', scopedSlots: {customRender: 'action'}, align: 'center'}
    ];

    export default {
        name: 'User',
        beforeCreate() {
            this.searchform = this.$form.createForm(this);
            this.userform = this.$form.createForm(this);
            this.userRoleform = this.$form.createForm(this);
        },
        data() {
            return {
                loading: true,
                columns,
                data: [],
                selectedRowKeys: [],
                editModalVisible: false,
                addModalVisible: false,
                userRoleModalVisible: false,
                modalFormItemLayout: {
                    labelCol: {span: 2},
                    wrapperCol: {span: 22}
                }
            };
        },
        mounted() {
            this.listUser();
        },
        methods: {
            listUser() {
                this.loading = true;
                this.$axios({
                    url: '/user/listUser',
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
            formartDateTime(time) {
                let date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
            },
            searchUser(e) {
                e.preventDefault();
                this.listUser();
            },
            addUser() {
                this.addModalVisible = true;
                this.$nextTick(() => {
                    this.userform.setFieldsValue({sex: '1'});
                });
            },
            updateUser(record) {
                this.editModalVisible = true;
                this.$nextTick(() => {
                    this.userform.setFieldsValue({id: record.id, username: record.username, email: record.email, password:record.password, status:record.status + ''});
                });
            },
            editUserRole(record) {
                this.userRoleModalVisible = true;
                this.$nextTick(() => {
                    this.userRoleform.setFieldsValue({roles: record.roles});
                });
            },
            addHandleOk() {
                const params = this.userform.getFieldsValue();
                console.log(params);
                this.$axios({
                    url: '/user/insertUser',
                    method: 'post',
                    params:params
                }).then((res) => {
                    console.log(res);
                    this.addHandleCancel();
                    this.listUser();
                }).catch(()=>{
                    this.addHandleCancel();
                });
            },
            addHandleCancel() {
                this.addModalVisible = false;
            },
            userRoleHandleOk() {
                const params = this.userform.getFieldsValue();
            },
            userRoleHandleCancel() {
                this.userRoleModalVisible = false;
            },
            editHandleOk() {
                const params = this.userform.getFieldsValue();
                this.$axios({
                    url: '/user/updateUser',
                    method: 'put',
                    params:params
                }).then((res) => {
                    console.log(res);
                    this.editHandleCancel();
                    this.listUser();
                }).catch(() => {
                    this.editHandleCancel();
                });
            },
            editHandleCancel() {
                this.editModalVisible = false;
            },
            deleteUser(id) {
                this.loading = true;
                this.$axios({
                    url: '/user/deleteUser',
                    method: 'delete',
                    params: {ids: id}
                }).then(() => {
                    this.loading = false;
                    this.listUser();
                }).catch(() => {
                    this.loading = false;
                });
            },
            onSelectChange(selectedRowKeys) {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                this.selectedRowKeys = selectedRowKeys;
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
