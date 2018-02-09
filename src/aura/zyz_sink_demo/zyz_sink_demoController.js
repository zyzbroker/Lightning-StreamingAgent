({
    onNotify: function(cmp, evt, h){
        h.onNotify(cmp, evt);
    },
    
    onSubmit: function(cmp, evt, h){
        h.submit(cmp,evt);
    },
    
    onCometDClicked: function(cmp, evt, h){
        h.toggleProtocol(cmp, true);
    },

    onFayeClicked: function(cmp, evt, h){
        h.toggleProtocol(cmp, false);
    }
})