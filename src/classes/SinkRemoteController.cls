public without sharing class SinkRemoteController {

    @AuraEnabled
    public static String getSinkSession(){
        return UserInfo.getSessionId();
    }
}