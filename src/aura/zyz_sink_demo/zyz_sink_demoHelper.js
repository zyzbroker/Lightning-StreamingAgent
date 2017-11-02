({
    onNotify: function(cmp, evt) {
        var params = evt.getParams();
        var arrNotes = cmp.get('v.notifications') || [];
        arrNotes.unshift(params);
        cmp.set('v.notifications', arrNotes);
    },

    submit: function(cmp, evt) {
        $A.util.toggleClass(cmp.find('spinner'), 'slds-hide');
        var msg = cmp.find('message').get('v.value'),
            payload = {
                action: 'publish',
                source: cmp,
                parameters: {
                    query: {
                        'eventId': 'demo',
                        'priority': '2',
                        'message': msg
                    }
                },
                onSuccess: function(cmp){
                    $A.util.toggleClass(cmp.find('spinner'), 'slds-hide');
                },
                onError: function(cmp, msg){
                    $A.util.toggleClass(cmp.find('spinner'), 'slds-hide');
                     self._notify('error', msg);
                }
            };
        this._dispatch(this, payload);
    },

    _dispatch: function(self, payload) {
        var action = payload.action,
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
    }
})