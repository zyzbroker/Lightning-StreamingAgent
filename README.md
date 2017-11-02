# Salesforce Lightning Component - Streaming Agent

The streaming agent leverages CometD protocol to communicate with salesforce event streaming server. It enables 
the lightning application to get the pushing notification from the server to interactively change the UI in response 
to the server event.

## How to install StreamingAgent Component And Demo
[Unmanaged package](https://login.salesforce.com/packaging/installPackage.apexp?p0=04t6A000000JRqy)

## How to use the StreamingAgent Component

### Step1: add the below html into your container component
```HTML
<c:zyz_sink debugEnabled="true" topic="ServiceClose"/>
```

#### attribute definitions
```
topic: this is the name value of the PushTopic Table
debugEnabled: true/false. if true, streaming commnucation data will be logged to the browser console.
```

### Step2: in your container component, you need to handle the notfication event

```HTML
    <aura:handler name="sinkNotification" event="c:zyz_sink_notification_event" action="{!c.onNotify}"/>
```

```Javascript
    onNotify: function(cmp, evt) {
        var params = evt.getParams();
        console.log(params.channel);
        console.log(JSON.stringify(params.data.event));
        console.log(JSON.stringify(params.data.sobject));
    },
```

## We are using the following opensource framework CometD 3.1.2
[CometD](https://docs.cometd.org/current/reference/#_installation)

## Note
Currently we only support to get the notification since the handshaking step is completed. the replay capability within 
24-hour window is not implemented yet. unless specifically requested from the community, we can add the extension 
to support this feature.


## The StreamAgent Demo Application Screenshot

![GitHub Logo](/images/StreamAgentDemo.png)