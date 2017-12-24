/* 
* @Author: wunaifu
* @Date:   2017-08-20 23:36:20
* @Last Modified by:   wunaifu
* @Last Modified time: 2017-08-20 23:40:17
*/

var vm = new Vue({
    el: '#app',
    data: {
        totalMoney:0,
        productList:[],
        checkAllFlag:false,
        delFlag:false,
        curProduct:""
    },
    filters:{
        // 局部的过滤器，只能在当前实例中调用
        formatMoney:function (value) {
            return "¥ "+ value.toFixed(2);
        }
    },
    mounted:function () {
        this.carView();
    },
    methods: {
        carView:function () {
            var _this=this;
            this.$http.get("data/cartData.json",{"id":123}).then(function (res) {
                _this.productList=res.data.result.list;
                // _this.totalMoney=res.result.totalMoney;
            });
        },
        changeMoney:function (product,way) {
            if (way>0) {
                product.productQuantity++;
            }else{
                product.productQuantity--;
                if (product.productQuantity<=1) {
                    product.productQuantity=1;
                }
            }
            this.calcTotalPrice();
        },
        selectedProduct:function (item) {
            if (typeof item.checked == 'undefined'){
                // Vue.set(item,"checked",true);
                this.$set(item,"checked",true);
            }else {
                item.checked = !item.checked;
            }
            this.calcTotalPrice();
        },
        checkAll:function (flag) {
            var _this=this;
            this.checkAllFlag = flag;
            this.productList.forEach(function (item, index) {
                if (typeof item.checked == 'undefined'){
                    // Vue.set(item,"checked",true);
                    _this.$set(item,"checked",_this.checkAllFlag);
                }else {
                    item.checked = _this.checkAllFlag;
                }
            });
            this.calcTotalPrice();
        },
        calcTotalPrice: function() {
            var _this = this;
            this.totalMoney = 0;
            this.productList.forEach(function(item, index) {
                if (item.checked) {
                    _this.totalMoney += item.productPrice * item.productQuantity;
                }
            });
        },
        delConfirm:function (item) {
            this.delFlag=true;
            this.curProduct=item;
        },
        delProduct:function () {
            var index = this.productList.indexOf(this.curProduct);
            this.productList.splice(index, 1);
            this.delFlag=false;
        }
    }
});
// 全局的过滤器，其他的页面也可以用
Vue.filter("money",function (value,type) {
    return "¥ "+ value.toFixed(2)+type;

})