// src/store.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    userInfo: JSON.parse(localStorage.getItem("userInfo")) || { nickname: "", avatar: "" },
    token: localStorage.getItem("token") || "",
    selectedModel: 'kimi', // 默认选择模型 'kimi'
    models: ['kimi', 'bert', 'gpt-3', 'gpt-4'], // 可选模型列表
    isLoggedIn: false,
    profileMenuVisible: false,
    isLoginModalVisible: false,
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    setLoggedIn(state, status) {
      state.isLoggedIn = status;
    },
    setProfileMenuVisible(state, status) {
      state.profileMenuVisible = status;
    },
    setLoginModalVisible(state, status) {
      state.isLoginModalVisible = status;
    },
    setSelectedModel(state, model) {
      if (state.models.includes(model)) { // 检查模型是否在列表中
        state.selectedModel = model;
      } else {
        console.warn(`Model ${model} not found in the list`);
      }
    },
  },
  actions: {
    updateUserInfo({ commit }, userInfo) {
      commit('setUserInfo', userInfo);
    },
    updateToken({ commit }, token) {
      commit('setToken', token);
    },
    updateLoginStatus({ commit }, status) {
      commit('setLoggedIn', status);
    },
    toggleProfileMenu({ commit }, status) {
      commit('setProfileMenuVisible', status);
    },
    toggleLoginModal({ commit }, status) {
      commit('setLoginModalVisible', status);
    },
    updateSelectedModel({ commit }, model) {
      commit('setSelectedModel', model);
    },
  },
});