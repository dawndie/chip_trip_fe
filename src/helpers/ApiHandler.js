import { ElNotification } from "element-plus";

class ApiHandler {
  constructor() {
    this.data = null;
    this.onStart = () => {};
    this.onRequest = () => {};
    this.onResponse = () => {};
    this.onError = () => {};
    this.onFinally = () => {};
  }

  setData(data) {
    this.data = data;
    return this;
  }

  setOnStart(onStart) {
    this.onStart = onStart;
    return this;
  }

  setOnRequest(onRequest) {
    this.onRequest = onRequest;
    return this;
  }

  setOnResponse(onResponse) {
    this.onResponse = onResponse;
    return this;
  }

  setOnError(onError) {
    this.onError = onError;
    return this;
  }

  setOnFinally(onFinally) {
    this.onFinally = onFinally;
    return this;
  }

  notifyError(err) {
    ElNotification({
      title: "Success!",
      message: err
        ? err.response
          ? err.response.data.error
          : err.message
        : "Please try again",
      type: "success",
    });
  }

  async execute() {
    try {
      this.onStart();
      const data = await this.onRequest();
      if (data) {
        this.onResponse(data);
      }
    } catch (err) {
      this.notifyError(err);
      console.log(err);
      this.onError(err);
    } finally {
      this.onFinally();
    }
  }
}

export default ApiHandler;
