package com.amazon.product.publish.builder;

import org.springframework.messaging.Message;
import org.springframework.stereotype.Service;

@Service(value="messagePrinter")
public class MessagePrinter {
	
	public void printMessage(Message<?> message){
		System.out.println("Received message: " + message);
	}
}
