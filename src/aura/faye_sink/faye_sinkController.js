({
    onInit: function(cmp, evt, h){
        h.init(cmp);
    },

    onScriptsLoaded: function(cmp, evt, h){
        h.onLoad(cmp);
    },

    onSubscriptionReady: function(cmp, evt, h){
        h.onSubscriptionReady(cmp,evt);
    },
})