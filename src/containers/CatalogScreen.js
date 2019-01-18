import React, { Component } from 'react';

import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UncontrolledDropdown, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import CatalogData from '../data/products.json';

export default class CatalogScreen extends Component {

constructor() {
 super();
 this.state = {};
 this.state.rawProducts = [];
 for (let product_ix in CatalogData.result.productList) {
  let fileProduct = CatalogData.result.productList[product_ix];
  let rawProduct = {};
  rawProduct.name = fileProduct.SKUs[0].name;
  rawProduct.color = fileProduct.SKUs[0].variant_values.color.name;
  rawProduct.price = parseInt(fileProduct.prices.highSalePrice);
  
  this.state.rawProducts.push(rawProduct);
 }
  //this.state.processedProducts = _.sortBy(this.state.rawProducts,['name']);
  this.state.processedProducts = this.state.rawProducts;
  
  //COLLECT COLOR LIST
  this.state.colors = [];
	let facets = CatalogData.facets;
	for (let ix in facets) {
		if (facets[ix].type === "RefinementMenu" && 
				facets[ix].name === "Color" &&
				facets[ix].refinementType === "Color")
		{
			let rfns = facets[ix].refinements;
			this.state.colors = rfns.map(obj => obj.displayName);
		}
	}
	
	alert(this.state.colors);
		
  //COLLECT PRICE RANGE LIST
	//let facets = CatalogData.facets;
	for (let ix in facets) {
		if (facets[ix].type === "RefinementMenu" && 
				facets[ix].name === "Price" &&
				facets[ix].refinementType === "Price")
		{
			let rfns = facets[ix].refinements;
			this.state.priceRanges = rfns.map(obj => obj.displayName);
		}
	}
	
	//alert(this.state.priceRanges);
	//this.state.priceRangesObjs = this.state.priceRanges.map(range => this.price_range_helper(range));
	//alert(JSON.stringify(this.state.priceRangesObjs));

	
  //DROPDOWN FOR FILTERING BY PRICE RANGE
  
  this.sortByPrices = this.sortByPrices.bind(this);
  
  //this.filterByColor = this.filterByColor.bind(this);

}


price_range_helper(rangeName){
	if (rangeName == "" || rangeName === undefined) {
		console.log("rangeName is empty");
		return {v1:0,v2:0};
	}
	let strs = rangeName.split("-");
	let v1, v2;
	v1 = parseInt(strs[0]);
	if (isNaN(v1) || v1 == null || v1 == "null")
		v1 = 0;
	v2 = parseInt(strs[1]);
	if (isNaN(v2) || v2 == null || v2 == "null")
		v2 = 0;
		
	return { v1, v2};
}

sortByPricesAsc = () => { console.log("sortByPrices(0)");this.sortByPrices(0);}
sortByPricesDesc = () => { console.log("sortByPrices(1)"); this.sortByPrices(1);}

sortByPrices(bDesc) {
  if (!bDesc) {
   let processedProducts = _.sortBy(this.state.rawProducts, ['price']);
  
  this.setState({processedProducts});
   }
  else {
   let processedProducts = _.sortBy(this.state.rawProducts, [function(o) { return -o.price; }]);
   this.setState({processedProducts}); 
 }
}

filterByColor(color) {
   console.log("filterByColor "+color);
   let processedProducts = _.filter(this.state.rawProducts, function(val) { return val.color === color});
   this.setState({processedProducts});
}

filterByPriceRange(range) {
   console.log("filterByPriceRange "+range);
   let o1 = this.price_range_helper(range);
   //alert("OOOOOOOOOOO1"+ JSON.stringify(o1));
   let processedProducts = _.filter(this.state.rawProducts, function(val) { 
   //console.log("CMP price="+val.price +"min "+o1.v1+"max "+o1.v2);
   return val.price >= o1.v1 && val.price<=o1.v2});
   this.setState({processedProducts});
}
///////////////////////////////////////////
  
render () {

    let strCatalog = this.render_helper(this.state.processedProducts);

//		<div style={{display:"inline-block", position:"fixed", top:"0"}}> 

	return (
	<div>
	
	<div> 
    <UncontrolledDropdown>
      <DropdownToggle caret>
        Dropdown
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem header>SORT: Ascending/Descending</DropdownItem>
        <DropdownItem onClick={this.sortByPricesAsc}>Ascending By Price</DropdownItem>
        <DropdownItem  divider />
        <DropdownItem onClick={this.sortByPricesDesc}>Descending By Price</DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>

	{this.render_helper_colors_dropdown()}
	{this.render_helper_price_ranges_dropdown()}
	</div>
	
	<div style={{display:"inline-block", float:"right", top:"0"}}>
	{strCatalog} 
	</div>
	
	</div>
	);
}

render_helper(products) {
return <div style={{display:"inline-block", float:"right", top:"0"}}> {products.map(product => product.name +" " + product.price + " " +product.color)} </div>
}


render_helper_colors_dropdown() {
return (
    <UncontrolledDropdown>
      <DropdownToggle caret>
        Color Dropdown
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem header>FILTER By Color</DropdownItem>
		{this.state.colors.map(color => <DropdownItem onClick={this.filterByColor.bind(this,color)}>{color}</DropdownItem>)}
      </DropdownMenu>
    </UncontrolledDropdown>
)
}

render_helper_price_ranges_dropdown() {
return (
    <UncontrolledDropdown>
      <DropdownToggle caret>
        Price Ranges Dropdown
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem header>FILTER By Price Range</DropdownItem>
		{this.state.priceRanges.map(range => <DropdownItem onClick={this.filterByPriceRange.bind(this, range)}>{range}</DropdownItem>)}
      </DropdownMenu>
    </UncontrolledDropdown>
)
}
}