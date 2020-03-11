<template>
    <div class="box">
        <a-dropdown>
            <span>
                <img src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"/>
                mrruan <a-icon type="down"/>
            </span>
            <a-menu slot="overlay">
                <a-menu-item>
                    <a href="javascript:;"><a-icon type="user"/> 个人中心</a>
                </a-menu-item>
                <a-menu-item>
                    <a href="javascript:;"><a-icon type="setting"/> 个人设置</a>
                </a-menu-item>
                <a-menu-divider/>
                <a-menu-item>
                    <a href="javascript:;" @click="logout"><a-icon type="logout"/> 退出登陆</a>
                </a-menu-item>
            </a-menu>
        </a-dropdown>
    </div>
</template>

<script>
    import {removeToken} from '../utils/cookie';
    export default {
        name: 'Header',
        methods: {
            logout() {
                this.$axios({url: '/logout', method: 'get'}).then(() => {
                    this.$message.success('退出成功', 1).then(() => {
                        removeToken();
                        this.$router.push('/user/login');
                    });
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    };
</script>

<style scoped lang="less">
    .box {
        float: right;
        margin-right: 16px;

        img {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            margin-right: 3px;
        }

        span {
            cursor: pointer;
        }
    }
</style>
