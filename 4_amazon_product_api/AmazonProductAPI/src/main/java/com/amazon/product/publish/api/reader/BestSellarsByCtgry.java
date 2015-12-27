package com.amazon.product.publish.api.reader;

import java.util.HashMap;
import java.util.Map;

public class BestSellarsByCtgry {
	private String categoryId;
	private String categoryName;
	private Map<String,String> bestSellarProducts = new HashMap<String,String>();
	public String getCategoryId() {
		return categoryId;
	}
	public void setCategoryId(String categoryId) {
		this.categoryId = categoryId;
	}
	public String getCategoryName() {
		return categoryName;
	}
	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}
	public Map<String, String> getBestSellarProducts() {
		return bestSellarProducts;
	}
	public void setBestSellarProducts(Map<String, String> bestSellarProducts) {
		this.bestSellarProducts = bestSellarProducts;
	}
	
	@Override
	public String toString() {
		return "BestSellarsByCtgry [categoryId=" + categoryId + ", categoryName=" + categoryName
				+ ", bestSellarProducts=" + bestSellarProducts + "]";
	}
	
	
}
