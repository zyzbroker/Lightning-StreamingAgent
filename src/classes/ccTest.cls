@isTest
public class CCTest {
    public static testMethod void test_CC(){ 
        cc c = new cc();
        Integer i = c.calc_i();
        system.debug('i: ' + i);
        system.assertNotEquals(i,0);
        i = c.calc_i_2();
        system.assertNotEquals(i,0);
        i = c.calc_i_3();
        system.assertNotEquals(i,0);
        i = c.calc_i_4();
        system.assertNotEquals(i,0);
        i = c.calc_i_5();
        system.assertNotEquals(i,0);
        i = c.calc_i_6();
        system.assertNotEquals(i,0);
        i = c.calc_i_7();
        system.assertNotEquals(i,0);
        i = c.calc_i_8();
        system.assertNotEquals(i,0);
        i = c.calc_i_9();
        system.assertNotEquals(i,0);
        
    }
}