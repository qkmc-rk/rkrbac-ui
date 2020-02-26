<template>
    <div class="main">
        <a-form class="login-form" :form="form" @submit="handleSubmit">
            <a-form-item>
                <a-input v-decorator="['username', { rules: [{ required: true, message: '请输入账号！' }] }]" placeholder="账号" autocomplete="off">
                    <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)"/>
                </a-input>
            </a-form-item>
            <a-form-item>
                <a-input v-decorator="[ 'password', { rules: [{ required: true, message: '请输入密码！' }] }]" type="password" placeholder="密码">
                    <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)"/>
                </a-input>
            </a-form-item>
            <a-form-item>
                <a-checkbox v-decorator="['remember', {valuePropName: 'checked', initialValue: true, }]">
                    记住我
                </a-checkbox>
                <router-link to="/user/forget" class="login-form-forgot">
                    忘记密码
                </router-link>
                <a-button type="primary" html-type="submit" class="login-form-button" :loading="loading">
                    <span v-if="!loading">登 录</span>
                    <span v-if="loading">登 录 中</span>
                </a-button>
                或者 <router-link to="/user/register">注册</router-link>
            </a-form-item>
        </a-form>
    </div>
</template>

<script>
    import {setToken} from '../../utils/cookie';
    export default {
        name: 'Login',
        data() {
            return {
                loading: false
            };
        },
        beforeCreate() {
            this.form = this.$form.createForm(this);
        },
        methods: {
            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        this.loading = true;
                        let params = new URLSearchParams();
                        params.append('username', values.username);
                        params.append('password', values.password);
                        this.$axios({url: '/login', method: 'post', params: params}).then(response => {
                            this.$message.success('登陆成功', 1);
                            setToken(response);
                            this.$router.push('/');
                        }).catch(error => {
                            this.loading = false;
                            console.log(error);
                        });
                    }
                });
            }
        }
    };
</script>

<style scoped lang="less">
    .main {
        min-width: 260px;
        width: 368px;
        margin: 0 auto;
        margin-top: 50px;

        .login-form {
            .login-form-forgot {
                float: right;
            }

            .login-form-button {
                width: 100%;
            }
        }
    }
</style>
