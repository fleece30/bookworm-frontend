import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addToCartThunk = createAsyncThunk(
  "cart/addtocart",
  async (itemData) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    const data = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/user/addtocart`,
      {
        userId: itemData.userId,
        book: itemData.book,
      },
      config
    );
    return data.data.cart.length;
  }
);

export const getCartThunk = createAsyncThunk("cart/getcart", async () => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  const data = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/api/auth/user`,
    config
  );
  return {
    cartItemCount: data.data.cart.length,
    tokens: data.data.tokenCount,
    cart: data.data.cart,
  };
});

export const removeFromCartThunk = createAsyncThunk(
  "cart/removefromcart",
  async (itemData) => {
    const data = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/user/removefromcart`,
      {
        userId: itemData.userId,
        bookId: itemData.bookId,
      }
    );
    return {
      cartItemCount: data.data.cart.length,
      cart: data.data.cart,
    };
  }
);

export const issueWithTokenThunk = createAsyncThunk(
  "token/issuewithtoken",
  async (itemData) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    const data = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/admin/issuewithtokens`,
      {
        userId: itemData.userId,
        books: itemData.books,
        date: new Date(),
        totalPrice: itemData.totalPrice,
      },
      config
    );
    return data.data.tokenCount;
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItemCount: 0,
    tokens: 0,
    cart: [],
  },
  extraReducers: {
    [addToCartThunk.fulfilled](state, { payload }) {
      state.cartItemCount = payload;
    },
    [getCartThunk.fulfilled](state, { payload }) {
      state.cart = payload.cart;
      state.cartItemCount = payload.cartItemCount;
      state.tokens = payload.tokens;
    },
    [removeFromCartThunk.fulfilled](state, { payload }) {
      state.cartItemCount = payload.cartItemCount;
      state.cart = payload.cart;
    },
    [issueWithTokenThunk.fulfilled](state, { payload }) {
      state.tokens = payload;
      state.cartItemCount = 0;
      state.cart = [];
    },
  },
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
