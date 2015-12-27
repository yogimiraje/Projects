package com.amazon.product.publish.builder;

import org.apache.log4j.Logger;

import com.amazon.product.publish.api.reader.BestSellarsByCtgry;
import com.amazon.product.publish.api.reader.BrowseNodeLookup;;

public class BestSellarProductBuilder {

	private Logger log = Logger.getLogger(BestSellarProductBuilder.class);
	
	public BestSellarsByCtgry findBestSellarProduct(String categoryID){
		log.info("In findBestSellarProduct: category ID " + categoryID );
		
		BrowseNodeLookup nodeLookup = new BrowseNodeLookup();
		BestSellarsByCtgry bestSellars = new BestSellarsByCtgry();
		bestSellars = nodeLookup.lookupNode(categoryID);
		log.info(bestSellars.toString());
		return bestSellars;
	}
}
