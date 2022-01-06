import React from 'react';

const convertPrice = (price) => {
  // default_currency is the default currency that is set for your store, string that has this format: "USD", "GBP", "EUR" and so on
  const default_currency = "USD";

  if(Shopify.currency.active !== default_currency){
    const convertedPrice = (window.Shopify.currency.rate * price).toFixed(2);

    if(Shopify.currency.active == 'EUR'){
      return Math.floor(convertedPrice) + 0.95;
    }
    return Math.ceil(convertedPrice);
  }
  return price;
}

export default convertPrice;
