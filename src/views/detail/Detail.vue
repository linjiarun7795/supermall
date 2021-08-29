<template>
    <div id="detail">
        <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
        <scroll class="content" ref="scroll"
                :probe-type="3"
                @scroll="contentScroll">

            <detail-swiper :top-images="topImages"></detail-swiper>
            <!--        goods数据在最底下已输入-->
            <detail-base-info :goods="goods"></detail-base-info>
            <detail-shop-info :shop="shop"></detail-shop-info>
            <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
            <detail-param-info :param-info="paramInfo" ref="params"></detail-param-info>
            <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
            <goods-list :goods="recommends" ref="recommend"></goods-list>
        </scroll>
        <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
        <back-top  @click.native="backClick" v-show="isShowBackTop"></back-top>
<!--        <toast :message="message" :show="show"></toast>-->
    </div>
</template>

<script>
    import DetailNavBar from "./childComps/DetailNavBar";
    import DetailSwiper from "./childComps/DetailSwiper";
    import DetailBaseInfo from "./childComps/DetailBaseInfo";
    import DetailShopInfo from "./childComps/DetailShopInfo";
    import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
    import DetailParamInfo from "./childComps/DetailParamInfo";
    import DetailCommentInfo from "./childComps/DetailCommentInfo";
    import DetailBottomBar from "./childComps/DetailBottomBar";


    import Scroll from "@/components/common/scroll/Scroll";
    import GoodsList from "@/components/content/goods/GoodsList";
    // import Toast from "@/components/common/toast/Toast";

    import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "@/network/detail";

    import {itemListenerMixin, backTopMix} from "@/common/mixin";
    import {debounce} from "../../common/utils";

    import { mapActions } from 'vuex'

    export default {
        name: "Detail",
        components: {
            DetailNavBar,
            DetailSwiper,
            DetailBaseInfo,
            DetailShopInfo,
            Scroll,
            DetailGoodsInfo,
            DetailParamInfo,
            DetailCommentInfo,
            GoodsList,
            DetailBottomBar,
            // Toast

        },
        mixins: [itemListenerMixin, backTopMix],
        data() {
            return {
                iid: null,
                topImages: [],
                goods: {},
                shop: {},
                detailInfo: {},
                paramInfo: {},
                commentInfo: {},
                recommends: [],
                themeTopYs: [],
                getThemeTopY: null,
                currentIndex: 0,
                // message: '',
                // show: false
            }
        },
        created() {
            //1.保存传入得到的iid
            this.iid = this.$route.params.iid

            //2.根据iid请求详情
            getDetail(this.iid).then((res) => {

                const data = res.result
                this.topImages = data.itemInfo.topImages

                //2.获取商品信息
                this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

                //3.创建店铺信息的对象
                this.shop = new Shop(data.shopInfo)

                //4.保存商品的详细数据
                this.detailInfo = data.detailInfo

                //5.获取参数信息
                this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

                //6.取出评论信息
                if (data.rate.cRate !== 0) {
                    this.commentInfo = data.rate.list[0]
                }

                console.log(res);

            })

            //3.请求推荐数据
            getRecommend().then((res) => {
                this.recommends = res.data.list
            })

            //4.给getThemeTopY赋值
            this.getThemeTopY = debounce(() => {
                this.themeTopYs = []
                this.themeTopYs.push(0);
                this.themeTopYs.push(this.$refs.params.$el.offsetTop-44);
                this.themeTopYs.push(this.$refs.comment.$el.offsetTop-44);
                this.themeTopYs.push(this.$refs.recommend.$el.offsetTop-44);
                this.themeTopYs.push(Number.MAX_VALUE)

                console.log(this.themeTopYs);
            })
        },
        mounted() {

        },
        destroyed() {
            this.$bus.$off('itemImgListener', this.itemImgListener)
        },
        methods: {
            ...mapActions(['addCart']),

            imageLoad() {
                this.$refs.scroll.refresh();
                this.getThemeTopY()
            },

            titleClick(index) {
                console.log(index);
                this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
            },
            contentScroll(position) {
                this.isShowBackTop = (-position.y) > 2000
                //1.获取y值
                const positionY = -position.y

                //2.positionY和主题中的值进行对比
                let length = this.themeTopYs.length
                for (let i = 0;i < length-1; i++) {
                    if (this.currentIndex !== i && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) {
                        this.currentIndex = i;
                        this.$refs.nav.currentIndex = this.currentIndex
                    }
                }
            },
            addToCart() {
                //1.获取购物车所需要展示的信息
                const product = {}
                product.image = this.topImages[0]
                product.title = this.goods.title;
                product.desc = this.goods.desc;
                product.price = this.goods.newPrice;
                product.iid = this.iid

                //2.将商品添加到购物车里面
                // this.$store.commit('addCart',product)
                this.addCart(product).then((res) => {
                    // this.show = true;
                    // this.message = res;
                    //
                    // setTimeout(() => {
                    //     this.show = false
                    // },1000)

                    this.$toast.show(res, 2000)
                })

                // this.$store.dispatch('addCart', product).then((res) => {
                //     console.log(res);
                // })
            }
        }
    }
</script>

<style scoped>
    #detail {
       position: relative;
        z-index: 9;
        background-color: #fff;
        height: 100vh;
    }
    .content {
        height: calc(100% - 44px - 49px);
    }
    .detail-nav {
        position: relative;
        z-index: 9;
        background-color: #fff;
    }
</style>