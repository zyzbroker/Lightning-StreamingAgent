({
    init: function(cmp) {
        var self = this;
        this._dispatch.call(this, {
            'source': cmp,
            'action': 'getSinkSession',
            'onSuccess': function(cmp, value) {
                cmp.set('v.SessionId', value);
                if (!!cmp.get('v.cometDReady') && !cmp.get('v.handShaked')) {
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
        cmp.set('v.cometDReady', true);
        if (!cmp.get('v.SessionId')) {
            return;
        }
        cmp.set('v.handShaked', true);
        this._init(cmp);
    },

    _init: function(cmp) {
        var cometd = new org.cometd.CometD(),
            debug = cmp.get('v.debugEnabled') || 0,
            self = this,
            config = {
                'url': this._getUrl(),
                'appendMessageTypeToURL': false,
                'requestHeaders': {
                    'Authorization': this._getToken(cmp)
                }
            };
        if (!!debug) {
            config.logLevel = 'debug';
            self._debug(config.url);
            self._debug(config.requestHeaders);
        }

        cometd.configure(config);
        cometd.websocketEnabled = true;
        cometd.handshake(function(reply) {
            if (reply.successful) {
                !!debug && self._debug('handshake succeeded');
                self._runContext.call(self, cmp, self._subscribe, cometd);
            } else {
                !!debug && self._debug(reply);
            }
        });
    },

    _subscribe: function(cmp, cometD) {
        var channel = cmp.get('v.channel');
        var self = this;
        var subscriptionReady = function(cmp) {
            var readyEvt = cmp.getEvent('sinkSubscriptionReady');
            readyEvt.fire();
        };

        cometD.subscribe(channel, function(message) {
            self._runContext.call(self, cmp, self._receive, message);
        }, function(reply) {
            if (reply.successful) {
                self._debug(['subscribing on', channel, ' succeeded.'].join(' '));
                self._async.call(self, cmp, subscriptionReady, 1);
            } else {
                self._debug(reply);
            }
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
        console.log('[CometD-debug]' + (msg instanceof String) ? msg : JSON.stringify(msg));
    },

    _receive: function(cmp, message) {
        var self=this, 
            action = cmp.getEvent('sinkNotification');
        action.setParams(message);
        action.fire();
        !!cmp.get('v.debugEnabled') && self._debug(message);
    },

    _getToken: function(cmp) {
        return ['OAuth', cmp.get('v.SessionId')].join(' ');
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