package ut.ag.tob.plugins;

import org.junit.Test;
import ag.tob.plugins.api.MyPluginComponent;
import ag.tob.plugins.impl.MyPluginComponentImpl;

import static org.junit.Assert.assertEquals;

public class MyComponentUnitTest
{
    @Test
    public void testMyName()
    {
        MyPluginComponent component = new MyPluginComponentImpl(null);
        assertEquals("names do not match!", "myComponent",component.getName());
    }
}