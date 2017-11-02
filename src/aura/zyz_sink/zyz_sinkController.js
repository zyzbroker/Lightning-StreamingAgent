({
    onInit: function(cmp, evt, h){
        h.init(cmp);
    },

    onScriptsLoaded: function(cmp, evt, h){
        h.onLoad(cmp);
    },

    onToggle: function(cmp, evt, h){
        h.onToggle(cmp);
    },

    onSubscriptionReady: function(cmp, evt, h){
        h.onSubscriptionReady(cmp,evt);
    }
})