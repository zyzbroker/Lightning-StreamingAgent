@isTest
private class SinkTest
{
    @isTest
    static void itShouldGetSession()
    {
        String sessionId = SinkRemoteController.getSinkSession();      
        System.assert(sessionId != '');
    }

    @isTest
    static void isShouldPublish(){
        Map<String,Object> query= new Map<String,Object>();
        query.put('eventId', 'test');
        query.put('priority', '1');
        query.put('message', 'ok');

        SinkDemoController.publish(query);
    }

    @isTest
    static void itParseString(){
        String a = SinkDemoController.parseString('asdf');
    }

    @isTest
    static void itTransform(){        
        Map<String,Object> query= new Map<String,Object>();
        query.put('eventId', 'test');
        query.put('priority', '1');
        query.put('message', 'ok');
        Notification__c n = SinkDemoController.transform(query);
    }
}