(function (w) {

    /** 构造函数 */
    function Promise(executor) {
        console.log("swl promise")
        const _this = this;
        _this.state = 'pending'
        _this.data = undefined
        _this.callbacks = []


        function resolve(value) {
            if (_this.state !== 'pending') return;

            // 改变 promise 的状态
            _this.state = 'resolved'

            // 设置 promise 的值
            _this.data = value

            // 如果有回调函数，立即异步执行回调函数 onResolved
            if (_this.callbacks.length > 0) {
                _this.callbacks.forEach(callbacksObj => {
                    callbacksObj.onResolved(value)
                })
            }
        }

        function reject(reason) {
            if (_this.state !== 'pending') return;
            _this.state = 'rejected'
            _this.data = reason
            if (_this.callbacks.length > 0) {
                _this.callbacks.forEach(callbacksObj => {
                    callbacksObj.onRejected(reason)
                })
            }
        }

        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }

    }

    /** Promise 原型对象方法 then 
     * 指定成功或失败的回调
     * 返回一个新的 Promise 对象
     */
    Promise.prototype.then = function (onResolved, onRejected) {
        this.callbacks.push({
            onResolved,
            onRejected,
        })
    }

    /**
     * Promise 原型对象方法 catch
     * 指定失败的回调
     * 返回一个新的 Promise 对象
     * 
     * @param {*} onRejected 
     */
    Promise.prototype.catch = function (onRejected) {

    }


    /**
     *  Promise 函数对象方法 resolve
     * 返回一个指定结果的成功的 Promise
     * @param {*} value 
     */
    Promise.resolve = function (value) {
        return Promise(value)
    }

    /**
     *  Promise 函数对象方法 reject
     * 返回一个指定结果的失败的 Promise
     * @param {*} reason 
     */
    Promise.reject = function (reason) {
        this.reject(reason)
    }

    /**
     * Promise 函数对象方法 all
     * 返回一个 promise, 当所有 promise 都成功时才成功，否则失败
     * @param {*} promises 
     */
    Promise.all = function (promises) {

    }

    /**
     * Promise 函数对象方法 race
     * 返回一个 promise , 以最先完成的 promise 的状态为结果
     * @param {*} promises 
     */
    Promise.race = function (promises) {

    }

    w.SwlPromise = Promise;
})(window)