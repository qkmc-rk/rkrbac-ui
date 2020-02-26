<template>
    <div class="box">
        <!--面包屑导航-->
        <a-breadcrumb class="breadcrumb">
            <a-breadcrumb-item>会员管理</a-breadcrumb-item>
            <a-breadcrumb-item>权限列表</a-breadcrumb-item>
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
                    <a href="javascript:;" @click="updateRole(record)">编辑</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm title="确定要删除吗？" @confirm="deleteRole(record.id)" okText="是" cancelText="否">
                        <a href="#">删除</a>
                      </a-popconfirm>
                </span>
            </a-table>
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
        },
        data() {
            return {
                loading: true,
                columns,
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
            searchPermission(e) {
                e.preventDefault();
                this.listPermission();
            },
            updateRole(record) {
                console.log(record);
            },
            deleteRole(id) {
                this.loading = true;
                this.$axios({
                    url: '/role/deleteRole',
                    method: 'delete',
                    params: {id: id}
                }).then(() => {
                    this.loading = false;
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
</style>
