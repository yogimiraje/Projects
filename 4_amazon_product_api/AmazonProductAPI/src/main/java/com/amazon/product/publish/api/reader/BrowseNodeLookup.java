package com.amazon.product.publish.api.reader;
  
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class BrowseNodeLookup {

	/*
     * Your AWS Access Key ID, as taken from the AWS Your Account page.
     */
    private static final String AWS_ACCESS_KEY_ID = "";

    /*
     * Your AWS Secret Key corresponding to the above ID, as taken from the AWS
     * Your Account page.
     */
    private static final String AWS_SECRET_KEY = "";

    private static final String AWS_ASSOCIATE_ID = "";

    
    /*
     * Use the end-point according to the region you are interested in.
     */		
    private static final String ENDPOINT = "webservices.amazon.com";

    public BestSellarsByCtgry lookupNode(String nodeID) {

        /*
         * Set up the signed requests helper.
         */
        SignedRequestsHelper helper;

        try {
            helper = SignedRequestsHelper.getInstance(ENDPOINT, AWS_ACCESS_KEY_ID, AWS_SECRET_KEY);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

        String requestUrl = null;

        Map<String, String> params = new HashMap<String, String>();

        params.put("Service", "AWSECommerceService");
        params.put("Operation", "BrowseNodeLookup");
        params.put("AWSAccessKeyId", AWS_ACCESS_KEY_ID);
        params.put("AssociateTag", AWS_ASSOCIATE_ID);
        params.put("BrowseNodeId", nodeID);
        params.put("ResponseGroup", "TopSellers");

        requestUrl = helper.sign(params);

        System.out.println("Signed URL: \"" + requestUrl + "\"");
        return fetchTitle(requestUrl,nodeID);
    }
    
    private static BestSellarsByCtgry fetchTitle(String requestUrl,String nodeID) {
    	BestSellarsByCtgry bestSellars = new BestSellarsByCtgry();
    	bestSellars.setCategoryId(nodeID);
        String title = null;
        String asin = null;
        String category; 
        try {
            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            DocumentBuilder db = dbf.newDocumentBuilder();
            Document doc = db.parse(requestUrl);
            NodeList titleNodeList;
            NodeList asinNodeList; 
            category = doc.getElementsByTagName("Name").item(0).getTextContent();
            titleNodeList = doc.getElementsByTagName("Title");
            asinNodeList = doc.getElementsByTagName("ASIN");
            System.out.println("Category: " + category);
            bestSellars.setCategoryName(category);
            
            Map<String,String> bestSellarProducts = new HashMap<String,String>();
            for(int i=0; i < titleNodeList.getLength(); i ++){
            	 title = titleNodeList.item(i).getTextContent();
            	 asin = asinNodeList.item(i).getTextContent();
            	 //System.out.println("ASIN: " + asin + "  Title: " + title);
            	 bestSellarProducts.put(asin, title);
             }
            
        	 bestSellars.setBestSellarProducts(bestSellarProducts);

             return bestSellars;
             
         } catch (Exception e) {
            throw new RuntimeException(e);
         }
		
     }
}
