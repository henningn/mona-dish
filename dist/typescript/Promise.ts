import {IPromise, Optional, PromiseStatus} from "./Monad";

/**
 * a small (probably not 100% correct, although I tried to be correct as possible) Promise implementation
 * for systems which do not have a promise implemented
 * Note, although an internal state is kept, this is sideffect free since
 * is value is a function to operate on, hence no real state is kept internally, except for the then
 * and catch calling order
 */
export class Promise implements IPromise {

    private value: (resolve: (val?: any) => void, reject: (val?: any) => void) => void;

    status = PromiseStatus.PENDING;

    protected allFuncs: Array<any> = [];

    constructor(executor: (resolve: (val?: any) => void, reject: (val?: any) => void) => void) {
        //super(executor);
        this.value = executor;
        this.value((data: any) => this.resolve(data), (data: any) => this.reject(data));
    }

    static all(...promises: Array<IPromise>): IPromise {

        let promiseCnt = 0;
        let myapply: Function;

        let myPromise = new Promise((apply: Function, reject: Function) => {
            myapply = apply;
        });
        let executor = () => {
            promiseCnt++;

            if (promises.length == promiseCnt) {
                myapply();
            }
        };
        (<any>executor).__last__ = true;

        for (let cnt = 0; cnt < promises.length; cnt++) {
            promises[cnt].finally(executor);
        }
        return myPromise;
    }


    static race(...promises: Array<IPromise>): IPromise {

        let promiseCnt = 0;
        let myapply: Function;
        let myreject: Function;

        let myPromise = new Promise((apply: Function, reject: Function) => {
            myapply = apply;
            myreject = reject;
        });


        let thenexecutor = (): IPromise => {
            if (!!myapply) {
                myapply();
            }
            myapply = null;
            myreject = null;
            return null;
        };
        (<any>thenexecutor).__last__ = true;

        let catchexeutor = (): IPromise => {
            if (!!myreject) {
                myreject();
            }
            myreject = null;
            myapply = null;
            return null;
        };
        (<any>catchexeutor).__last__ = true;

        for (let cnt = 0; cnt < promises.length; cnt++) {
            promises[cnt].then(thenexecutor);
            promises[cnt].catch(catchexeutor);
        }
        return myPromise;
    }

    static reject(reason: any): Promise {
        let retVal = new Promise((resolve: any, reject: any) => {
            //not really doable without a hack
            if (reason instanceof Promise) {
                reason.then((val: any) => {
                    reject(val);
                });
            } else {
                setTimeout(() => {
                    reject(reason);
                }, 1);
            }
        });

        return retVal;
    }

    static resolve(reason: any): Promise {
        let retVal = new Promise((resolve: any, reject: any) => {
            //not really doable without a hack
            if (reason instanceof Promise) {
                reason.then((val) => resolve(val));
            } else {
                setTimeout(() => {
                    resolve(reason);
                }, 1);
            }
        });

        return retVal;

    }

    then(executorFunc: (val?: any) => any, catchfunc?: (val?: any) => any): Promise {
        this.allFuncs.push({"then": executorFunc});
        if (catchfunc) {
            this.allFuncs.push({"catch": catchfunc});
        }
        this.spliceLastFuncs();
        return this;
    }

    catch(executorFunc: (val?: any) => void): Promise {
        this.allFuncs.push({"catch": executorFunc});
        this.spliceLastFuncs();
        return this;
    }


    finally(executorFunc: () => void): Promise {
        if ((<any>this).__reason__) {
            (<any>this).__reason__.finally(executorFunc);
            return;
        }

        this.allFuncs.push({"finally": executorFunc});
        this.spliceLastFuncs();
        return this;
    }

    private spliceLastFuncs() {
        let lastFuncs = [];
        let rest = [];
        for (let cnt = 0; cnt < this.allFuncs.length; cnt++) {
            for (let key in this.allFuncs[cnt]) {
                if (this.allFuncs[cnt][key].__last__) {
                    lastFuncs.push(this.allFuncs[cnt]);
                } else {
                    rest.push(this.allFuncs[cnt]);
                }
            }
        }
        this.allFuncs = rest.concat(lastFuncs);
    }


    protected resolve(val?: any) {


        while (this.allFuncs.length) {
            if (!this.allFuncs[0].then) {
                break;
            }
            let fn = this.allFuncs.shift();

            let funcResult = Optional.fromNullable(fn.then(val));

            if (funcResult.isPresent()) {
                funcResult = funcResult.flatMap();
                val = funcResult.value;
                if (val instanceof Promise) {
                    //var func = (newVal: any) => {this.resolve(newVal)};
                    //func.__last__  = true;
                    //val.then(func);
                    this.transferIntoNewPromise(val);

                    return;
                }
            } else {
                break;
            }
        }

        this.appyFinally();
        this.status = PromiseStatus.FULLFILLED;
    }

    protected reject(val?: any) {

        while (this.allFuncs.length) {
            if (this.allFuncs[0].finally) {
                break;
            }
            var fn = this.allFuncs.shift();
            if (fn.catch) {
                var funcResult = Optional.fromNullable(fn.catch(val));
                if (funcResult.isPresent()) {
                    funcResult = funcResult.flatMap();
                    val = funcResult.value;
                    if (val instanceof Promise) {
                        //val.then((newVal: any) => {this.resolve(newVal)});
                        this.transferIntoNewPromise(val);
                        return;
                    }
                    this.status = PromiseStatus.REJECTED;
                    break;
                } else {
                    break;
                }
            }
        }

        this.status = PromiseStatus.REJECTED;
        this.appyFinally();
    }

    private transferIntoNewPromise(val: any) {
        for (var cnt = 0; cnt < this.allFuncs.length; cnt++) {
            for (let key in this.allFuncs[cnt]) {
                val[key](this.allFuncs[cnt][key]);
            }
        }
    }

    protected appyFinally() {
        while (this.allFuncs.length) {
            var fn = this.allFuncs.shift();
            if (fn.finally) {
                fn.finally();
            }
        }
    }
}

/**
 * a cancellable promise
 * a Promise with a cancel function, which can be cancellend any time
 * this is useful for promises which use cancellable asynchronous operations
 * note, even in a cancel state, the finally of the promise is executed, however
 * subsequent thens are not anymore.
 * The current then however is fished or a catch is called depending on how the outer
 * operation reacts to a cancel order.
 */
export class CancellablePromise extends Promise {

    private cancellator = () => {
    };

    /**
     * @param executor asynchronous callback operation which triggers the callback
     * @param cancellator cancel operation, separate from the trigger operation
     */
    constructor(executor: (resolve: (val?: any) => void, reject: (val?: any) => void) => void, cancellator: () => void) {
        super(executor);
        this.cancellator = cancellator;
    }

    cancel() {
        this.status = PromiseStatus.REJECTED;
        this.appyFinally();
        //lets terminate it once and for all, the finally has been applied
        this.allFuncs = [];
    }


    then(executorFunc: (val?: any) => any, catchfunc?: (val?: any) => any): CancellablePromise {
        return <CancellablePromise> super.then(executorFunc, catchfunc);
    }

    catch(executorFunc: (val?: any) => void): CancellablePromise {
        return <CancellablePromise> super.catch(executorFunc);
    }

    finally(executorFunc: () => void): CancellablePromise {
        return <CancellablePromise> super.finally(executorFunc);
    }
}



