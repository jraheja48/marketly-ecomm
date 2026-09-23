export const Constants = {
  API_END_POINTS: {
    GET_ALL_PRODUCTS: '/GetAllProducts',
    GET_ALL_CATEGORIES: '/GetAllCategory',
    FILTER_PRODUCT_BY_CAT_ID: '/GetAllProductsByCategoryId?id=',
    REGISTER_USER: '/RegisterCustomer',
    LOGIN: '/Login',
    ADD_TO_CART: '/AddToCart',
    GET_CART_ITEM_BY_CUST_ID: '/GetCartProductsByCustomerId?id=',
    DELETE_PRODUCT_FROM_CART: '/DeleteProductFromCartById?id=',
    PLACE_ORDER: '/PlaceOrder',
    CANCEL_ORDER: '/cancelOrder',
  },

  LOGIN_STORAGE_KEY: 'loggedUserData',
};
