/**
 
 * @author Yogendra Miraje
 * @see com.amazon.product.publish
 * @version 1.0
 * @CreateDate Aug 23, 2015
 * @ChangedBy @ChangeDate 			@ChangeReq 								@ChangeDescription
 * 
 */

package com.amazon.product.publish;


import java.io.IOException;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;

 
@EnableAutoConfiguration 
@Configuration 
@ComponentScan({"com.amazon.product.publish"}) 
@ImportResource("file://///Users/Yogi/git/Projects/4_amazon_product_api/Properties/outbound-context.xml")
public class Application {
 	
    public static void main(String[] args) throws InterruptedException, IOException {
     
    	ConfigurableApplicationContext ctx = SpringApplication.run(Application.class, args);
        // Thread.sleep(1000);
     }
    
    
    
}
 