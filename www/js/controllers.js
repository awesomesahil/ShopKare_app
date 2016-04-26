angular.module('starter.controllers', ['Data.factory'])

.controller('AppCtrl',['$scope', '$state', '$ionicSideMenuDelegate', 'AuthFactory', 'UserFactory', 'Loader', 'CartFactory', 'Categories', function($scope, $state, $ionicSideMenuDelegate, AuthFactory, UserFactory, Loader, CartFactory, Categories) {
  $ionicSideMenuDelegate.canDragContent(false);
  $scope.$on('$ionicView.enter', function(){
    
    if(AuthFactory.isLoggedIn() == false)
    {
      $scope.isLoggedIn=true;
    }
    else{
      $scope.isLoggedIn=false;
    }
    
  });
  $scope.getCartItems = function()
  {
  if(AuthFactory.isLoggedIn() == false)
    {
      Loader.toggleLoadingWithMessage('Please login to view cart Products.');
      return '';
    }
  $scope.items=[];
  $scope.totalammount=0;
  CartFactory.getCartItems()
  .success(function(response){
    if (response == 'Unable to get cart items'){
      Loader.toggleLoadingWithMessage(response,2000);
    }
    else{
     for (var i=0; i<Object.keys(response).length;i++)
     {
       response[i].totalPrice = response[i].Price * response[i].Quantity; 
       $scope.items.push(response[i]);
        $scope.totalammount = $scope.totalammount + response[i].totalPrice;
     }
    }
  })
  .error(function(error){
    console.log(error);
  });
  };
  $scope.RemoveItem = function(index)
  {
    CartFactory.removeCartItem($scope.items[index])
    .success(function(response){
      if (response == 'Removed from cart')
      {
	$scope.totalammount = $scope.totalammount - $scope.items[index].totalPrice;
	$scope.items.splice(index,1);
      }
      Loader.toggleLoadingWithMessage(response,1000);
    })
    .error(function(error){
      Loader.toggleLoadingWithMessage(error,1000);
    });
    
  };
  $scope.DecreaseQuantity = function(index)
  {
    if(AuthFactory.isLoggedIn() == false)
    {
      Loader.toggleLoadingWithMessage('You need to Login before adding to cart.');
      return '';
    }
    if($scope.items[index].Quantity>0)
    {
      var product = $scope.items[index];
      product.Quantity = $scope.items[index].Quantity-1;
      CartFactory.addToCart(product)
     .success(function(response){
       if (response == 'Updated in cart')
       {
	 $scope.items[index].totalPrice = $scope.items[index].totalPrice - $scope.items[index].Price;
	 $scope.totalammount = $scope.totalammount - $scope.items[index].Price;
// 	 $scope.items[index].Quantity = $scope.items[index].Quantity-1;
       }
       Loader.toggleLoadingWithMessage(response,2000);
    }).error(function(error){
      Loader.toggleLoadingWithMessage('Unable to update. Please try after sometime',2000);
      console.log(error);
    });
    }
    else{
      $scope.RemoveItem(index);
    }
  };
  $scope.IncreaseQuantity = function(index)
  {
    var product = $scope.items[index];
    product.Quantity = $scope.items[index].Quantity+1;
    CartFactory.addToCart(product)
     .success(function(response){
       if (response == 'Updated in cart')
       {
	 $scope.items[index].totalPrice = $scope.items[index].totalPrice + $scope.items[index].Price;
	 $scope.totalammount = $scope.totalammount + $scope.items[index].Price;
	 console.log($scope.items[index].Quantity);
// 	 $scope.items[index].Quantity = $scope.items[index].Quantity + 1;
       }
       Loader.toggleLoadingWithMessage(response,2000);
    }).error(function(error){
      Loader.toggleLoadingWithMessage('Unable to update. Please try after sometime',2000);
      console.log(error);
    });
  };
  $scope.logout = function()
  {
    UserFactory.logout()
    .success(function(reply){
      if (reply == 'Logged out')
      {
	AuthFactory.deleteAuth();
	$scope.isLoggedIn = false;
	Loader.toggleLoadingWithMessage('Logged out');
	 $scope.isLoggedIn=true;
      }
      else{
	Loader.toggleLoadingWithMessage(reply);
      }
    })
    .error(function(err){
      console.log(err);
      Loader.toggleLoadingWithMessage('Unable to Logout');
    });
  }
  $scope.category = function(category)
  {
    $state.go('app.category', {
       categoryname: category
     });
  };
  
  $scope.Grocery=["Baby Products","Cereals and Spreads","Beverages and Drinks","Personal Care", 'Biscuits and Snacks', 'Chocolates and Candy', 'Cleaning and Hygiene', 'Staples', 'Pickles and Sauces', 'Home Care'];
  $scope.Stationary=["Staples","Pencils","Drafters","Pens"];
  $scope.showGrocery = false;
  $scope.ExpandCategory = function(category)
  {
      $scope.showGrocery=!$scope.showGrocery;
  };
  $scope.selectSubCategoryFromSideMenu=function(level1Category, maincategory)
  {
    console.log('Sub');
    $state.go('app.subcategory',{
       level1Category:level1Category,
       mainCategory:maincategory,
       subCategory:JSON.stringify(Categories.getSubCategories('Grocery', maincategory))
     });
  };
}])

.controller('Grocery',['$scope', '$state', 'Categories', 'ProductFactory', '$ionicScrollDelegate', 'CartFactory', 'Loader', 'AuthFactory', function($scope, $state, Categories, ProductFactory, $ionicScrollDelegate, CartFactory, Loader, AuthFactory) {
  console.log('Grocery');
  Loader.toggleLoadingWithMessage('Please wait while Products are being fetched',2000);
  $ionicScrollDelegate.anchorScroll();
  ProductFactory.getRandomProducts('Grocery')
  .success(function(resp){
    if (Object.keys(resp).length == 0 )
    {
      Loader.toggleLoadingWithMessage('Sorry no Trending products are available',3000);
    }
    else{
      $scope.trendingProducts=resp;
    }
  })
  .error(function(error){
    console.log(error);
    Loader.toggleLoadingWithMessage('Unable to Fetch Products. Try again later');
  });
  $scope.IncreaseTrendingQuantity = function(productindex, quantity)
  {
    if(AuthFactory.isLoggedIn() == false)
    {
      Loader.toggleLoadingWithMessage('You need to Login before adding to cart.');
      return '';
    }
    var cityIndex = 0;
      var product={
        ProductID: $scope.trendingProducts[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.trendingProducts[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:$scope.trendingProducts[productindex].quantity+1,
	product_name: $scope.trendingProducts[productindex].product_name,
	'Main Category': $scope.trendingProducts[productindex]['Main Category'],
	'Sub Category': $scope.trendingProducts[productindex]['Sub Category'],
	'Level1 Category': $scope.trendingProducts[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       if (response == 'Updated in cart' || response == 'Added to cart')
       {
	 $scope.trendingProducts[productindex].quantity = $scope.trendingProducts[productindex].quantity+1;
       }
       Loader.toggleLoadingWithMessage(response,2000);
    }).error(function(error){
      Loader.toggleLoadingWithMessage('Unable to add. Please try after sometime');
      console.log(error);
    });
  };
  $scope.DecreaseTrendingQuantity = function(productindex, quantity)
  {
    if(AuthFactory.isLoggedIn() == false)
    {
      Loader.toggleLoadingWithMessage('You need to Login first.');
      return '';
    }
    if($scope.trendingProducts[productindex].quantity){
      var cityIndex = 0;
      var product={
        ProductID: $scope.trendingProducts[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.trendingProducts[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:$scope.trendingProducts[productindex].quantity-1,
	product_name: $scope.trendingProducts[productindex].product_name,
	'Main Category': $scope.trendingProducts[productindex]['Main Category'],
	'Sub Category': $scope.trendingProducts[productindex]['Sub Category'],
	'Level1 Category': $scope.trendingProducts[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       if (response == 'Updated in cart' || response == 'Added to cart')
       {
	 $scope.trendingProducts[productindex].quantity = $scope.trendingProducts[productindex].quantity-1;
       }
       Loader.toggleLoadingWithMessage(response,2000);
    }).error(function(error){
      Loader.toggleLoadingWithMessage('Unable to add. Please try after sometime');
      console.log(error);
    });
    }
    else if($scope.trendingProducts[productindex].quantity==0)
    {
     var cityIndex = 0;
      var product={
        ProductID: $scope.trendingProducts[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.trendingProducts[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:0,
	product_name: $scope.trendingProducts[productindex].product_name,
	'Main Category': $scope.trendingProducts[productindex]['Main Category'],
	'Sub Category': $scope.trendingProducts[productindex]['Sub Category'],
	'Level1 Category': $scope.trendingProducts[productindex]['Level1 Category']
     };
      CartFactory.removeCartItem(product)
    .success(function(response){
      if (response == 'Removed from cart')
      {
	$scope.trendingProducts[productindex].quantity=0;
      }
      Loader.toggleLoadingWithMessage(response,1000);
    })
    .error(function(error){
      Loader.toggleLoadingWithMessage(error,1000);
    }); 
    }
    
  };
  $scope.IncreaseNewQuantity = function(productindex, quantity)
  {
    if(AuthFactory.isLoggedIn() == false)
    {
      Loader.toggleLoadingWithMessage('You need to Login first.');
      return '';
    }
    if(AuthFactory.isLoggedIn() == false)
    {
      Loader.toggleLoadingWithMessage('You need to Login before adding to cart.');
      return '';
    }
    var cityIndex = 0;
      var product={
        ProductID: $scope.trendingProducts[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.trendingProducts[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:$scope.trendingProducts[productindex].quantity+1,
	product_name: $scope.trendingProducts[productindex].product_name,
	'Main Category': $scope.trendingProducts[productindex]['Main Category'],
	'Sub Category': $scope.trendingProducts[productindex]['Sub Category'],
	'Level1 Category': $scope.trendingProducts[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       if (response == 'Updated in cart' || response == 'Added to cart')
       {
	 $scope.trendingProducts[productindex].quantity = $scope.trendingProducts[productindex].quantity+1;
       }
       Loader.toggleLoadingWithMessage(response,2000);
    }).error(function(error){
      Loader.toggleLoadingWithMessage('Unable to add. Please try after sometime');
      console.log(error);
    });
  };
  $scope.DecreaseNewQuantity = function(productindex, quantity)
  {
    if(AuthFactory.isLoggedIn() == false)
    {
      Loader.toggleLoadingWithMessage('You need to Login first.');
      return '';
    }
    if($scope.trendingProducts[productindex].quantity){
      var cityIndex = 0;
      var product={
        ProductID: $scope.trendingProducts[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.trendingProducts[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:$scope.trendingProducts[productindex].quantity-1,
	product_name: $scope.trendingProducts[productindex].product_name,
	'Main Category': $scope.trendingProducts[productindex]['Main Category'],
	'Sub Category': $scope.trendingProducts[productindex]['Sub Category'],
	'Level1 Category': $scope.trendingProducts[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       if (response == 'Updated in cart' || response == 'Added to cart')
       {
	 $scope.trendingProducts[productindex].quantity = $scope.trendingProducts[productindex].quantity-1;
       }
       Loader.toggleLoadingWithMessage(response,2000);
    }).error(function(error){
      Loader.toggleLoadingWithMessage('Unable to add. Please try after sometime');
      console.log(error);
    });
    }
    else if($scope.trendingProducts[productindex].quantity==0)
    {
     var cityIndex = 0;
      var product={
        ProductID: $scope.trendingProducts[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.trendingProducts[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:0,
	product_name: $scope.trendingProducts[productindex].product_name,
	'Main Category': $scope.trendingProducts[productindex]['Main Category'],
	'Sub Category': $scope.trendingProducts[productindex]['Sub Category'],
	'Level1 Category': $scope.trendingProducts[productindex]['Level1 Category']
     };
      CartFactory.removeCartItem(product)
    .success(function(response){
      if (response == 'Removed from cart')
      {
	$scope.trendingProducts[productindex].quantity=0;
      }
      Loader.toggleLoadingWithMessage(response,1000);
    })
    .error(function(error){
      Loader.toggleLoadingWithMessage(error,1000);
    }); 
    }
    
  };
  $scope.viewTrendingProduct = function(index){
    $state.go('app.product',{
      product:JSON.stringify($scope.trendingProducts[index])
    });
  };
  $scope.viewNewReleaseProduct = function(index){
    $state.go('app.product',{
      product:JSON.stringify($scope.newProducts[index])
    });
  };  
  $scope.AddToNewReleasesCart = function(productindex, quantity)
  {
    if(AuthFactory.isLoggedIn() == false)
    {
      Loader.toggleLoadingWithMessage('You need to Login first.');
      return '';
    }
    var cityIndex = 0;
      var product={
        ProductID: $scope.newProducts[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.newProducts[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:1,
	product_name: $scope.newProducts[productindex].product_name,
	'Main Category': $scope.newProducts[productindex]['Main Category'],
	'Sub Category': $scope.newProducts[productindex]['Sub Category'],
	'Level1 Category': $scope.newProducts[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       Loader.toggleLoadingWithMessage(response,2000);
    }).error(function(error){
      Loader.toggleLoadingWithMessage('Unable to add. Please try after sometime');
      console.log(error);
    });
  };
  $scope.AddToTrendingCart = function(productindex, quantity)
  {
   if(AuthFactory.isLoggedIn() == false)
    {
      Loader.toggleLoadingWithMessage('You need to Login first.');
      return '';
    }
    console.log('Add to cart');
    var cityIndex = 0;
      var product={
        ProductID: $scope.trendingProducts[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.trendingProducts[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:1,
	product_name: $scope.trendingProducts[productindex].product_name,
	'Main Category': $scope.trendingProducts[productindex]['Main Category'],
	'Sub Category': $scope.trendingProducts[productindex]['Sub Category'],
	'Level1 Category': $scope.trendingProducts[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       Loader.toggleLoadingWithMessage(response,2000);
    }).error(function(error){
      Loader.toggleLoadingWithMessage('Unable to add. Please try after sometime');
      console.log(error);
    });
  };
  ProductFactory.getRandomProducts('Grocery')
  .success(function(resp){
    if (Object.keys(resp).length == 0 )
    {
      Loader.toggleLoadingWithMessage('Sorry no new products are available',3000);
    }
    else{
      $scope.newProducts=resp;
    }
  })
  .error(function(error){
    console.log(error);
    Loader.toggleLoadingWithMessage('Unable to Fetch Products. Try again later');
  });
  $scope.selectSubCategory = function(maincategory)
  {
     $state.go('app.subcategory',{
       level1Category:'Grocery',
       mainCategory:maincategory,
       subCategory:JSON.stringify(Categories.getSubCategories('Grocery', maincategory))
     });
  };
}])

.controller('Checkout',['$scope', '$stateParams', '$state', 'CartFactory', 'Loader', 'AuthFactory', function($scope, $stateParams, $state, CartFactory, Loader, AuthFactory) {
  console.log('Checkout page');
  $scope.coupon='';
  $scope.ApplyCoupon = function()
  {
    console.log('coupon');
    Loader.toggleLoadingWithMessage('Sorry Coupon code not available.');
  };
  $scope.$on('$ionicView.enter', function(){
  if(AuthFactory.isLoggedIn() == false)
    {
      Loader.toggleLoadingWithMessage('You need to Login first.');
      return '';
    }
  $scope.items=[];
  $scope.totalammount=0;
  CartFactory.getCartItems()
  .success(function(response){
    if (response == 'Unable to get cart items'){
      Loader.toggleLoadingWithMessage(response,2000);
    }
    else{
     for (var i=0; i<Object.keys(response).length;i++)
     {
       response[i].totalPrice = response[i].Price * response[i].Quantity; 
       $scope.items.push(response[i]);
        $scope.totalammount = $scope.totalammount + response[i].totalPrice;
     }
    }
  })
  .error(function(error){
    console.log(error);
  });
  });
  $scope.ConfirmOrder = function(){
    if(AuthFactory.isLoggedIn() == false)
    {
      Loader.toggleLoadingWithMessage('You need to Login first.');
      return '';
    }
    $state.go("app.orderplacement",{
      coupon: $scope.coupon
    });
  };
}])

.controller('subCategory',['$scope', '$stateParams', 'ProductFactory', 'CartFactory', '$ionicSideMenuDelegate', 'Loader', '$state', 'AuthFactory', function($scope, $stateParams, ProductFactory, CartFactory, $ionicSideMenuDelegate, Loader, $state, AuthFactory) {
  $scope.MainCategory=$stateParams.mainCategory;
  $ionicSideMenuDelegate.canDragContent(false);
  ProductFactory.getRandomMainCategoryProducts($stateParams.level1Category, $scope.MainCategory)
  .success(function(resp){
    if (Object.keys(resp).length == 0 )
    {
      Loader.toggleLoadingWithMessage('Sorry no Trending products are available',3000);
    }
    else{
      $scope.trendingProducts=resp;
    }
  })
  .error(function(error){
    console.log(error);
    Loader.toggleLoadingWithMessage('Unable to Fetch Products. Try again later');
  });
  $scope.IncreaseTrendingQuantity = function(productindex, quantity)
  {
    if(AuthFactory.isLoggedIn() == false)
    {
      Loader.toggleLoadingWithMessage('You need to Login first.');
      return '';
    }
    var cityIndex = 0;
      var product={
        ProductID: $scope.trendingProducts[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.trendingProducts[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:$scope.trendingProducts[productindex].quantity+1,
	product_name: $scope.trendingProducts[productindex].product_name,
	'Main Category': $scope.trendingProducts[productindex]['Main Category'],
	'Sub Category': $scope.trendingProducts[productindex]['Sub Category'],
	'Level1 Category': $scope.trendingProducts[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       if (response == 'Updated in cart' || response == 'Added to cart')
       {
	 $scope.trendingProducts[productindex].quantity = $scope.trendingProducts[productindex].quantity+1;
       }
       Loader.toggleLoadingWithMessage(response,2000);
    }).error(function(error){
      Loader.toggleLoadingWithMessage('Unable to add. Please try after sometime');
      console.log(error);
    });
  };
  $scope.DecreaseTrendingQuantity = function(productindex, quantity)
  {
    if(AuthFactory.isLoggedIn() == false)
    {
      Loader.toggleLoadingWithMessage('You need to Login first.');
      return '';
    }
    if($scope.trendingProducts[productindex].quantity){
      var cityIndex = 0;
      var product={
        ProductID: $scope.trendingProducts[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.trendingProducts[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:$scope.trendingProducts[productindex].quantity-1,
	product_name: $scope.trendingProducts[productindex].product_name,
	'Main Category': $scope.trendingProducts[productindex]['Main Category'],
	'Sub Category': $scope.trendingProducts[productindex]['Sub Category'],
	'Level1 Category': $scope.trendingProducts[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       if (response == 'Updated in cart' || response == 'Added to cart')
       {
	 $scope.trendingProducts[productindex].quantity = $scope.trendingProducts[productindex].quantity-1;
       }
       Loader.toggleLoadingWithMessage(response,2000);
    }).error(function(error){
      Loader.toggleLoadingWithMessage('Unable to add. Please try after sometime');
      console.log(error);
    });
    }
    else if($scope.trendingProducts[productindex].quantity==0)
    {
     var cityIndex = 0;
      var product={
        ProductID: $scope.trendingProducts[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.trendingProducts[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:0,
	product_name: $scope.trendingProducts[productindex].product_name,
	'Main Category': $scope.trendingProducts[productindex]['Main Category'],
	'Sub Category': $scope.trendingProducts[productindex]['Sub Category'],
	'Level1 Category': $scope.trendingProducts[productindex]['Level1 Category']
     };
      CartFactory.removeCartItem(product)
    .success(function(response){
      if (response == 'Removed from cart')
      {
	$scope.trendingProducts[productindex].quantity=0;
      }
      Loader.toggleLoadingWithMessage(response,1000);
    })
    .error(function(error){
      Loader.toggleLoadingWithMessage(error,1000);
    }); 
    }
    
  };
  $scope.IncreaseNewQuantity = function(productindex, quantity)
  {
    if(AuthFactory.isLoggedIn() == false)
    {
      Loader.toggleLoadingWithMessage('You need to Login first.');
      return '';
    }
    var cityIndex = 0;
      var product={
        ProductID: $scope.trendingProducts[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.trendingProducts[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:$scope.trendingProducts[productindex].quantity+1,
	product_name: $scope.trendingProducts[productindex].product_name,
	'Main Category': $scope.trendingProducts[productindex]['Main Category'],
	'Sub Category': $scope.trendingProducts[productindex]['Sub Category'],
	'Level1 Category': $scope.trendingProducts[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       if (response == 'Updated in cart' || response == 'Added to cart')
       {
	 $scope.trendingProducts[productindex].quantity = $scope.trendingProducts[productindex].quantity+1;
       }
       Loader.toggleLoadingWithMessage(response,2000);
    }).error(function(error){
      Loader.toggleLoadingWithMessage('Unable to add. Please try after sometime');
      console.log(error);
    });
  };
  $scope.DecreaseNewQuantity = function(productindex, quantity)
  {
    if(AuthFactory.isLoggedIn() == false)
    {
      Loader.toggleLoadingWithMessage('You need to Login first.');
      return '';
    }
    if($scope.trendingProducts[productindex].quantity){
      var cityIndex = 0;
      var product={
        ProductID: $scope.trendingProducts[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.trendingProducts[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:$scope.trendingProducts[productindex].quantity-1,
	product_name: $scope.trendingProducts[productindex].product_name,
	'Main Category': $scope.trendingProducts[productindex]['Main Category'],
	'Sub Category': $scope.trendingProducts[productindex]['Sub Category'],
	'Level1 Category': $scope.trendingProducts[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       if (response == 'Updated in cart' || response == 'Added to cart')
       {
	 $scope.trendingProducts[productindex].quantity = $scope.trendingProducts[productindex].quantity-1;
       }
       Loader.toggleLoadingWithMessage(response,2000);
    }).error(function(error){
      Loader.toggleLoadingWithMessage('Unable to add. Please try after sometime');
      console.log(error);
    });
    }
    else if($scope.trendingProducts[productindex].quantity==0)
    {
     var cityIndex = 0;
      var product={
        ProductID: $scope.trendingProducts[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.trendingProducts[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:0,
	product_name: $scope.trendingProducts[productindex].product_name,
	'Main Category': $scope.trendingProducts[productindex]['Main Category'],
	'Sub Category': $scope.trendingProducts[productindex]['Sub Category'],
	'Level1 Category': $scope.trendingProducts[productindex]['Level1 Category']
     };
      CartFactory.removeCartItem(product)
    .success(function(response){
      if (response == 'Removed from cart')
      {
	$scope.trendingProducts[productindex].quantity=0;
      }
      Loader.toggleLoadingWithMessage(response,1000);
    })
    .error(function(error){
      Loader.toggleLoadingWithMessage(error,1000);
    }); 
    }
    
  };
  $scope.AddToNewReleasesCart = function(productindex, quantity)
  {
    if(AuthFactory.isLoggedIn() == false)
    {
      Loader.toggleLoadingWithMessage('You need to Login first.');
      return '';
    }
    var cityIndex = 0;
      var product={
        ProductID: $scope.newProducts[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.newProducts[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:1,
	product_name: $scope.newProducts[productindex].product_name,
	'Main Category': $scope.newProducts[productindex]['Main Category'],
	'Sub Category': $scope.newProducts[productindex]['Sub Category'],
	'Level1 Category': $scope.newProducts[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       Loader.toggleLoadingWithMessage(response,2000);
    }).error(function(error){
      Loader.toggleLoadingWithMessage('Unable to add. Please try after sometime');
      console.log(error);
    });
  };
  $scope.AddToTrendingCart = function(productindex, quantity)
  {
    if(AuthFactory.isLoggedIn() == false)
    {
      Loader.toggleLoadingWithMessage('You need to Login first.');
      return '';
    }
    var cityIndex = 0;
      var product={
        ProductID: $scope.trendingProducts[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.trendingProducts[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:1,
	product_name: $scope.trendingProducts[productindex].product_name,
	'Main Category': $scope.trendingProducts[productindex]['Main Category'],
	'Sub Category': $scope.trendingProducts[productindex]['Sub Category'],
	'Level1 Category': $scope.trendingProducts[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       Loader.toggleLoadingWithMessage(response,2000);
    }).error(function(error){
      Loader.toggleLoadingWithMessage('Unable to add. Please try after sometime');
      console.log(error);
    });
  };
  $scope.viewTrendingProduct = function(index){
    $state.go('app.product',{
      product:JSON.stringify($scope.trendingProducts[index])
    });
  };
  $scope.viewNewReleaseProduct = function(index){
    $state.go('app.product',{
      product:JSON.stringify($scope.newProducts[index])
    });
  };  
  
  ProductFactory.getRandomMainCategoryProducts($stateParams.level1Category, $scope.MainCategory)
  .success(function(resp){
    if (Object.keys(resp).length == 0 )
    {
      Loader.toggleLoadingWithMessage('Sorry no new products are available',3000);
    }
    else{
      $scope.newProducts=resp;
    }
  })
  .error(function(error){
    console.log(error);
    Loader.toggleLoadingWithMessage('Unable to Fetch Products. Try again later');
  });
  $scope.viewSubCategoryProducts = function(subcategory)
  {
    $state.go('app.products',{
      level1Category:$stateParams.level1Category,
      mainCategory:$stateParams.mainCategory,
      subcategory: subcategory
    });
  };
  $scope.subcategories=JSON.parse($stateParams.subCategory);
  
  $scope.viewSubCategory = function(index)
  {
    $state.go('app.subcategory', {
       categoryname: $stateParams.categoryname,
       subcategory: $scope.categories[index]
     });
  };
}])

.controller('Product',['$scope', '$stateParams', 'CartFactory', 'Loader', 'AuthFactory', function($scope, $stateParams, CartFactory, Loader, AuthFactory) {
  $scope.product = JSON.parse($stateParams.product);
  $scope.cartProduct={
        ProductID: $scope.product._id,
	QuantityType: $scope.product.Quantity[0].Quantities[0][0],
	QuantityIndex: 0,
	Price: $scope.product.Quantity[0].Quantities[0][1],
	Quantity:0,
	product_name: $scope.product.product_name,
	'Main Category': $scope.product['Main Category'],
	'Sub Category': $scope.product['Sub Category'],
	'Level1 Category': $scope.product['Level1 Category']
     };
  console.log(JSON.stringify($scope.cartProduct));
  $scope.DecreaseQuantity = function()
  {
    if(AuthFactory.isLoggedIn() == false)
    {
      Loader.toggleLoadingWithMessage('You need to Login first.');
      return '';
    }
    if($scope.cartProduct.Quantity)
    {
      $scope.cartProduct.Quantity = $scope.cartProduct.Quantity-1;
      CartFactory.addToCart($scope.cartProduct)
      .success(function(response){
	if ( response == 'Updated in cart' || response == 'Added to cart')
	{}
	else{
	  $scope.cartProduct.Quantity = $scope.cartProduct.Quantity+1;
	}
	Loader.toggleLoadingWithMessage($scope.cartProduct.product_name+' '+$scope.cartProduct.QuantityType+' '+response,2000);
      }).error(function(error){
	Loader.toggleLoadingWithMessage('Unable to add. Please try after sometime');
	console.log(error);
      });
    }
    else if($scope.cartProduct.Quantity==0)
    {
      CartFactory.removeCartItem($scope.cartProduct)
      .success(function(response){
	if ( response == 'Removed from cart')
	{}
	else{
	  $scope.cartProduct.Quantity = $scope.cartProduct.Quantity+1;
	}
	Loader.toggleLoadingWithMessage($scope.cartProduct.product_name+' '+$scope.cartProduct.QuantityType+' '+response,2000);
      }).error(function(error){
	Loader.toggleLoadingWithMessage('Unable to add. Please try after sometime');
	console.log(error);
      });
    }
  };
  $scope.IncreaseQuantity = function()
  {
    if(AuthFactory.isLoggedIn() == false)
    {
      Loader.toggleLoadingWithMessage('You need to Login first.');
      return '';
    }
    $scope.cartProduct.Quantity = $scope.cartProduct.Quantity+1;
      CartFactory.addToCart($scope.cartProduct)
      .success(function(response){
	if ( response == 'Updated in cart' || response == 'Added to cart')
	{}
	else{
	  $scope.cartProduct.Quantity = $scope.cartProduct.Quantity-1;
	}
	Loader.toggleLoadingWithMessage($scope.cartProduct.product_name+' '+$scope.cartProduct.QuantityType+' '+response,2000);
      }).error(function(error){
	Loader.toggleLoadingWithMessage('Unable to add. Please try after sometime');
	console.log(error);
      });
  };
  $scope.addToCart = function()
  {
    if(AuthFactory.isLoggedIn() == false)
    {
      Loader.toggleLoadingWithMessage('You need to Login first.');
      return '';
    }
    CartFactory.addToCart($scope.cartProduct)
     .success(function(response){
       Loader.toggleLoadingWithMessage($scope.cartProduct.product_name+' '+$scope.cartProduct.QuantityType+' '+response,2000);
    }).error(function(error){
      Loader.toggleLoadingWithMessage('Unable to add. Please try after sometime');
      console.log(error);
    });
  };
  $scope.viewPrice = function(index)
  {
    $scope.price = $scope.product.Quantity[0].Quantities[index][1];
    $scope.cartProduct.QuantityType = $scope.product.Quantity[0].Quantities[index][0];
    console.log(JSON.stringify($scope.cartProduct.QuantityType));
  };
  $scope.price = $scope.product.Quantity[0].Quantities[0][1];
  $scope.categories=['Masala','Oats', 'Dals'];
}])

.controller('Courier',['$scope', '$stateParams', 'CartFactory', 'Loader', 'AuthFactory', function($scope, $stateParams, CartFactory, Loader, AuthFactory) {
  console.log('Courier');
  $scope.courier={};
  $scope.Confirm = function()
  {
    if(AuthFactory.isLoggedIn() == false)
    {
      Loader.toggleLoadingWithMessage('You need to Login first.');
      return '';
    }
    Loader.showLoading('Please wait while we are placing your Order.');
    CartFactory.newCourierOrder($scope.courier)
    .success(function(response){
      Loader.hideLoading();
      Loader.toggleLoadingWithMessage(response);
    })
    .error(function(error){
      Loader.hideLoading();
      Loader.toggleLoadingWithMessage(error);
    })
  };
}])

.controller('Medical',['$scope', '$stateParams', '$ionicPopover', 'AuthFactory', function($scope, $stateParams, $ionicPopover, AuthFactory) {
  console.log('Medical');
  $scope.images=[];
  
  $scope.optionClicked = function(choice){
    $scope.popover.hide();
    if(choice==1)
    {
      window.imagePicker.getPictures(
	function(results) {
	  for (var i = 0; i < results.length; i++) {
	    $scope.images.push(results[i]);
	    $scope.$apply();
	  }
	  if(!$scope.$$phase) {
					$scope.$apply();
				}
	}, function (error) {
	    Loader.toggleLoadingWithMessage('Unable to pick images.');
	}, {
	     maximumImagesCount: 2-$scope.images.length,
	     quality: 40
	    }
      );
    }
    
    else if(choice==2)
    {

	var options = {
	destinationType: Camera.DestinationType.FILE_URI,
	sourceType: Camera.PictureSourceType.CAMERA,
	};

      $cordovaCamera.getPicture(options).then(function(imageURI) {
	$scope.images.push(imageURI);
	$scope.$apply();
      }, function(err) {
	Loader.toggleLoadingWithMessage('Unable to select image. ');
	// error
      });

    }
  };
  // .fromTemplateUrl() method
  $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
  
  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  
}])

.controller('Products',['$scope', '$state', '$stateParams', 'ProductFactory', 'Loader', 'CartFactory', 'AuthFactory', function($scope, $state,  $stateParams, ProductFactory, Loader, CartFactory, AuthFactory) {
  $scope.products=[];
  $scope.AddQuantity = function(productindex, quantity)
  {
    if(AuthFactory.isLoggedIn() == false)
    {
      Loader.toggleLoadingWithMessage('You need to Login first.');
      return '';
    }
    var cityIndex = 0;
      var product={
        ProductID: $scope.products[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.products[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:$scope.products[productindex].quantity+1,
	product_name: $scope.products[productindex].product_name,
	'Main Category': $scope.products[productindex]['Main Category'],
	'Sub Category': $scope.products[productindex]['Sub Category'],
	'Level1 Category': $scope.products[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       if (response == 'Updated in cart' || 'Added to cart')
       {
	 $scope.products[productindex].quantity = $scope.products[productindex].quantity+1;
       }
       Loader.toggleLoadingWithMessage(response,2000);
    }).error(function(error){
      Loader.toggleLoadingWithMessage('Unable to add. Please try after sometime');
      console.log(error);
    });
  };
  $scope.RemoveQuantity = function(productindex, quantity)
  {
    if(AuthFactory.isLoggedIn() == false)
    {
      Loader.toggleLoadingWithMessage('You need to Login first.');
      return '';
    }
    if($scope.products[productindex].quantity){
      var cityIndex = 0;
      var product={
        ProductID: $scope.products[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.products[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:$scope.products[productindex].quantity-1,
	product_name: $scope.products[productindex].product_name,
	'Main Category': $scope.products[productindex]['Main Category'],
	'Sub Category': $scope.products[productindex]['Sub Category'],
	'Level1 Category': $scope.products[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       if (response == 'Updated in cart' || 'Added to cart')
       {
	 $scope.products[productindex].quantity = $scope.products[productindex].quantity-1;
       }
       Loader.toggleLoadingWithMessage(response,2000);
    }).error(function(error){
      Loader.toggleLoadingWithMessage('Unable to add. Please try after sometime');
      console.log(error);
    });
    }
    else if($scope.products[productindex].quantity==0)
    {
     var cityIndex = 0;
      var product={
        ProductID: $scope.products[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.products[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:0,
	product_name: $scope.products[productindex].product_name,
	'Main Category': $scope.products[productindex]['Main Category'],
	'Sub Category': $scope.products[productindex]['Sub Category'],
	'Level1 Category': $scope.products[productindex]['Level1 Category']
     };
      CartFactory.removeCartItem(product)
    .success(function(response){
      if (response == 'Removed from cart')
      {
	$scope.products[productindex].quantity=0;
      }
      Loader.toggleLoadingWithMessage(response,1000);
    })
    .error(function(error){
      Loader.toggleLoadingWithMessage(error,1000);
    }); 
    }
  };
  $scope.AddToTrendingCart = function(productindex, quantity)
  {
    if(AuthFactory.isLoggedIn() == false)
    {
      Loader.toggleLoadingWithMessage('You need to Login first.');
      return '';
    }
    console.log('Add to cart');
    var cityIndex = 0;
      var product={
        ProductID: $scope.products[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.products[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:1,
	product_name: $scope.products[productindex].product_name,
	'Main Category': $scope.products[productindex]['Main Category'],
	'Sub Category': $scope.products[productindex]['Sub Category'],
	'Level1 Category': $scope.products[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       Loader.toggleLoadingWithMessage(response,2000);
    }).error(function(error){
      Loader.toggleLoadingWithMessage('Unable to add. Please try after sometime');
      console.log(error);
    });
  };
  $scope.viewProduct = function(index){
    $state.go('app.product',{
      product:JSON.stringify($scope.products[index])
    });
  };
  $scope.quantity='';
  ProductFactory.getProducts($stateParams.level1Category, $stateParams.mainCategory, $stateParams.subcategory)
  .success(function(reply){
    if (reply == 'Unable to Fetch')
    {
      Loader.toggleLoadingWithMessage('Sorry Unable to fetch Products right now.');
    }
    else{
      for (var i=0; i< Object.keys(reply).length; i++)
	{
	  $scope.products.push(reply[i]);
	  $scope.products[i].quantity=0;
	}
    }
  })
  .error(function(error){
    Loader.toggleLoadingWithMessage('Unable to Fetch Products right now.');
  });
  $scope.subcategory = $stateParams.subcategory;
  $scope.categories=['Masala','Oats', 'Dals'];
}])

.controller('Search',['$scope', '$state', 'ProductFactory', '$stateParams', 'Loader', 'CartFactory', 'AuthFactory', function($scope, $state, ProductFactory, $stateParams, Loader, CartFactory, AuthFactory) {
  console.log('Search Controller');
  $scope.products=[];
  $scope.AddQuantity = function(productindex, quantity)
  {
    if(AuthFactory.isLoggedIn() == false)
    {
      Loader.toggleLoadingWithMessage('You need to Login first.');
      return '';
    }
    var cityIndex = 0;
      var product={
        ProductID: $scope.products[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.products[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:$scope.products[productindex].quantity+1,
	product_name: $scope.products[productindex].product_name,
	'Main Category': $scope.products[productindex]['Main Category'],
	'Sub Category': $scope.products[productindex]['Sub Category'],
	'Level1 Category': $scope.products[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       if (response == 'Updated in cart' || 'Added to cart')
       {
	 $scope.products[productindex].quantity = $scope.products[productindex].quantity+1;
       }
       Loader.toggleLoadingWithMessage(response,2000);
    }).error(function(error){
      Loader.toggleLoadingWithMessage('Unable to add. Please try after sometime');
      console.log(error);
    });
  };
  $scope.RemoveQuantity = function(productindex, quantity)
  {
    if(AuthFactory.isLoggedIn() == false)
    {
      Loader.toggleLoadingWithMessage('You need to Login first.');
      return '';
    }
    if($scope.products[productindex].quantity){
      var cityIndex = 0;
      var product={
        ProductID: $scope.products[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.products[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:$scope.products[productindex].quantity-1,
	product_name: $scope.products[productindex].product_name,
	'Main Category': $scope.products[productindex]['Main Category'],
	'Sub Category': $scope.products[productindex]['Sub Category'],
	'Level1 Category': $scope.products[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       if (response == 'Updated in cart' || 'Added to cart')
       {
	 $scope.products[productindex].quantity = $scope.products[productindex].quantity-1;
       }
       Loader.toggleLoadingWithMessage(response,2000);
    }).error(function(error){
      Loader.toggleLoadingWithMessage('Unable to add. Please try after sometime');
      console.log(error);
    });
    }
    else if($scope.products[productindex].quantity==0)
    {
     var cityIndex = 0;
      var product={
        ProductID: $scope.products[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.products[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:0,
	product_name: $scope.products[productindex].product_name,
	'Main Category': $scope.products[productindex]['Main Category'],
	'Sub Category': $scope.products[productindex]['Sub Category'],
	'Level1 Category': $scope.products[productindex]['Level1 Category']
     };
      CartFactory.removeCartItem(product)
    .success(function(response){
      if (response == 'Removed from cart')
      {
	$scope.products[productindex].quantity=0;
      }
      Loader.toggleLoadingWithMessage(response,1000);
    })
    .error(function(error){
      Loader.toggleLoadingWithMessage(error,1000);
    }); 
    }
  };
  $scope.AddToTrendingCart = function(productindex, quantity)
  {
    if(AuthFactory.isLoggedIn() == false)
    {
      Loader.toggleLoadingWithMessage('You need to Login first.');
      return '';
    }
    var cityIndex = 0;
      var product={
        ProductID: $scope.products[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.products[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:1,
	product_name: $scope.products[productindex].product_name,
	'Main Category': $scope.products[productindex]['Main Category'],
	'Sub Category': $scope.products[productindex]['Sub Category'],
	'Level1 Category': $scope.products[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       Loader.toggleLoadingWithMessage(response,2000);
    }).error(function(error){
      Loader.toggleLoadingWithMessage('Unable to add. Please try after sometime');
      console.log(error);
    });
  };
  $scope.SearchProduct= function(query)
  {
    console.log(query);
     ProductFactory.searchProduct('Grocery',query)
   .success(function(reply){
     if (reply == 'Unable to Fetch')
     {
       Loader.toggleLoadingWithMessage('Sorry Unable to fetch Products right now.');
     }
     else{
       $scope.products=[];
       if (Object.keys(reply).length)
       {
	$scope.noresults=false;
	 for (var i=0; i< Object.keys(reply).length; i++)
	  {
	    $scope.products.push(reply[i]);
	    $scope.products[i].quantity=0;
	  }
	}
	else{
	  $scope.noresults=true;
	}
     }
   })
   .error(function(error){
     Loader.toggleLoadingWithMessage('Unable to Fetch Products right now.');
   });
  }
  $scope.quantity='';
}])

.controller('LoginSignup',['$scope', 'UserFactory', 'Loader', '$state', 'AuthFactory', function($scope, UserFactory, Loader, $state, AuthFactory) {
  console.log('Login Signup');
  $scope.showLogin=true;
  $scope.signupuser={
    Name:'',
    Email: '',
    Mobile: '',
    Password: ''
  };
  $scope.user={
    Email:AuthFactory.getEmail(),
    Password: AuthFactory.getPassword(),
    Mobile:''
  };
  $scope.Login = function()
  {
    Loader.toggleLoadingWithMessage('Signing in, please wait',2000);
    UserFactory.login(JSON.stringify($scope.user))
     .success(function(resp){
       if (resp=='Login Success')
       {
	 Loader.toggleLoadingWithMessage('Welcome to Shopkare.'); 
	 AuthFactory.setEmail($scope.user.Email);
	 AuthFactory.setPassword($scope.user.Password);
 	 $state.go('app.home');
       }
       else{
	 Loader.toggleLoadingWithMessage(resp);
       }
    })
     .error(function(error){
       console.log(error);
    });
  };
  $scope.showSignup= function()
  {
    $scope.showLogin=!$scope.showLogin;
  };
  $scope.Signup = function()
  {
    UserFactory.register(JSON.stringify($scope.signupuser))
    .success(function(resp){
      Loader.toggleLoadingWithMessage(resp);
      if (resp == 'Registration Successfull')
      {
	console.log($scope.signupuser.Name);
	AuthFactory.setUser($scope.signupuser.Name);
	console.log(AuthFactory.getUser());
	AuthFactory.setEmail($scope.signupuser.Email);
	AuthFactory.setPassword($scope.signupuser.Password);
	$state.go('app.home');
      }
    })
    .error(function(err){
      console.log(err);
    })
    ;
  };
}])

.controller('OrderPlacement',['$scope', 'UserFactory', 'Loader', '$state', 'AuthFactory', '$stateParams', function($scope, UserFactory, Loader, $state, AuthFactory, $stateParams) {
  console.log('Order Placement');
  $scope.placeOrder = function()
  {
    Loader.toggleLoadingWithMessage('Thanks for placing order');
  }
}])
;