import React, { Component } from 'react';

import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.min.css';
//import { UncontrolledDropdown, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import CatalogData from '../data/products.json';
import NoImage from '../data/NoImage.png';

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
	this.state.checkedColors = [];
		
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
	this.state.checkedRanges = [];

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


sortByPricesUI(bDesc) {
  
      this.setState({ bDesc: bDesc});

}

sortByPrices(products) {
let processedProducts;
  if (!this.state.bDesc)
	processedProducts = products;
  else if (this.state.bDesc > 0)
   processedProducts = _.sortBy(products, ['price']);
  else
   processedProducts = _.sortBy(products, [function(o) { return -o.price; }]);

   return processedProducts;
}


///////////////////////////////////////////
  
render () {

//IMPORTANT: ALL FILTERS & SORT are applied here
    let strCatalog = this.render_helper(this.onAnyUserInteractionPost(this.state.rawProducts));

//		<div style={{display:"inline-block", position:"fixed", top:"0"}}> 

	return (
	<div className="container-fluid">
	
	<div className = "row">
	<div className="col-md-2 col-lg-2 col-xs-2 col-sm-2"> 
      <select>
        <option onClick={this.sortByPricesUI.bind(this, 0)}>Original File Order</option>
	    <option onClick={this.sortByPricesUI.bind(this,1)}>Ascending By Price</option>
        <option onClick={this.sortByPricesUI.bind(this,-1)}>Descending By Price</option>
      </select>
  
<br/><br/>
	{this.render_helper_colors()}
<br/>	
	{this.render_helper_price_ranges()}
	</div>
	
	<div className="col-md-10 col-lg-10 col-xs-10 col-sm-10" >
	{strCatalog} 
	</div>
	</div>
	
	</div>
	);
}

render_helper(products) {
return (
		<div>
			{products.map(product => this.render_helper_product(product))}
		</div>
	)
// <div style={{display:"inline-block", float:"right", top:"0"}}> {products.map(product => product.name +" " + product.price + " " +product.color)} </div>
}


render_helper_product(product) {
return (
		<div className="col-md-4" style={{ float : 'left'}}>
			<img src={NoImage} width="250" height="220" />
			<h5>{product.name}</h5>
			<button className="btn btn-sm btn-primary">Add Cart</button>
			<div style={{ float : 'right',paddingRight : '50px'}}>
			<span className="btn btn-sm btn-danger">${product.price}</span>
			</div>
		</div>
	)
// <div style={{display:"inline-block", float:"right", top:"0"}}> {products.map(product => product.name +" " + product.price + " " +product.color)} </div>
}

render_helper_colors() {
return (
	this.state.colors.map(color => this.render_helper_color_row_checkbox(color))
	);
}

render_helper_color_row_checkbox(color)
{
return (
<div className="container">
<div className="row">
<div className="col-md-12">
<input type="checkbox" onChange={this.toggleColor.bind(this,color)} checked={this.state.checkedColors.indexOf(color)!=-1} />
<span style={{paddingLeft:"10px"}}>{color}</span>
</div>
</div>
</div>
);
}

toggleColor(color) {
	const {checkedColors} = this.state;
	const cIx = checkedColors.indexOf(color);
	const newCheckedColors = [...checkedColors];
	if (cIx == -1)
		newCheckedColors.push(color);
	else
		newCheckedColors.splice(cIx,1);
		
	this.setState({checkedColors: newCheckedColors});
}

filterByColors(products) {
   const filterColors = this.state.checkedColors;
   //alert("FILTERCOLORS"+filterColors);
   let processedProducts = products;
   if (filterColors.length>0) {
	//alert("before filter len="+processedProducts.length);
	processedProducts = _.filter(products, function(val) { return filterColors.indexOf(val.color)!== -1});
	//alert("after filter len="+processedProducts.length);
   }
   else
    processedProducts = products;
		
	return processedProducts;
}
//////////////////////////////////////////////////////////////////////////
render_helper_price_ranges() {
return (
	this.state.priceRanges.map(range => this.render_helper_price_range_row_checkbox(range))
	);
}

render_helper_price_range_row_checkbox(range)
{
return (
<div className="container">
<div className="row">
<div className="col-md-12">
<input type="checkbox" onChange={this.togglePriceRange.bind(this,range)} checked={this.state.checkedRanges.indexOf(range)!==-1} />
<span style={{paddingLeft:"10px"}}>{range}</span>
</div>
</div>
</div>
)
}

togglePriceRange(range) {
	const {checkedRanges} = this.state;
	const cIx = checkedRanges.indexOf(range);
	const newcheckedRanges = [...checkedRanges];
	if (cIx == -1)
		newcheckedRanges.push(range);
	else
		newcheckedRanges.splice(cIx,1);
	
	this.setState({		
		checkedRanges: newcheckedRanges
	});
}

filterByPriceRanges(products) {
   const filterRanges = this.state.checkedRanges;
   let processedProducts = [];
   if (filterRanges.length>0) {
	//alert("filterRanges"+filterRanges);
    for (let ix in filterRanges) {
			let that = this;
			let p_s1 = _.filter(products, function(val) {
				let o1 = that.price_range_helper(filterRanges[ix]);
				//console.log("o1.v1=",o1.v1, " o1.v2=",o1.v2, " price = ", val.price)
				return val.price >= o1.v1 && val.price<=o1.v2});
		processedProducts = [...processedProducts, ...p_s1];
   }
   }
   else
    processedProducts = products;
	
	return processedProducts;
}


onAnyUserInteractionPost(products) {
		products = this.filterByColors(products);
		products = this.filterByPriceRanges(products);
		products = this.sortByPrices(products);
		return products;
}
}