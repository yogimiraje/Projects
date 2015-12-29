/**
 
 * @author Yogendra Miraje
 * @see com.amazon.product.publish
 * @version 1.0
 * @CreateDate Oct 23, 2015
 * @ChangedBy @ChangeDate 			@ChangeReq 								@ChangeDescription
 * 
 */

package com.amazon.product.publish.builder;

import java.io.BufferedReader;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.integration.support.MessageBuilder;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Service;

import com.amazon.product.publish.api.reader.BestSellarsByCtgry;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service(value="fileProcessor")
public class FileProcessor {
	private Logger log = Logger.getLogger(FileProcessor.class);
  
	public List<Message<String>> processFile(Message<?> message)  {
    	log.info("In processFile");
    	String fileName =  message.getPayload().toString();
    	log.info("Message content " + fileName);
    	//List<String> bestSellarList = new ArrayList<String>();
    	List<Message<String>> bestSellarList = new ArrayList<Message<String>>();

    	try{
    		@SuppressWarnings("resource")
			BufferedReader br = new BufferedReader(new FileReader(fileName));
    	    String line;
    	    while ((line = br.readLine()) != null) {
    	       log.info(line);
    	       
    	       BestSellarProductBuilder bspb = new BestSellarProductBuilder();
    	       BestSellarsByCtgry bestSellarsByCtgry = new BestSellarsByCtgry();
    	       bestSellarsByCtgry = bspb.findBestSellarProduct(line);
    	       String bestSellarJson = new ObjectMapper().writeValueAsString(bestSellarsByCtgry);
    	       log.info(bestSellarJson);
    	       Message<String> messageJson = MessageBuilder.withPayload(bestSellarJson).build();

    	       bestSellarList.add(messageJson);
    	    }
    	    return bestSellarList;
        
	    }
	    catch (Exception e) {
            throw new RuntimeException(e);
        }
    	 
    	
    }
 }
