import {
    ADD_COUNTER,
    ADD_TO_CART
} from './mutations-types'


export default {
    addCart(context, payload) {
        return new Promise((resolve, reject) => {
            //payload新添加的商品
            let oldProduct = null;
            for (let item of context.state.cartList) {
                if (item.iid === payload.iid) {
                    oldProduct = item;
                }
            }

            //判断oldProduct
            if (oldProduct) {
                // oldProduct.count += 1
                context.commit(ADD_COUNTER, oldProduct)
                resolve('当前的数量+1')
            } else {
                payload.count = 1
                // context.state.cartList.push(payload)
                context.commit(ADD_TO_CART, payload)
                resolve('添加了新的商品')
            }
        })
    }
}