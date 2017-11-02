public without sharing class SinkDemoController {
    @AuraEnabled
    public static void publish(Map<String,Object> query){
        try {
            Database.SaveResult result = Database.insert(transform(query));
            if(!result.isSuccess()){
                throw genAuraError(result);
            }
        }
        catch(AuraHandledException aura){
            throw aura;
        }
        catch(DmlException dml){
            throw new AuraHandledException(dml.getDmlMessage(0));
        }
        catch(Exception ex){
            throw new AuraHandledException(ex.getStackTraceString());
        }
    }
    @TestVisible
    static Notification__c transform(Map<String,Object> query){
        Notification__c note = new Notification__c();
        note.EventId__c = parseString(query.get('eventId'));
        note.Priority__c = parseString(query.get('priority'));
        note.Payload__c = parseString(query.get('message'));
        return note;
    }

@TestVisible
    static string parseString(Object val){
        return val != null ? String.valueOf(val): '';
    }

@TestVisible
    static AuraHandledException genAuraError(Database.SaveResult result){
        List<string> errors = new List<String>();
        for(Database.Error err: result.getErrors()){
            errors.add(err.getStatusCode() + ': ' + err.getMessage());
        }
        if (errors.size() == 0){
            errors.add('Failed to generate the notification event.');
        }
        return new AuraHandledException(String.join(errors,'\n'));
    }
}