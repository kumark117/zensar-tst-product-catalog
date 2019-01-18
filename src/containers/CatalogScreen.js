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
  rawProduct.price = fileProduct.prices.highSalePrice;
  
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
	//alert(this.state.colors);
		
  //COLLECT PRICE RANGE LIST
  
  //DROPDOWN FOR FILTERING BY PRICE RANGE
  
  this.sortByPrices = this.sortByPrices.bind(this);
  
  //this.filterByColor = this.filterByColor.bind(this);

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
///////////////////////////////////////////
  
render () {

    let strCatalog = this.render_helper(this.state.processedProducts);
	return (<div> 
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
	
	{strCatalog} 
	</div>);
}

render_helper(products) {
return products.map(product => <div> {product.name}  {product.price} {product.color}  </div>);
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

}