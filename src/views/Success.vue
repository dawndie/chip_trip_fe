<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 mx-auto mt-5">
        <div class="payment">
          <div class="payment_header">
            <div class="check">
              <font-awesome-icon icon="check" />
            </div>
          </div>
          <div class="content">
            <h1>Thanh toán hoàn tất</h1>
            <p>
              Quý khách đã hoàn tất đặt phòng, chúc quý khách có một kì nghỉ vui
              vẻ
            </p>
            <a href="http://localhost:8081/">Về trang chủ</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.payment {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  margin-top: 120px;
  margin-bottom: 300px;
  border: 1px solid #f2f2f2;
  height: 280px;
  border-radius: 20px;
  background: #fff;
}
.payment_header {
  background: #47c8a2;
  padding: 20px;
  border-radius: 20px 20px 0px 0px;
}

.check {
  margin: 0px auto;
  width: 50px;
  height: 50px;
  border-radius: 100%;
  background: #fff;
  text-align: center;
}

.check i {
  vertical-align: middle;
  line-height: 50px;
  font-size: 30px;
}

.content {
  text-align: center;
}

.content h1 {
  font-size: 25px;
  padding-top: 25px;
}

.content p {
  padding-bottom: 10px;
}

.content a {
  width: 200px;
  height: 35px;
  color: black;
  border-radius: 30px;
  padding: 5px 10px;
  background: #fff;
  transition: all ease-in-out 0.3s;
  text-decoration: none;
  border: 2px solid #47c8a2;
}

.content a:hover {
  /* text-decoration: none; */
  background: #47c8a2;
  color: #fff;
}

.payment svg {
  color: #47c8a2;
  padding-top: 10px;
  height: 30px;
}
</style>
