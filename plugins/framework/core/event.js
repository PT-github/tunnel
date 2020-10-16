class EventBus {
    constructor () {
        this.listeners = {};
    }

    $on (type, callback, scope) {
        let args = [];
        let numOfArgs = arguments.length;
        for (let i = 0; i < numOfArgs; i++) {
            args.push(arguments[ i ]);
        }
        args = args.length > 3 ? args.splice(3, args.length - 1) : [];
        if (typeof this.listeners[ type ] != 'undefined') {
            this.listeners[ type ].push({scope: scope, callback: callback, args: args});
        } else {
            this.listeners[ type ] = [ {scope: scope, callback: callback, args: args} ];
        }
    }

    $un (type, callback, scope) {
        if (typeof this.listeners[ type ] != 'undefined') {
            let numOfCallbacks = this.listeners[ type ].length;
            let newArray = [];
            for (let i = 0; i < numOfCallbacks; i++) {
                let listener = this.listeners[ type ][ i ];
                if (listener.scope === scope && listener.callback === callback) {

                } else {
                    newArray.push(listener);
                }
            }
            this.listeners[ type ] = newArray;
        }
    }

    $fire (type, target) {
        let event = {
            type: type,
            target: target
        };
        let args = [];
        let numOfArgs = arguments.length;
        for (let i = 0; i < numOfArgs; i++) {
            args.push(arguments[ i ]);
        }
        args = args.length > 2 ? args.splice(2, args.length - 1) : [];
        args = [ event ].concat(args);

        if (typeof this.listeners[ type ] != 'undefined') {
            let listeners = this.listeners[ type ].slice();
            let numOfCallbacks = listeners.length;
            for (let i = 0; i < numOfCallbacks; i++) {
                let listener = listeners[ i ];
                if (listener && listener.callback) {
                    let concatArgs = args.concat(listener.args);
                    if (concatArgs[ 0 ]) {
                        concatArgs[ 0 ] = concatArgs[ 0 ].target;
                    }
                    listener.callback.apply(listener.scope, concatArgs);
                }
            }
        }
    }
}

const event = new EventBus();

export default event;