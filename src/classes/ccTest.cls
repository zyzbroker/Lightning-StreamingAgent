@isTest
public class CCTest {
    public static testMethod void test_CC(){ 
        cc c = new cc();
        Integer i = c.getCount();
        system.debug('i: ' + i);
        system.assertNotEquals(i,0);
        i = c.getCount_2();
        system.assertNotEquals(i,0);
        i = c.getCount_3();
        system.assertNotEquals(i,0);
        i = c.getCount_4();
        system.assertNotEquals(i,0);
        i = c.getCount_5();
        system.assertNotEquals(i,0);
        i = c.getCount_6();
        system.assertNotEquals(i,0);
        i = c.getCount_7();
        system.assertNotEquals(i,0);
        i = c.getCount_8();
        system.assertNotEquals(i,0);
        i = c.getCount_9();
        system.assertNotEquals(i,0);
        
    }
}