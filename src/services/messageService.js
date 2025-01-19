// messageService.js
// 实现一个公用的发送消息的函数，调用后端服务

import axios from 'axios';

//这是一个向后端发送消息的函数，参数全，可用性好
export async function sendMessage(model, text, images, audio, video, context) {
  const formData = new FormData();

  // 必须传递的参数
  formData.append('model', model);  // 模型类型
  formData.append('question', text);  // 问题文本
  formData.append('context', context || '');  // 上下文，默认为空字符串

  // 动态添加文件字段，如果存在则添加
  if (images && images.length > 0) {
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);  // 添加图片文件
    });
  }

  if (audio && audio.length > 0) {
    audio.forEach((audioFile, index) => {
      formData.append(`audio[${index}]`, audioFile);  // 添加音频文件
    });
  }

  if (video && video.length > 0) {
    video.forEach((videoFile, index) => {
      formData.append(`video[${index}]`, videoFile);  // 添加视频文件
    });
  }

  try {
    // 发送请求到后端
    const response = await axios.post('http://127.0.0.1:8000/chat', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'  // 确保是文件上传格式
      }
    });

    console.log(response.data);  // 后端返回的结果打印到前端控制台
    return response.data;  // 返回后端的响应数据
  } catch (error) {
    console.error("发送请求失败:", error);
    throw error;  // 抛出错误，以便调用者可以捕获
  }
}
