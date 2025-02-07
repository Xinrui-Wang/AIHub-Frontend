// src/store.js
import { createStore } from 'vuex';
import axios from 'axios'; // 用于 API 请求
import createPersistedState from 'vuex-persistedstate'; // 引入插件

export default createStore({
  state: {
    userInfo: JSON.parse(localStorage.getItem("userInfo")) || { nickname: "", avatar: "" },
    token: localStorage.getItem("token") || "",
    selectedModel: 'kimi', // 默认选择模型 'kimi'
    models: ['kimi', 'bert', 'gpt-3', 'gpt-4'], // 可选模型列表
    isLoggedIn: false,
    profileMenuVisible: false,
    isLoginModalVisible: false,
    sessionList: [], // 新增 sessionList 用于存储会话列表
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
      if (state.models.includes(model)) {
        state.selectedModel = model;
      } else {
        console.warn(`Model ${model} not found in the list`);
      }
    },
    setSessionList(state, sessions) {
      state.sessionList = sessions; // 更新 sessionList
    },
  },
  actions: {
    async fetchSessionList({ commit, state }) {
      const userId = state.userInfo.id;
      if (!userId) {
        console.log("用户未登录，无法获取会话列表");
        return;
      }
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/sessions/get-sessions`,
          { params: { user_id: userId, limit: 20 } }
        );
        commit('setSessionList', response.data); // 使用 mutation 更新 sessionList
      } catch (error) {
        console.error("获取会话列表失败：", error);
      }
    },
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
  plugins: [
    createPersistedState({
      key: 'myApp',
      storage: window.localStorage,
      paths: ['token', 'userInfo'],
    }),
  ],
});
