(function (w) {

    const PENDING = 'pending'
    const RESOLVED = 'resolved'
    const REJECTED = 'rejected'
    /** 构造函数 */
    function Promise(executor) {
        console.log("swl promise")
        const _this = this;
        _this.state = PENDING
        _this.data = undefined
        _this.callbacks = []


        function resolve(value) {
            if (_this.state !== PENDING) return;

            // 改变 promise 的状态
            _this.state = RESOLVED

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
            if (_this.state !== PENDING) return;
            _this.state = REJECTED
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
        const _this = this
        onResolved = typeof onResolved === 'function' ? onResolved : value => value
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }
        return new Promise((resolve, reject) => {

            function handler(callback) {
                try {
                    const result = callback(_this.data)
                    if (result instanceof Promise) {
                        result.then(resolve, reject)
                    } else {
                        resolve(_this.data)
                    }
                } catch (error) {
                    reject(error)
                }
            }
            if (_this.state === PENDING) {
                _this.callbacks.push({
                    onResolved(value) {
                        handler(onResolved)
                    },
                    onRejected(reason) {
                        handler(onRejected)
                    },
                })
            } else if (_this.state === RESOLVED) {
                setTimeout(() => {
                    handler(onResolved)
                });
            } else { // REJECTED
                setTimeout(() => {
                    handler(onRejected)
                });
            }
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
        return this.then(undefined, onRejected)
    }


    /**
     *  Promise 函数对象方法 resolve
     * 返回一个指定结果的成功的 Promise
     * @param {*} value 
     */
    Promise.resolve = function (value) {
        return new Promise((resolve, reject) => {
            if (value instanceof Promise) {
                value.then(resolve, reject)
            } else {
                resolve(value)
            }
        })
    }

    /**
     *  Promise 函数对象方法 reject
     * 返回一个指定结果的失败的 Promise
     * @param {*} reason 
     */
    Promise.reject = function (reason) {
        return new Promise((resolve, reject) => {
            reject(reason)
        })
    }

    /**
     * Promise 函数对象方法 all
     * 返回一个 promise, 当所有 promise 都成功时才成功，否则失败
     * @param {*} promises 
     */
    Promise.all = function (promises) {
        const values = new Array(promises.length)
        let resolveCount = 0
        return new Promise((resolve, reject) => {
            promises.forEach((p, index) => {
                p.then(
                    value => {
                        values[index] = value
                        resolveCount++
                        if (resolveCount == promises.length) {
                            resolve(values)
                        }
                    },
                    reason => {
                        reject(reason)
                    }
                )
            })
        })
    }
    /**
     * Promise 函数对象方法 race
     * 返回一个 promise , 以最先完成的 promise 的状态为结果
     * @param {*} promises 
     */
    Promise.race = function (promises) {
        return new Promise((resolve, reject) => {
            promises.forEach(p => {
                p.then(
                    value => {
                        resolve(value)
                    },
                    reason => {
                        reject(reason)
                    }
                )
            })
        })
    }

    Promise.delayResolve = function (value, ms) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                return resolve(value)
            }, ms)
        })
    }

    Promise.delayReject = function (reason, ms) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                return reject(reason)
            }, ms)
        })
    }

    w.SwlPromise = Promise;
})(window)