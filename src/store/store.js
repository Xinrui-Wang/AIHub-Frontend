// src/store.js
import { createStore } from 'vuex';
import axios from 'axios'; // 用于 API 请求
import createPersistedState from 'vuex-persistedstate'; // 引入插件
import { v4 as uuidv4 } from "uuid"; // 引入 uuid 库

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
    //sessionId: null, // 新增 sessionId
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
      //localStorage.setItem("userInfo", JSON.stringify(userInfo));
    },
    setToken(state, token) {
      state.token = token;
      //localStorage.setItem("token", token);
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
    // setSessionId(state, sessionId) {
    //   state.sessionId = sessionId;
    // },
    // clearSessionId(state) {
    //   state.sessionId = null;
    // },
  },
  actions: {
    async fetchSessionList({ commit, state }) {
      const userId = state.userInfo.id;
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
     // 新增 createNewSession 方法
     async createNewSession({ commit, state }) {
      if (!state.userInfo.id) {
        alert("请先登录！");
        return;
      }

      // 生成新的 sessionId，并暂时将 sessionName 设置为 sessionId
      const newSessionId = uuidv4();
      const newSessionName = newSessionId;

      // 创建新的会话对象
      const newSession = {
        sessionId: newSessionId,
        sessionName: newSessionName,
      };

      // 向后端发送请求，插入新会话数据
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_API_URL}/sessions/${newSessionId}/insert-session`,
          {
            userId: state.userInfo.id,
            sessionId: newSessionId,
            sessionName: newSessionName,
          }
        );

        if (response.status === 200) {
          // 后端插入成功，更新 Vuex 中的 sessionList
          commit("setSessionList", [...state.sessionList, newSession]);
          sessionStorage.setItem("sessionId", newSessionId);

          // 返回新会话 ID，以便调用组件可以使用
          return newSessionId;
        } else {
          alert("创建会话失败，请稍后再试");
        }
      } catch (error) {
        console.error("请求错误：", error);
        alert("创建会话时发生错误，请稍后再试");
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
    // updateSessionId({ commit }, sessionId) {
    //   commit("setSessionId", sessionId);
    // },
    // clearSessionId({ commit }) {
    //   commit("clearSessionId");
    // }
  },
  plugins: [
    // localStorage 持久化 token 和 userInfo
    createPersistedState({
      key: 'myApp',
      storage: window.localStorage,
      paths: ['token', 'userInfo','isLoggedIn'], 
    }),
  ],  
});