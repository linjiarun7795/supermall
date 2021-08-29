<template>
    <div class="bottom-bar">
        <div class="check-content">
            <check-button :is-checked="isSelectAll" class="check-button" @click.native="checkClick"></check-button>
            <span>全选</span>
        </div>

        <div class="price">
            合计: {{totalPrice}}
        </div>

        <div class="calculate">
            去计算：{{checkLength}}
        </div>
    </div>
</template>

<script>
    import CheckButton from "@/components/content/checkButton/CheckButton";

    export default {
        name: "CartBottomBar",
        components: {
            CheckButton
        },
        computed: {
            totalPrice() {
                return '￥' + this.$store.state.cartList.filter(item => {
                    return item.checked
                }).reduce((preValue, item) => {
                    return preValue + item.price*1 * item.count
                },0).toFixed(2)
            },
            checkLength() {
                return this.$store.state.cartList.filter(item => item.checked).length
            },
            isSelectAll() {
                return this.$store.state.cartList.length !==0 && this.$store.state.cartList.every(item => item.checked )
            }
        },
        methods: {
            checkClick() {
                if (this.isSelectAll) {//全部选中
                    this.$store.state.cartList.forEach(item => item.checked = false)
                }else {
                    this.$store.state.cartList.forEach(item => item.checked = true)
                }
            }
        }
    }
</script>

<style scoped>
    .bottom-bar {
        height: 40px;
        background-color: #eee;
        position: relative;
        line-height: 40px;
        display: flex;
    }

    .check-content {
        display: flex;
        align-items: center;
        margin-left: 10px;
        width: 90px;
    }

    .price {
        margin-left: 20px;
        flex: 1;
    }

    .check-button {
        width: 23px;
        height: 23px;
        line-height: 23px;
        margin-right: 5px;
    }

    .calculate {
        width: 110px;
        background-color: #ff5777;
        color: #fff;
        text-align: center;
    }
</style>