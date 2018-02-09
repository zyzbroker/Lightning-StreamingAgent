({
    init: function(cmp) {
        var self = this;
        this._dispatch.call(this, {
            'source': cmp,
            'action': 'getSinkSession',
            'onSuccess': function(cmp, value) {
                cmp.set('v.sessionId', value);
                if (!!cmp.get('v.fayeReady') && !cmp.get('v.handShaked')) {
                    self._init.call(self, cmp);
                }
            }
        });
    },

    // subscription is ready
    onSubscriptionReady: function(cmp, evt) {
        cmp.set('v.cssStyle', 'zyz-broadcast success');
    },

    // triggered when all sripts are loaded.
    onLoad: function(cmp) {
        cmp.set('v.fayeReady', true);
        if (!cmp.get('v.sessionId')) {
            return;
        }
        cmp.set('v.handShaked', true);
        this._init(cmp);
    },

    _init: function(cmp) {
        var debug = cmp.get('v.debugEnabled') || 0,
            url = this._getUrl(),
            client = new Faye.Client(url),
            token = this._getToken(cmp),
            channel = cmp.get('v.channel'),
            self = this;


        if (!!debug) {
            self._debug(url);
            self._debug('Authorization:' + token);
        }

        client.setHeader('Authorization', token);
        client.disable('websocket');
        client.subscribe(channel, function(msg) {
            self._runContext.call(self, cmp, self._receive, {
                channel: channel,
                data: msg
            });
        }).then(function() {
            var readyEvt = cmp.getEvent('sinkSubscriptionReady');
            readyEvt.fire();
            console.log('faye: subscribed');
        }).catch(function(err){
            console.log('faye:' + err);
        });
    },

    _runContext: function(cmp, func, args) {
        var self = this;
        var callback = $A.getCallback(function() {
            if (cmp.isValid()) {
                func.call(self, cmp, args);
            } else {
                self._debug('component run out of scope');
            }
        });
        callback();
    },

    _debug: function(msg) {
        console.log('[Faye-debug]' + (msg instanceof String) ? msg : JSON.stringify(msg));
    },

    _receive: function(cmp, message) {
        var self = this,
            action = cmp.getEvent('sinkNotification');
        action.setParams(message);
        action.fire();
        !!cmp.get('v.debugEnabled') && self._debug(message);
    },

    _getToken: function(cmp) {
        return ['OAuth', cmp.get('v.sessionId')].join(' ');
    },

    _getUrl: function() {
        return [location.protocol, '//', location.host, '/cometd/39.0'].join('');
    },

    _dispatch: function(payload) {
        var action = payload.action,
            self = this,
            cmp = payload.source,
            params = payload.parameters,
            request = cmp.get('c.' + action);
        !!params && request.setParams(params);
        request.setCallback(this, function(response) {
            var state = response.getState();
            switch (state) {
                case 'SUCCESS':
                    if (!!payload.onSuccess) {
                        payload.onSuccess(cmp, response.getReturnValue());
                    } else {
                        self._notify('success', response.getReturnValue());
                    }
                    break;
                case 'ERROR':
                    if (!!payload.onError) {
                        payload.onError(cmp, self._getError(response.getError()));
                    } else {
                        self._notify('error', self._getError(response.getError));
                    }
                    break;
                case 'INCOMPLETE':
                    self._notify('error', 'The system ran into an incomplete state.');
                    break;
                default:
                    self._notify('error', 'The system ran into an unknown error.');
                    break;
            }
        });
        $A.enqueueAction(request);
    },

    _notify: function(msgType, msg) {
        var toast = $A.get('e.force:showToast');
        toast.setParams({
            'type': msgType,
            'message': msg,
            'mode': msgType === 'error' ? 'sticky' : 'dismissible'
        });
        toast.fire();
    },

    _getError: function(errors) {
        return (!!errors && errors[0] && errors[0].message) ? errors[0].message : 'unknown error';
    },

    _async: function(cmp, callback, duration, args) {
        if (!callback) {
            return;
        }
        var self = this;
        duration = duration || 200;
        var id = window.setTimeout($A.getCallback(function() {
            window.clearTimeout(id);
            if (cmp.isValid()) {
                callback.call(self, cmp, args);
            }
        }), duration);
    },
})