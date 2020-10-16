const flatHooks = function(configHooks, hooks, parentName) {
    for (const key in configHooks) {
        const subHook = configHooks[ key ];
        const name = parentName ? `${parentName}:${key}` : key;
        if (typeof subHook === 'object' && subHook !== null) {
            flatHooks(subHook, hooks, name);
        } else {
            hooks[ name ] = subHook;
        }
    }
    return hooks;
};

const serial = function(tasks, fn) {
    return tasks.reduce(function(promise, task) {
        return promise.then(function(previous) {
            return fn(task, previous);
        });
    }, Promise.resolve(null));
};

class Hook {

    constructor () {
        this._hooks = {};
    }

    ready () {
        this.on = this.on.bind(this);
        this.callHook = this.callHook.bind(this);
    }

    on (name, fn) {
        if (!name || typeof fn !== 'function') {
            return;
        }
        this._hooks[ name ] = this._hooks[ name ] || [];
        this._hooks[ name ].push(fn);
    }

    addHooks (configHooks) {
        const hooks = flatHooks(configHooks);
        for (const key in hooks) {
            this.on(key, hooks[ key ]);
        }
    }

    callHook (name, ...args) {
        if (!this._hooks[ name ]) {
            return;
        }
        return serial(this._hooks[ name ], (fn) => fn(...args)).catch((err) => {
            if (name !== 'error') {
                this.callHook('error', err);
            }
        });
    }

    clearHook (name) {
        if (name) {
            delete this._hooks[ name ];
        }
    }

    clearHooks () {
        this._hooks = {};
    }

}

const hook = new Hook();
export default hook;